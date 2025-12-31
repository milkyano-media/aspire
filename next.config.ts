import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10MB in bytes for file attachments
    },
  },
};

export default nextConfig;
