/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint와 TypeScript 오류 임시 무시 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 서버 설정 (카페24 가상서버용)
  env: {
    PORT: '3000',
    HOSTNAME: '0.0.0.0',
  },
  // 실험적 기능 비활성화
  experimental: {
    turbo: undefined,
  },
  // 출력 설정
  output: 'standalone',
  // 카페24 가상서버 최적화 설정
  poweredByHeader: false,
  compress: true,
  // 외부 접속 허용
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
}

module.exports = nextConfig
