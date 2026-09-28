import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateEtags: false,
  async headers() {
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
    return [
      { source: "/admin", headers: [noindex] },
      { source: "/admin/:path*", headers: [noindex] },
      { source: "/api/:path*", headers: [noindex] },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
