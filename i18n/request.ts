import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en-US', 'fr', 'de'],
    defaultLocale: 'en-US',
  },
};

export default nextConfig;
