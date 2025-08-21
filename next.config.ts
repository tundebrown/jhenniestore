// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
    i18n: {
    locales: ['en-US', 'fr', 'de'],
    defaultLocale: 'en-US',
  },
};

export default nextConfig;
