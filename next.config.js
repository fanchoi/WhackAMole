/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // 忽略 TypeScript 构建错误
  typescript: {
    ignoreBuildErrors: true,
  },
  // 忽略 ESLint 错误
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;

