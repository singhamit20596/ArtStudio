"use client";

import clsx from "clsx";
import { useLayoutEffect } from "react";
import { applyLang, currentLang, LANG_KEY, setLang, storedLang } from "./lang";

/**
 * The language switch at the top of every page: it reads "हिन्दी" while the site is in English
 * and "English" while it is in Hindi. Both labels are in the HTML; CSS shows the right one.
 */
export function LanguageToggle({ variant = "header", className }: { variant?: "header" | "menu"; className?: string }) {
  useLayoutEffect(() => {
    // In development React resets <html> attributes when it remounts, dropping the inline script's
    // work; put the saved choice back (a no-op in production). Also follow changes made in other tabs.
    if (storedLang() !== currentLang()) applyLang(storedLang());
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY || e.key === null) applyLang(storedLang());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => setLang(currentLang() === "hi" ? "en" : "hi");

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        "lang-toggle",
        variant === "header"
          ? // Phones: underlined text (the header has no room for a pill next to the centred logo). Wider: a pill.
            "grid h-10 place-items-center text-[12px] font-medium leading-none underline decoration-current/50 underline-offset-[5px] transition-colors sm:h-8 sm:rounded-full sm:border sm:border-current/45 sm:px-3 sm:text-[13px] sm:no-underline sm:hover:border-amber sm:hover:bg-amber sm:hover:text-[#1e140d]"
          : "btn btn-outline w-full",
        className,
      )}
    >
      {/* Each label is written in its own language, so it names itself to screen readers too. */}
      <span data-l="en" lang="hi">
        हिन्दी
      </span>
      <span data-l="hi" lang="en">
        English
      </span>
    </button>
  );
}
