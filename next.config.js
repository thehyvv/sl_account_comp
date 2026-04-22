/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Docker/Cloud Run deployment — outputs a minimal standalone server
  output: 'standalone',
}

module.exports = nextConfig
