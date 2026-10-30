"use client";

import { useSyncExternalStore } from "react";
import { currentLang, type Lang } from "./lang";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
  return () => observer.disconnect();
}

const serverLang = (): Lang => "en";

/**
 * The language showing now, for text that cannot use <T> (placeholders, aria-labels, <option>s).
 * It is "en" during the first render and switches right after hydration, so prefer <T> for
 * anything visible on load.
 */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, currentLang, serverLang);
}

/** `const t = useT(); t("Search", "खोजें")`: the Hindi text while Hindi is on. */
export function useT() {
  const lang = useLang();
  return (en: string, hi?: string | null) => (lang === "hi" && hi ? hi : en);
}
