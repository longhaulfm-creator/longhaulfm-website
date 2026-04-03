import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // AzuraCast album art
      { protocol: 'https', hostname: '*.longhaulfm.co.za' },
      // Supabase storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Required for Supabase auth cookies
  experimental: {
    serverActions: { allowedOrigins: ['longhaulfm.co.za'] },
  },
}

export default nextConfig