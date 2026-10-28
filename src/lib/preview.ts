/**
 * True for preview builds (`npm run preview` on your computer, and the hosted preview on
 * Netlify, which sets NEXT_PUBLIC_PREVIEW=1 in netlify.toml). Turns on the preview ribbon,
 * the "coming in a later phase" link guard and the sample offer codes. Remove at launch.
 */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

/** The preview running on your own computer (`next dev`), where test orders are saved to .data/. */
export const isLocalPreview = isPreview && process.env.NODE_ENV !== "production";
