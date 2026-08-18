/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/LaptopWiseScanner.bat',
        destination: '/api/scanner/download',
      },
    ];
  },
};

module.exports = nextConfig;
