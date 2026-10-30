import type { Metadata } from "next";
import "./catalogue.css";

/**
 * Print-only pages (the price catalogue PDF): no site header or footer, kept out of search
 * engines and not linked from the site. The root layout still provides the fonts and globals.css.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return children;
}
