/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: per-route `api` config (e.g. bodyParser limits) should be set
  // in each API route file using `export const config = { api: { ... } }`.
  // Environment variables that should be available on the client
  env: {
    // Add any public env vars here if needed
  },
};

module.exports = nextConfig;
