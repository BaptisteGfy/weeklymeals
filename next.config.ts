import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@prisma/client',
    'better-auth',
    '@neondatabase/serverless',
    '@prisma/adapter-neon',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
