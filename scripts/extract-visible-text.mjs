import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

export function extractVisibleTextFromHtml(html) {
  const withoutHiddenBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  const withLineBreaks = withoutHiddenBlocks
    .replace(/<\/(p|div|section|article|header|footer|main|h[1-6]|li|tr|br)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ");

  return decodeHtmlEntities(withLineBreaks.replace(/<[^>]+>/g, " "))
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const htmlArg = process.argv[2];
  const txtArg = process.argv[3];

  if (!htmlArg || !txtArg) {
    throw new Error(
      "Uso: node scripts/extract-visible-text.mjs caminho/source.html caminho/source.txt"
    );
  }

  const htmlPath = path.resolve(ROOT, htmlArg);
  const txtPath = path.resolve(ROOT, txtArg);
  const html = await fs.readFile(htmlPath, "utf8");
  const text = extractVisibleTextFromHtml(html);
  await fs.mkdir(path.dirname(txtPath), { recursive: true });
  await fs.writeFile(txtPath, text + "\n", "utf8");
  console.log(`Texto extraido: ${path.relative(ROOT, txtPath)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
