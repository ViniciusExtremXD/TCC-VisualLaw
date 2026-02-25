import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const repo = (process.env.NEXT_PUBLIC_REPO_NAME || "").trim();
if (!repo) {
  console.log("[prepare-gh-pages-out] NEXT_PUBLIC_REPO_NAME is empty. Skipping mirror.");
  process.exit(0);
}

const outDir = path.resolve("out");
if (!existsSync(outDir)) {
  console.log("[prepare-gh-pages-out] out/ does not exist. Skipping mirror.");
  process.exit(0);
}

const repoDir = path.join(outDir, repo);
rmSync(repoDir, { recursive: true, force: true });
mkdirSync(repoDir, { recursive: true });

for (const entry of readdirSync(outDir)) {
  if (entry === repo) {
    continue;
  }

  cpSync(path.join(outDir, entry), path.join(repoDir, entry), {
    recursive: true,
    force: true,
  });
}

console.log(`[prepare-gh-pages-out] Mirrored out/* -> out/${repo}/*`);
