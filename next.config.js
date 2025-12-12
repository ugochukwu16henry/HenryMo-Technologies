/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip type checking - Express routes in src/ are separate and have their own tsconfig
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.next.json',
  },
  // Reduce compilation time
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Environment variables that should be available on the client
  env: {
    // Add any public env vars here if needed
  },
  // Turbopack configuration for Next.js 16+
  // Note: Custom webpack config is kept as fallback if needed with --webpack flag
  turbopack: {},
  // Webpack optimization (used when running with --webpack flag)
  webpack: (config, { isServer }) => {
    // Disable webpack cache to avoid Windows symlink issues
    config.cache = false;
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
