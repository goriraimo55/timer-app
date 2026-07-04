import type { NextConfig } from "next";

// GitHub Pages(https://<user>.github.io/timer-app/)向けにビルドする場合は
// GITHUB_PAGES=true を設定する(CIワークフローで自動設定)。
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/timer-app" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
