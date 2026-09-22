import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Restaurant imagery is copied in from each business's own site and served
  // as-is; drop this once assets are re-exported at web sizes.
  images: { unoptimized: true },
  // Card photos are uploaded through a Server Action in /admin (5 MB cap in
  // content-store.ts, plus form overhead).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // `next dev` blocks its own HMR socket when the page is opened on a host
  // other than the one it bound to — which is what happens whenever anyone
  // runs it on 0.0.0.0 and opens 127.0.0.1, or views it from another device
  // on the LAN. Without these the page still renders but live reload dies
  // silently, with only a console error to show for it. Development only.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};
export default nextConfig;
