import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Restaurant imagery is copied in from each business's own site and served
  // as-is; drop this once assets are re-exported at web sizes.
  images: { unoptimized: true },
  // Card photos are uploaded through a Server Action in /admin (5 MB cap in
  // content-store.ts, plus form overhead).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};
export default nextConfig;
