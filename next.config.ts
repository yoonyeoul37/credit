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
  // 빌드 시 에러 체크 비활성화 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig
