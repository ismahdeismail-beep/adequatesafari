/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'absoluteadventuresafaris.com', 'api.absoluteadventuresafaris.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.absoluteadventuresafaris.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_JOOMLA_URL: process.env.NEXT_PUBLIC_JOOMLA_URL,
  },
};

module.exports = nextConfig;