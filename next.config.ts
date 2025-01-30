import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // Allow all paths from this hostname
      },
      {
        protocol: "https",
        hostname: "up.yimg.com",
        pathname: "/**", // Allow all paths from this hostname
      },
      {
        protocol: "https",
        hostname: "images.creativemarket.com",
        pathname: "/**", // Allow all paths from this hostname
      },
    ],
  },
};

export default nextConfig;
