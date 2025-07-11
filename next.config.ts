import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 일반 Next.js 서버 모드로 복원
  // output: 'export', // 제거
  // trailingSlash: true, // 제거
  // skipTrailingSlashRedirect: true, // 제거
  // distDir: 'out', // 제거
  images: {
    unoptimized: true
  },
  // 빌드 시 에러 체크 비활성화 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 카페24 서버 최적화
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig
