import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'better-auth', '@neondatabase/serverless', '@prisma/adapter-neon'],
};

export default nextConfig;
