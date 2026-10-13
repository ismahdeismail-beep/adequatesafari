/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'adequatesafaris.com', 'api.adequatesafaris.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.adequatesafaris.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return [];
    return [
      {
        source: '/api/backend/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_JOOMLA_URL: process.env.NEXT_PUBLIC_JOOMLA_URL,
  },
};

module.exports = nextConfig;