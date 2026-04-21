import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CORPUS_PACKAGES } from "./corpus-config.mjs";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "data", "corpus");

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  const manifest = [];

  for (const corpusPackage of CORPUS_PACKAGES) {
    const packageDir = path.join(CORPUS_DIR, corpusPackage.package_id);
    const metadataPath = path.join(packageDir, "metadata.json");
    const metadata = (await exists(metadataPath))
      ? await readJson(metadataPath)
      : {
          doc_id: corpusPackage.doc_id,
          title: corpusPackage.title,
          platform: corpusPackage.platform,
          type: corpusPackage.type,
          language: corpusPackage.language,
          official_url: corpusPackage.official_url,
          captured_at: null,
          capture_method: null,
          capture_status: "pending_capture",
          content_hash_sha256: null,
          source_files: [],
          related_urls: corpusPackage.related_urls,
          source_kind: corpusPackage.source_kind,
          app_type: corpusPackage.app_type,
          objective: corpusPackage.objective,
        };

    manifest.push({
      document_id: metadata.doc_id,
      titulo: metadata.title,
      plataforma: metadata.platform,
      tipo: metadata.app_type ?? corpusPackage.app_type,
      idioma: metadata.language,
      coleta_referencia: metadata.captured_at,
      natureza_fonte: metadata.source_kind ?? corpusPackage.source_kind,
      objetivo_no_corpus: metadata.objective ?? corpusPackage.objective,
      official_url: metadata.official_url,
      resolved_url: metadata.resolved_url ?? null,
      source_package: `data/corpus/${corpusPackage.package_id}`,
      content_hash: metadata.content_hash_sha256,
      capture_method: metadata.capture_method,
      status: metadata.capture_status,
      source_files: metadata.source_files,
      related_urls: metadata.related_urls ?? corpusPackage.related_urls,
    });
  }

  const json = JSON.stringify(manifest, null, 2) + "\n";
  await fs.writeFile(path.join(CORPUS_DIR, "corpus-manifest.json"), json, "utf8");
  await fs.writeFile(path.join(CORPUS_DIR, "corpus_manifest.json"), json, "utf8");

  const csvRows = [
    [
      "doc_id",
      "platform",
      "type",
      "language",
      "official_url",
      "captured_at",
      "content_hash_sha256",
      "local_path",
      "status",
      "notes",
    ].join(","),
    ...manifest.map((record) =>
      [
        record.document_id,
        record.plataforma,
        record.tipo,
        record.idioma,
        record.official_url,
        record.coleta_referencia,
        record.content_hash,
        record.source_package,
        record.status,
        record.objetivo_no_corpus,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ];
  await fs.writeFile(path.join(CORPUS_DIR, "index.csv"), csvRows.join("\n") + "\n", "utf8");

  console.log(`Manifesto atualizado com ${manifest.length} pacotes.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
