import type { ReactNode } from "react";

/**
 * Text in both languages: `<T en="Add to cart" hi="कार्ट में डालें" />`.
 * Renders both, and CSS (globals.css, "Hindi / English") hides the one not chosen, so it works in
 * server and client components alike, with no flash and no hydration mismatch.
 * Without `hi` it renders the English text alone (brand names, numbers, missing translations).
 *
 * Not for places that cannot hold a <span>: <option>, <title>, placeholder, aria-label, alt.
 * Use useLang() / useT() (use-lang.ts) there, or pick() inside event handlers.
 */
export function T({ en, hi }: { en: ReactNode; hi?: ReactNode }) {
  if (hi == null || hi === "" || hi === en) return <>{en}</>;
  return (
    <>
      <span data-l="en">{en}</span>
      <span data-l="hi" lang="hi">
        {hi}
      </span>
    </>
  );
}
