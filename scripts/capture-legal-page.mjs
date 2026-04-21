import crypto from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { chromium } from "playwright";

import {
  CAPTURE_ACCEPT_LANGUAGE,
  CAPTURE_USER_AGENT,
  CORPUS_PACKAGES,
} from "./corpus-config.mjs";
import { writeSha256Sums } from "./hash-corpus-files.mjs";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "data", "corpus");
const DEFAULT_WAIT_MS = 4000;
const execFileAsync = promisify(execFile);

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function normalizeText(value) {
  return (value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function contentHash(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildTextPdfHtml({ title, url, capturedText }) {
  const blocks = capturedText
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.45; color: #111; }
    h1 { font-size: 18px; margin: 0 0 6px; }
    .meta { font-size: 10px; color: #555; margin-bottom: 18px; word-break: break-all; }
    p { margin: 0 0 8px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Fonte oficial capturada: ${escapeHtml(url)}</div>
  ${blocks}
</body>
</html>`;
}

function detectAccessLimitations({ status, text, html }) {
  const visibleText = (text ?? "").toLowerCase();
  const body = `${text}\n${html}`.toLowerCase();
  const shortText = normalizeText(text).length < 600;
  const authRequired =
    /(log in|login|entrar no facebook|entre no facebook|iniciar sessao|iniciar sessão)/i.test(visibleText) &&
    shortText;
  const rateLimited =
    status === 429 ||
    /(too many requests|rate limit|muitas solicitacoes|muitas solicitações)/i.test(visibleText) ||
    (shortText && /\b429\b/i.test(visibleText));
  const blocked =
    /(temporarily blocked|you.?re temporarily blocked|bloqueado temporariamente|access denied|captcha required|prove you are human|confirme que voce|confirme que você)/i.test(
      visibleText
    );
  const emptyOrTruncated = normalizeText(text).length < 200;

  return {
    auth_required: authRequired,
    rate_limited: rateLimited,
    blocked,
    empty_or_truncated: emptyOrTruncated,
    has_access_limitation: authRequired || rateLimited || blocked || emptyOrTruncated,
  };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptRawFetch(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "accept-language": CAPTURE_ACCEPT_LANGUAGE,
        "user-agent": CAPTURE_USER_AGENT,
      },
      signal: AbortSignal.timeout(60000),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const html = contentType.includes("text") || contentType.includes("html")
      ? await response.text()
      : "";

    const limitations = detectAccessLimitations({
      status: response.status,
      text: html,
      html,
    });

    return {
      ok: response.ok,
      status: response.status,
      resolved_url: response.url,
      content_type: contentType,
      body_length: html.length,
      limitations,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      resolved_url: url,
      content_type: null,
      body_length: 0,
      limitations: {
        auth_required: false,
        rate_limited: false,
        blocked: false,
        empty_or_truncated: true,
        has_access_limitation: true,
      },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function renderPageCapture(browser, item, outDir) {
  const context = await browser.newContext({
    locale: item.language === "en" ? "en-US" : "pt-BR",
    viewport: { width: 1440, height: 1800 },
    userAgent: CAPTURE_USER_AGENT,
    extraHTTPHeaders: {
      "Accept-Language": CAPTURE_ACCEPT_LANGUAGE,
    },
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(item.official_url ?? item.url, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.emulateMedia({ media: "screen" });
    await page.waitForTimeout(DEFAULT_WAIT_MS);

    const html = await page.content();
    const text = normalizeText(
      await page.evaluate(() => document.body?.innerText ?? "")
    );
    const resolvedUrl = page.url();
    const status = response?.status() ?? null;
    const limitations = detectAccessLimitations({ status, text, html });

    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "source.html"), html, "utf8");
    await fs.writeFile(path.join(outDir, "source.txt"), text + "\n", "utf8");
    await page.screenshot({
      path: path.join(outDir, "source-screenshot.png"),
      fullPage: true,
    });
    await page.setContent(
      buildTextPdfHtml({
        title: item.title,
        url: item.official_url ?? item.url,
        capturedText: text,
      }),
      { waitUntil: "load" }
    );
    await page.pdf({
      path: path.join(outDir, "source.pdf"),
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "10mm", bottom: "12mm", left: "10mm" },
    });

    return {
      status,
      resolved_url: resolvedUrl,
      text_length: text.length,
      content_hash_sha256: contentHash(text),
      limitations,
    };
  } finally {
    await context.close();
  }
}

async function downloadRelatedDocument(item, outDir, capturedAt) {
  await fs.mkdir(outDir, { recursive: true });
  const fileName = item.file_name ?? "source.bin";
  const outputPath = path.join(outDir, fileName);
  const response = await fetch(item.url, {
    redirect: "follow",
    headers: {
      "accept-language": CAPTURE_ACCEPT_LANGUAGE,
      "user-agent": CAPTURE_USER_AGENT,
    },
    signal: AbortSignal.timeout(120000),
  });
  let buffer = Buffer.from(await response.arrayBuffer());
  let captureMethod = "raw-http-download";

  if ((!response.ok || buffer.length === 0) && process.platform === "win32") {
    await execFileAsync("curl.exe", [
      "-L",
      "--fail",
      "--silent",
      "--show-error",
      "--output",
      outputPath,
      item.url,
    ]);
    buffer = await fs.readFile(outputPath);
    captureMethod = "raw-http-download+curl-fallback";
  } else {
    await fs.writeFile(outputPath, buffer);
  }

  if (buffer.length === 0) {
    throw new Error(`Download vazio para ${item.url}`);
  }

  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const metadata = {
    doc_id: item.id,
    title: item.title,
    platform: "related",
    type: item.type,
    language: item.language,
    official_url: item.url,
    resolved_url: response.url,
    captured_at: capturedAt,
    capture_method: captureMethod,
    capture_status: response.ok || captureMethod.includes("curl-fallback") ? "captured" : "failed_http_download",
    content_hash_sha256: hash,
    source_files: [fileName],
    related_urls: {},
    notes: response.ok
      ? "Documento relacionado baixado diretamente de fonte oficial."
      : `Download retornou HTTP ${response.status}.`,
  };

  await fs.writeFile(
    path.join(outDir, "metadata.json"),
    JSON.stringify(metadata, null, 2) + "\n",
    "utf8"
  );
  await fs.writeFile(
    path.join(outDir, "capture-notes.md"),
    [
      "# Capture notes",
      "",
      `- official_url: ${item.url}`,
      `- captured_at: ${capturedAt}`,
      `- method: ${captureMethod}`,
      `- http_status: ${response.status}`,
      `- bytes_saved: ${buffer.length}`,
      `- authentication_required: false`,
      `- rate_limit_or_blocking_observed: ${response.ok ? "false" : "unknown"}`,
      "- visual_verification: not_applicable_binary_download",
      "",
    ].join("\n"),
    "utf8"
  );
  await writeSha256Sums(outDir);
  return metadata.capture_status;
}

async function writePrimaryMetadata({ corpusPackage, outDir, capturedAt, rawAttempt, renderResult }) {
  const limitations = renderResult.limitations;
  const captureStatus = limitations.has_access_limitation
    ? "captured_with_access_limitation"
    : "captured";

  const metadata = {
    doc_id: corpusPackage.doc_id,
    title: corpusPackage.title,
    platform: corpusPackage.platform,
    type: corpusPackage.type,
    language: corpusPackage.language,
    official_url: corpusPackage.official_url,
    resolved_url: renderResult.resolved_url,
    captured_at: capturedAt,
    capture_method:
      "raw-http-probe+playwright-chromium+source.html+source.txt+text-print-source.pdf+source-screenshot.png",
    capture_status: captureStatus,
    content_hash_sha256: renderResult.content_hash_sha256,
    source_files: [
      "source.html",
      "source.txt",
      "source.pdf",
      "source-screenshot.png",
      "metadata.json",
      "capture-notes.md",
      "SHA256SUMS",
    ],
    related_urls: corpusPackage.related_urls,
    source_kind: corpusPackage.source_kind,
    app_type: corpusPackage.app_type,
    objective: corpusPackage.objective,
    raw_http_probe: rawAttempt,
    browser_capture: {
      http_status: renderResult.status,
      text_length: renderResult.text_length,
      access_limitations: limitations,
      visually_verified: false,
    },
    notes:
      "Captura publica sem autenticacao e sem crawler. Verificar manualmente source-screenshot.png antes de usar em banca.",
  };

  await fs.writeFile(
    path.join(outDir, "metadata.json"),
    JSON.stringify(metadata, null, 2) + "\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(outDir, "capture-notes.md"),
    [
      `# ${corpusPackage.title}`,
      "",
      `- doc_id: ${corpusPackage.doc_id}`,
      `- official_url: ${corpusPackage.official_url}`,
      `- resolved_url: ${renderResult.resolved_url}`,
      `- captured_at: ${capturedAt}`,
      `- locale: ${corpusPackage.language}`,
      `- user_agent: ${CAPTURE_USER_AGENT}`,
      "- browser_mode: Playwright Chromium headless",
      `- raw_http_probe_worked: ${rawAttempt.ok && !rawAttempt.limitations?.has_access_limitation}`,
      `- raw_http_status: ${rawAttempt.status ?? "unavailable"}`,
      `- raw_http_resolved_url: ${rawAttempt.resolved_url ?? "unavailable"}`,
      "- authentication_required: false during scripted capture unless flagged below",
      `- rate_limit_observed: ${limitations.rate_limited}`,
      `- blocking_observed: ${limitations.blocked}`,
      `- auth_or_login_interstitial_observed: ${limitations.auth_required}`,
      `- fallback_to_browser_rendering: true`,
      "- visual_verification: pending_manual_review",
      "- saved_files: source.html, source.txt, source.pdf, source-screenshot.png, metadata.json, capture-notes.md, SHA256SUMS",
      "- remaining_caveat: revisar manualmente o screenshot antes de citar o pacote como evidencia visual em banca",
      "",
      "## Normalizacao",
      "",
      "- `source.html` preserva o DOM renderizado pelo navegador.",
      "- `source.txt` preserva `document.body.innerText` com normalizacao apenas de espacos e quebras repetidas.",
      "- `source.pdf` e uma impressao textual derivada de `source.txt` para manter o corpus versionavel; a evidencia visual fica em `source-screenshot.png`.",
      "- Nenhum resumo ou reescrita semantica foi aplicado.",
      "",
    ].join("\n"),
    "utf8"
  );

  await writeSha256Sums(outDir);
  return metadata;
}

async function captureRelated(browser, corpusPackage, capturedAt) {
  const related = corpusPackage.related_documents ?? [];
  const statuses = [];

  for (const item of related) {
    const outDir = path.join(CORPUS_DIR, corpusPackage.package_id, "related", item.id);
    try {
      if (item.method === "download") {
        const status = await downloadRelatedDocument(item, outDir, capturedAt);
        statuses.push({ id: item.id, status });
      } else {
        const rawAttempt = await attemptRawFetch(item.url);
        const renderResult = await renderPageCapture(
          browser,
          { ...item, official_url: item.url },
          outDir
        );
        await writePrimaryMetadata({
          corpusPackage: {
            ...item,
            doc_id: item.id,
            package_id: item.id,
            platform: corpusPackage.platform,
            official_url: item.url,
            source_kind: "frozen_official_related_reference",
            app_type: corpusPackage.app_type,
            objective: `Documento relacionado ao pacote ${corpusPackage.package_id}.`,
            related_urls: {},
          },
          outDir,
          capturedAt,
          rawAttempt,
          renderResult,
        });
        statuses.push({
          id: item.id,
          status: renderResult.limitations.has_access_limitation
            ? "captured_with_access_limitation"
            : "captured",
        });
      }
    } catch (error) {
      await fs.mkdir(outDir, { recursive: true });
      const metadata = {
        doc_id: item.id,
        title: item.title,
        platform: corpusPackage.platform,
        type: item.type,
        language: item.language,
        official_url: item.url,
        captured_at: capturedAt,
        capture_method: item.method,
        capture_status: "failed",
        content_hash_sha256: null,
        source_files: [],
        related_urls: {},
        notes: error instanceof Error ? error.message : String(error),
      };
      await fs.writeFile(
        path.join(outDir, "metadata.json"),
        JSON.stringify(metadata, null, 2) + "\n",
        "utf8"
      );
      statuses.push({ id: item.id, status: "failed" });
    }
    await sleep(1500);
  }

  return statuses;
}

async function capturePrimaryPackage(browser, corpusPackage, options) {
  const capturedAt = options.capturedAt;
  const outDir = path.join(CORPUS_DIR, corpusPackage.package_id);
  console.log(`Capturando ${corpusPackage.package_id}: ${corpusPackage.official_url}`);

  const rawAttempt = await attemptRawFetch(corpusPackage.official_url);
  const renderResult = await renderPageCapture(browser, corpusPackage, outDir);
  const metadata = await writePrimaryMetadata({
    corpusPackage,
    outDir,
    capturedAt,
    rawAttempt,
    renderResult,
  });

  let relatedStatuses = [];
  if (options.includeRelated) {
    relatedStatuses = await captureRelated(browser, corpusPackage, capturedAt);
  }

  console.log(
    `- ${corpusPackage.package_id}: ${metadata.capture_status}, ${renderResult.text_length} chars`
  );
  return { metadata, relatedStatuses };
}

async function main() {
  const packageId = readArg("package");
  const includeRelated = !hasFlag("primary-only");
  const capturedAt = new Date().toISOString();
  const selected = packageId
    ? CORPUS_PACKAGES.filter((item) => item.package_id === packageId)
    : CORPUS_PACKAGES;

  if (selected.length === 0) {
    throw new Error(`Pacote de corpus nao encontrado: ${packageId}`);
  }

  await fs.mkdir(CORPUS_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const results = [];
    for (const corpusPackage of selected) {
      results.push(await capturePrimaryPackage(browser, corpusPackage, { capturedAt, includeRelated }));
      await sleep(2000);
    }
    const captured = results.filter((item) => item.metadata.capture_status === "captured").length;
    const warnings = results.length - captured;
    console.log(`Captura concluida. captured=${captured}; warnings=${warnings}`);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
