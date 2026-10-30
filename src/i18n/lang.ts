/*
 * Hindi / English switch (owner, 30 Oct 2026). Pages stay static: every piece of text is in the
 * HTML in both languages (see T.tsx), and CSS shows one of them from `html[data-lang]`.
 *
 * - The choice lives in localStorage under LANG_KEY ("hi", or nothing for English).
 * - LANG_SCRIPT runs in <head> before the first paint (src/app/layout.tsx), so Hindi readers
 *   never see the English page first.
 * - The header toggle (LanguageToggle.tsx) flips it; client components read it with useLang().
 */

export type Lang = "en" | "hi";

export const LANG_KEY = "artstudio.lang";

/** `lang` attribute values on <html> for each language. */
export const HTML_LANG: Record<Lang, string> = { en: "en-IN", hi: "hi" };

/** Inline <head> script: applies a saved Hindi choice before anything is painted. */
export const LANG_SCRIPT = `(function(){try{if(localStorage.getItem("${LANG_KEY}")==="hi"){var d=document.documentElement;d.setAttribute("data-lang","hi");d.lang="${HTML_LANG.hi}"}}catch(e){}})()`;

/** The language showing now (always "en" on the server). */
export function currentLang(): Lang {
  return typeof document !== "undefined" && document.documentElement.dataset.lang === "hi" ? "hi" : "en";
}

/** The saved choice, if storage can be read. */
export function storedLang(): Lang {
  try {
    return window.localStorage.getItem(LANG_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

/** Shows the page in `lang` (no saving). */
export function applyLang(lang: Lang) {
  const root = document.documentElement;
  if (lang === "hi") root.setAttribute("data-lang", "hi");
  else root.removeAttribute("data-lang");
  root.lang = HTML_LANG[lang];
}

/** Shows the page in `lang` and remembers it for the next visit. */
export function setLang(lang: Lang) {
  applyLang(lang);
  try {
    if (lang === "hi") window.localStorage.setItem(LANG_KEY, "hi");
    else window.localStorage.removeItem(LANG_KEY);
  } catch {
    /* storage blocked (private mode): the choice lasts for this page only */
  }
}

/** Picks the Hindi text while Hindi is on (for toasts and other text made in event handlers). */
export function pick(en: string, hi?: string | null) {
  return hi && currentLang() === "hi" ? hi : en;
}
