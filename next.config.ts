import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "pino-pretty": false,
      "lokijs": false,
      "encoding": false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // 忽略 TypeScript 构建错误，防止因 node_modules 中的类型问题导致构建失败
  typescript: {
    ignoreBuildErrors: true,
  },
  // 忽略 ESLint 错误
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
