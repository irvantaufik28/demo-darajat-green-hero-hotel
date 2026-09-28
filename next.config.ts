import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/kamar-suite/:path*", destination: "/rooms/:path*", permanent: true },
      { source: "/booking/pilihan-tambahan/:path*", destination: "/booking/extras/:path*", permanent: true },
      { source: "/booking/data-tamu/:path*", destination: "/booking/guest-details/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
