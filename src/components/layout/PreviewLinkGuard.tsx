"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/Toaster";
import { isPreview } from "@/lib/preview";

const PHASE_BY_PATH: [RegExp, string][] = [
  [/^\/(shop|custom|product|occasion|gifts|search)/, "Category, product and search pages arrive in Phase 2."],
  [/^\/(cart|checkout)/, "Cart and checkout arrive in Phase 3."],
  [/^\/(account|track-order|admin)/, "Accounts, wishlists and order tracking arrive in Phase 4."],
];

/**
 * Design preview only: internal links to pages that are not built yet show a short
 * note instead of a dead page. Removed automatically in the real build.
 */
export function PreviewLinkGuard() {
  useEffect(() => {
    if (!isPreview) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/")) return; // external links, wa.me, Instagram, #anchors
      e.preventDefault();
      e.stopPropagation();
      if (href === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const path = href.split(/[?#]/)[0];
      const note = PHASE_BY_PATH.find(([re]) => re.test(path))?.[1] ?? "About, FAQ and policy pages arrive in a later phase.";
      toast(note);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
