import type { NextConfig } from "next";
const nextConfig: NextConfig = { devIndicators: false, allowedDevOrigins: ["127.0.0.1"], transpilePackages: ["@repo/types", "@repo/schemas"] };
export default nextConfig;
