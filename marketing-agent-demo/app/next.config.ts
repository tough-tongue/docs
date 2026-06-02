import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/slides/property-type-a",
        destination: "/slides/wraparound-residence",
        permanent: true,
      },
      {
        source: "/slides/property-type-a/:path*",
        destination: "/slides/wraparound-residence/:path*",
        permanent: true,
      },
      {
        source: "/slides/property-type-b",
        destination: "/slides/sky-penthouse",
        permanent: true,
      },
      {
        source: "/slides/property-type-b/:path*",
        destination: "/slides/sky-penthouse/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
