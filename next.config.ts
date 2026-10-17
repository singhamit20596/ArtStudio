import type { NextConfig } from "next";

/**
 * `npm run build:preview` sets PREVIEW_EXPORT=1 to produce a static, self-contained
 * design preview in /out (no server, images unoptimised). Normal builds (Vercel) are unaffected.
 */
const previewExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  // Cache Components (PPR) cannot run in a static export, so the preview build turns them off.
  cacheComponents: !previewExport,
  partialPrefetching: !previewExport,
  ...(previewExport ? { output: "export" as const } : {}),
  // The static preview has no server, so it leaves out the API routes (route.ts files).
  ...(previewExport ? { pageExtensions: ["tsx"] } : {}),
  images: previewExport ? { unoptimized: true } : { qualities: [75, 85], formats: ["image/avif", "image/webp"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
