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
  // Old addresses: the retirement page's old name (Retirement Tributes became Retirement Gifts,
  // 30 Oct 2026), the tributes' made-to-order page, the themed lines' shop pages, and the
  // gift shop (removed by the owner, 30 Oct 2026), which now sends visitors to the shop.
  ...(previewExport
    ? {}
    : {
        redirects: async () => [
          { source: "/retirement-tributes", destination: "/retirement-gifts", permanent: false },
          { source: "/custom/retirement-tribute-frames", destination: "/retirement-gifts", permanent: false },
          { source: "/shop/christmas-decor-gifts", destination: "/christmas", permanent: false },
          { source: "/shop/diwali-decor-gifts", destination: "/diwali", permanent: false },
          { source: "/shop/car-gifts", destination: "/car-gifts", permanent: false },
          { source: "/gifts", destination: "/shop", permanent: false },
        ],
      }),
  experimental: {
    // Turbopack's on-disk caches served a stale globals.css after edits (28 Oct 2026), and
    // Netlify restores .next/cache between deploys. The site builds in ~15 s, so compile fresh.
    turbopackFileSystemCacheForBuild: false,
    turbopackFileSystemCacheForDev: false,
  },
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
