import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 3100);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let target = path.join(root, safePath);

  if (existsSync(target) && statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  } else if (!path.extname(target)) {
    const htmlTarget = path.join(target, "index.html");
    if (existsSync(htmlTarget)) {
      target = htmlTarget;
    }
  }

  return target;
}

const server = createServer((request, response) => {
  const target = resolveRequestPath(request.url ?? "/");

  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const ext = path.extname(target).toLowerCase();
  response.writeHead(200, {
    "content-type": contentTypes[ext] ?? "application/octet-stream",
  });
  createReadStream(target).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  const script = path.relative(process.cwd(), fileURLToPath(import.meta.url));
  console.log(`[${script}] serving ${root} at http://127.0.0.1:${port}`);
});
