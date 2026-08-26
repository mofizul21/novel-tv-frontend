import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The optimizer's disk cache can serve a stale file after you swap an
    // image under the same name during development. Skip it in dev so
    // <Image> reads straight from /public; production keeps optimization on.
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
