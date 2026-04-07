import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: '/Frontend-Engineering-Challenge',
  assetPrefix: '/Frontend-Engineering-Challenge',
  devIndicators: false,
};

export default nextConfig;
