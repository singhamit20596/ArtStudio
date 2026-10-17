import localFont from "next/font/local";

/** Poppins (self-hosted from @fontsource/poppins, OFL). Latin subset for all UI text. */
export const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

/** Devanagari glyphs for Hindi lines in festive banners (loaded only when used). */
export const poppinsDevanagari = localFont({
  src: [
    { path: "../fonts/poppins-devanagari-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-devanagari-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-devanagari-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-poppins-deva",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
