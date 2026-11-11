import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    // Spanish is the default language. Every page lives under /es or /en.
    return [{ source: "/", destination: "/es", permanent: false }];
  },
};

export default nextConfig;
