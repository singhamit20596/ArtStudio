/**
 * True only for the shareable design-preview build (`npm run build:preview`).
 * Turns on the preview ribbon and the "coming in a later phase" link guard.
 */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";
