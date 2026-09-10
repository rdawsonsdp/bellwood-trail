import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Restaurant imagery is copied in from each business's own site and served
  // as-is; drop this once assets are re-exported at web sizes.
  images: { unoptimized: true },
};
export default nextConfig;
