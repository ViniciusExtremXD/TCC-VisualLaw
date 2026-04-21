import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CORPUS_PACKAGES } from "./corpus-config.mjs";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "data", "corpus");

export async function sha256File(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.name !== "SHA256SUMS") {
      files.push(fullPath);
    }
  }

  return files;
}

export async function writeSha256Sums(packageDir) {
  if (!(await pathExists(packageDir))) {
    return null;
  }

  const files = (await walkFiles(packageDir)).sort();
  const lines = [];

  for (const filePath of files) {
    const hash = await sha256File(filePath);
    const relative = path.relative(packageDir, filePath).replaceAll("\\", "/");
    lines.push(`${hash}  ${relative}`);
  }

  const output = lines.join("\n") + (lines.length > 0 ? "\n" : "");
  const outputPath = path.join(packageDir, "SHA256SUMS");
  await fs.writeFile(outputPath, output, "utf8");
  return outputPath;
}

async function main() {
  const selected = process.argv.includes("--all")
    ? CORPUS_PACKAGES
    : CORPUS_PACKAGES.filter((item) => !process.argv.includes("--primary-only") || item.source_kind !== "frozen_official_related_reference");

  const written = [];
  for (const corpusPackage of selected) {
    const packageDir = path.join(CORPUS_DIR, corpusPackage.package_id);
    const outputPath = await writeSha256Sums(packageDir);
    if (outputPath) {
      written.push(path.relative(ROOT, outputPath));
    }
  }

  console.log(`SHA256SUMS atualizados: ${written.length}`);
  for (const file of written) {
    console.log(`- ${file}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
