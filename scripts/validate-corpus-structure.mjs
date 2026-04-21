import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CORPUS_PACKAGES, CORPUS_PRIMARY_PACKAGE_IDS } from "./corpus-config.mjs";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "data", "corpus");
const REQUIRED_SOURCE_FILES = [
  "source.html",
  "source.txt",
  "source.pdf",
  "source-screenshot.png",
  "metadata.json",
  "capture-notes.md",
  "SHA256SUMS",
];
const REQUIRED_METADATA_FIELDS = [
  "doc_id",
  "title",
  "platform",
  "type",
  "language",
  "official_url",
  "captured_at",
  "capture_method",
  "capture_status",
  "content_hash_sha256",
  "source_files",
  "related_urls",
  "notes",
];
const REQUIRED_CAPTURE_NOTE_TOKENS = [
  "official_url:",
  "resolved_url:",
  "captured_at:",
  "locale:",
  "raw_http_probe_worked:",
  "fallback_to_browser_rendering:",
  "auth_or_login_interstitial_observed:",
  "rate_limit_observed:",
  "blocking_observed:",
  "visual_verification:",
  "saved_files:",
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fileSize(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

async function sha256File(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function validatePackage(corpusPackage, { required }) {
  const errors = [];
  const warnings = [];
  const packageDir = path.join(CORPUS_DIR, corpusPackage.package_id);

  if (!(await exists(packageDir))) {
    errors.push(`${corpusPackage.package_id}: diretorio ausente`);
    return { errors, warnings };
  }

  for (const fileName of REQUIRED_SOURCE_FILES) {
    const filePath = path.join(packageDir, fileName);
    if (!(await exists(filePath))) {
      (required ? errors : warnings).push(`${corpusPackage.package_id}: arquivo ausente ${fileName}`);
    } else if ((await fileSize(filePath)) === 0) {
      (required ? errors : warnings).push(`${corpusPackage.package_id}: arquivo vazio ${fileName}`);
    }
  }

  const metadataPath = path.join(packageDir, "metadata.json");
  if (!(await exists(metadataPath))) {
    return { errors, warnings };
  }

  const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
  for (const field of REQUIRED_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field] == null || metadata[field] === "") {
      errors.push(`${corpusPackage.package_id}: metadata sem campo ${field}`);
    }
  }

  if (metadata.doc_id !== corpusPackage.doc_id) {
    errors.push(`${corpusPackage.package_id}: doc_id esperado ${corpusPackage.doc_id}, recebido ${metadata.doc_id}`);
  }

  if (/failed|blocked|rate_limited|auth_required/i.test(metadata.capture_status ?? "")) {
    errors.push(`${corpusPackage.package_id}: capture_status critico ${metadata.capture_status}`);
  }

  if (metadata.capture_status === "captured_with_access_limitation") {
    errors.push(`${corpusPackage.package_id}: captura indica limitacao de acesso; revisar fonte antes de usar`);
  }

  const captureNotesPath = path.join(packageDir, "capture-notes.md");
  if (await exists(captureNotesPath)) {
    const captureNotes = await fs.readFile(captureNotesPath, "utf8");
    for (const token of REQUIRED_CAPTURE_NOTE_TOKENS) {
      if (!captureNotes.includes(token)) {
        errors.push(`${corpusPackage.package_id}: capture-notes.md sem token ${token}`);
      }
    }
  }

  const sourceTxt = path.join(packageDir, "source.txt");
  if (await exists(sourceTxt)) {
    const text = await fs.readFile(sourceTxt, "utf8");
    if (text.trim().length < 200) {
      errors.push(`${corpusPackage.package_id}: source.txt curto demais para corpus (${text.trim().length} chars)`);
    }
    const hash = crypto.createHash("sha256").update(text.trim(), "utf8").digest("hex");
    if (metadata.content_hash_sha256 && metadata.content_hash_sha256 !== hash) {
      errors.push(`${corpusPackage.package_id}: hash do source.txt diverge do metadata`);
    }
  }

  const sumsPath = path.join(packageDir, "SHA256SUMS");
  if (await exists(sumsPath)) {
    const sums = await fs.readFile(sumsPath, "utf8");
    for (const fileName of REQUIRED_SOURCE_FILES.filter((item) => item !== "SHA256SUMS")) {
      if (!sums.includes(`  ${fileName}`)) {
        warnings.push(`${corpusPackage.package_id}: SHA256SUMS nao lista ${fileName}`);
      }
    }
    const sourceHtmlPath = path.join(packageDir, "source.html");
    if (await exists(sourceHtmlPath)) {
      const htmlHash = await sha256File(sourceHtmlPath);
      if (!sums.includes(`${htmlHash}  source.html`)) {
        warnings.push(`${corpusPackage.package_id}: hash de source.html nao confere com SHA256SUMS`);
      }
    }
  }

  return { errors, warnings };
}

async function main() {
  const allErrors = [];
  const allWarnings = [];

  for (const corpusPackage of CORPUS_PACKAGES) {
    const result = await validatePackage(corpusPackage, {
      required: CORPUS_PRIMARY_PACKAGE_IDS.includes(corpusPackage.package_id),
    });
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  if (!(await exists(path.join(CORPUS_DIR, "corpus-manifest.json")))) {
    allErrors.push("manifesto ausente: data/corpus/corpus-manifest.json");
  }

  if (allWarnings.length > 0) {
    console.warn("Avisos:");
    for (const warning of allWarnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (allErrors.length > 0) {
    console.error("Falhas de corpus:");
    for (const error of allErrors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Corpus validado: pacotes primarios completos e hashes coerentes.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
