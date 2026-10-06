import type { NextConfig } from "next";

const backendApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendApiBaseUrl) return [];

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApiBaseUrl}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // Legacy Indonesian routes → English routes
      { source: "/kamar-suite/:path*", destination: "/rooms/:path*", permanent: true },
      { source: "/booking/pilihan-tambahan/:path*", destination: "/booking/extras/:path*", permanent: true },
      { source: "/booking/data-tamu/:path*", destination: "/booking/guest-details/:path*", permanent: true },
      // Experience pages: old Indonesian slugs → new English slugs
      { source: "/experiences/kambing-guling/:path*", destination: "/experiences/roast-goat/:path*", permanent: true },
      { source: "/experiences/ayam-bakar/:path*", destination: "/experiences/grilled-chicken/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
