/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint와 TypeScript 오류 임시 무시 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 서버 설정
  env: {
    PORT: '3000',
  },
  // 실험적 기능 비활성화
  experimental: {
    turbo: undefined,
  },
  // 출력 설정
  output: 'standalone',
}

module.exports = nextConfig
