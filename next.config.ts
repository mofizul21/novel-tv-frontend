import type { NextConfig } from "next";

// Derived from the same env var the API client uses, so the allowed image
// host always matches wherever the backend actually is (the Hostinger demo
// subdomain is temporary and expected to change).
const apiHostname = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
).hostname;

const nextConfig: NextConfig = {
  images: {
    // The optimizer's disk cache can serve a stale file after you swap an
    // image under the same name during development. Skip it in dev so
    // <Image> reads straight from /public; production keeps optimization on.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiHostname,
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: apiHostname,
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
