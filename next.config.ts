import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // 카페24 정적 호스팅 최적화
  assetPrefix: '',
  basePath: '',
};

module.exports = nextConfig
