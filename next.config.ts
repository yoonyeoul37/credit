import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ESLint 오류 무시하고 빌드 진행
  },
  typescript: {
    ignoreBuildErrors: true,  // TypeScript 오류도 무시하고 빌드 진행
  },
};

export default nextConfig;
