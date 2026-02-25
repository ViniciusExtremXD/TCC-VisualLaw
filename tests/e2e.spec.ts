import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repo = process.env.NEXT_PUBLIC_REPO_NAME || "visual-law-tcc";
const basePath = `/${repo}`;

const artifactsRoot = path.resolve("artifacts");
const screenshotsDir = path.join(artifactsRoot, "screenshots");
const logsDir = path.join(artifactsRoot, "logs");
const exportsDir = path.resolve("tmp", "exports");

const expectedExportFiles = [
  "audit.json",
  "clauses.json",
  "explanations.json",
  "highlights.json",
];

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir: string) {
  ensureDir(dir);
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

function parseJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateClauses(data: unknown): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every((item) => {
    const row = item as Record<string, unknown>;
    return (
      typeof row.clause_id === "string" &&
      typeof row.doc_id === "string" &&
      typeof row.text === "string" &&
      typeof row.category === "string" &&
      typeof row.impact === "string"
    );
  });
}

function validateHighlights(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const map = data as Record<string, unknown>;
  const allValues = Object.values(map);
  if (allValues.length === 0) return false;
  return allValues.every((arr) => {
    if (!Array.isArray(arr)) return false;
    return arr.every((item) => {
      const h = item as Record<string, unknown>;
      return (
        typeof h.term_id === "string" &&
        typeof h.start === "number" &&
        typeof h.end === "number" &&
        typeof h.match === "string"
      );
    });
  });
}

function validateExplanations(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const map = data as Record<string, unknown>;
  const allValues = Object.values(map);
  if (allValues.length === 0) return false;
  return allValues.every((item) => {
    const e = item as Record<string, unknown>;
    return (
      typeof e.meaning === "string" &&
      typeof e.why_it_matters === "string" &&
      typeof e.what_you_can_do === "string" &&
      typeof e.category === "string" &&
      typeof e.impact === "string" &&
      Array.isArray(e.lgpd_refs)
    );
  });
}

function validateAudit(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const audit = data as Record<string, unknown>;
  const pipeline = audit.pipeline;
  const clausesAudit = audit.clauses_audit;
  return Array.isArray(pipeline) && pipeline.length >= 5 && !!clausesAudit && typeof clausesAudit === "object";
}

test.describe("Visual Law MVP - static export E2E", () => {
  test.beforeAll(() => {
    cleanDir(screenshotsDir);
    cleanDir(logsDir);
    cleanDir(exportsDir);
  });

  test("fluxos completos 2.1 a 2.7 + assets static 200", async ({ page }) => {
    const staticAssetFailures: string[] = [];
    const staticAssetSuccesses: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (!url.includes(`/${repo}/_next/static/`)) {
        return;
      }
      if (response.status() >= 400) {
        staticAssetFailures.push(`${response.status()} ${url}`);
      } else {
        staticAssetSuccesses.push(`${response.status()} ${url}`);
      }
    });

    // 2.1 Home (demo/mock)
    await page.goto(`${basePath}/`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /Demo/i })).toBeVisible();
    await page.getByRole("button", { name: /Demo/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, "HOME_LOADED.png"), fullPage: true });

    // 2.2 Home (texto colado)
    await page.getByRole("button", { name: /Novo/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/?$`));
    await page.locator("#text-input").fill(
      "Termo de teste para processamento. O controlador pode compartilhar dados pessoais com terceiros para finalidade especifica e garantir direito de exclusao."
    );
    await page.getByRole("button", { name: /Processar/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, "HOME_PASTED.png"), fullPage: true });

    // Recarrega demo para garantir navegacao com multiplas clausulas
    await page.getByRole("button", { name: /Novo/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/?$`));
    await page.getByRole("button", { name: /Demo/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));

    // 2.3 Reader navegacao + progresso
    const progress = page.getByText(/\d+\s*\/\s*\d+/).first();
    const initialProgress = (await progress.textContent())?.trim() || "";
    await page.getByRole("button", { name: /Pr.xima|Proxima/i }).click();
    await expect(progress).not.toHaveText(initialProgress);
    await page.getByRole("button", { name: /Anterior/i }).click();
    await expect(progress).toHaveText(initialProgress);
    expect(await page.locator(".badge-ios").count()).toBeGreaterThanOrEqual(2);
    await page.screenshot({ path: path.join(screenshotsDir, "READER_NAV.png"), fullPage: true });

    // 2.4 Highlight proof modal
    const modeButton = page.getByRole("button", { name: /Produto|Acad/i }).first();
    const modeText = await modeButton.textContent();
    if (modeText && /Produto/i.test(modeText)) {
      await modeButton.click();
    }
    await expect(page.getByText(/Modo Acad/i)).toBeVisible();
    const firstHighlight = page.locator("mark.term-highlight").first();
    await expect(firstHighlight).toBeVisible();
    await firstHighlight.click();
    await expect(page.getByRole("heading", { name: /Prova do Highlight/i })).toBeVisible();
    await expect(page.getByText(/term_id/i)).toBeVisible();
    await expect(page.getByText(/start\s*\/\s*end/i)).toBeVisible();
    await expect(page.getByText(/Campo usado/i)).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, "HIGHLIGHT_PROOF.png"), fullPage: true });
    await page.getByRole("link", { name: /Ver card completo/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/term/[^/]+/?$`));

    // 2.5 Term card + semiotica
    await expect(page.getByText(/O que significa/i)).toBeVisible();
    await expect(page.getByText(/Por que importa/i)).toBeVisible();
    await expect(page.getByText(/O que voc/i)).toBeVisible();
    await expect(page.getByText(/Camada Semi/i)).toBeVisible();
    await expect(page.getByText(/Significante/i)).toBeVisible();
    await expect(page.getByText(/Significado/i)).toBeVisible();
    await expect(page.getByText(/Regra/i)).toBeVisible();
    await expect(page.getByRole("cell", { name: /Categoria/i })).toBeVisible();
    await expect(page.getByRole("cell", { name: /Impacto/i })).toBeVisible();
    await expect(page.getByRole("cell", { name: /Direitos LGPD/i })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, "TERM_CARD.png"), fullPage: true });
    await page.getByRole("link", { name: /Voltar para leitura/i }).first().click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));

    // 2.6 Modo academico + audit drawer
    await expect(page.getByText(/Modo Acad/i)).toBeVisible();
    await page.getByRole("button", { name: /Ver auditoria/i }).click();
    await expect(page.getByRole("heading", { name: /Auditoria/i })).toBeVisible();
    expect(await page.locator(".stepper-dot").count()).toBeGreaterThanOrEqual(5);
    const auditDrawer = page.locator(".audit-drawer");
    await auditDrawer.getByRole("button", { name: /Classifica/i }).click();
    await expect(page.getByText(/Regras Disparadas/i)).toBeVisible();
    await expect(page.locator("code", { hasText: "RULE_CAT_" }).first()).toBeVisible();
    await auditDrawer.getByRole("button", { name: /L.xico|Lexico/i }).click();
    await expect(page.getByText(/Offsets/i).first()).toBeVisible();
    await expect(page.getByText(/Campo do l.xico|Campo do l/i).first()).toBeVisible();
    await auditDrawer.getByRole("button", { name: /Semi/i }).click();
    await expect(page.getByText(/Significante/i)).toBeVisible();
    await expect(page.getByText(/Significado/i)).toBeVisible();
    await expect(page.getByText(/Regra/i)).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, "AUDIT_DRAWER.png"), fullPage: true });
    await page.locator(".audit-drawer-overlay").click({ position: { x: 15, y: 15 } });
    await expect(page.locator(".audit-drawer")).toHaveCount(0);

    // 2.7 Export JSON + schema checks
    const captureDownloads = (async () => {
      const dl = [];
      for (let i = 0; i < 4; i++) {
        dl.push(await page.waitForEvent("download", { timeout: 15_000 }));
      }
      return dl;
    })();
    await page.getByRole("button", { name: /Exportar/i }).click();
    const downloads = await captureDownloads;

    for (const download of downloads) {
      const suggested = download.suggestedFilename();
      await download.saveAs(path.join(exportsDir, suggested));
    }

    const exportedFiles = fs.readdirSync(exportsDir).sort();
    expect(exportedFiles).toEqual(expectedExportFiles);

    const clausesData = parseJson(path.join(exportsDir, "clauses.json"));
    const highlightsData = parseJson(path.join(exportsDir, "highlights.json"));
    const explanationsData = parseJson(path.join(exportsDir, "explanations.json"));
    const auditData = parseJson(path.join(exportsDir, "audit.json"));

    const schemaStatus = {
      clauses: validateClauses(clausesData),
      highlights: validateHighlights(highlightsData),
      explanations: validateExplanations(explanationsData),
      audit: validateAudit(auditData),
    };

    fs.writeFileSync(
      path.join(logsDir, "export-schema-validation.json"),
      JSON.stringify(schemaStatus, null, 2),
      "utf8"
    );

    expect(schemaStatus.clauses).toBeTruthy();
    expect(schemaStatus.highlights).toBeTruthy();
    expect(schemaStatus.explanations).toBeTruthy();
    expect(schemaStatus.audit).toBeTruthy();

    await page.screenshot({ path: path.join(screenshotsDir, "EXPORT_OK.png"), fullPage: true });

    fs.writeFileSync(
      path.join(logsDir, "network-static-assets.json"),
      JSON.stringify(
        {
          repo,
          ok_count: staticAssetSuccesses.length,
          failures: staticAssetFailures,
        },
        null,
        2
      ),
      "utf8"
    );

    expect(staticAssetFailures, "Nenhum 404/5xx esperado em /_next/static").toEqual([]);
    expect(staticAssetSuccesses.length).toBeGreaterThan(0);
  });
});
