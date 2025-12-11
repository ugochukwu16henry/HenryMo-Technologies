/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // Environment variables that should be available on the client
  env: {
    // Add any public env vars here if needed
  },
}

module.exports = nextConfig

