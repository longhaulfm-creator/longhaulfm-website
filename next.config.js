/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Serve APK files with correct headers
        source: '/downloads/:path*.apk',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.android.package-archive',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['your-project.supabase.co'],
  },
};