import type { NextConfig } from "next";

const repo = process.env.NEXT_PUBLIC_REPO_NAME || "";
const basePath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
