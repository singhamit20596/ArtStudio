"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/Toaster";
import { isPreview } from "@/lib/preview";

/** Routes that do not exist yet. Remove a pattern when its pages are built. */
const PHASE_BY_PATH: [RegExp, string, string][] = [
  [/^\/(account|track-order|admin)(\/|$)/, "Accounts and order tracking arrive in Phase 4.", "अकाउंट और ऑर्डर ट्रैकिंग जल्द आ रहे हैं।"],
  [/^\/(about|contact|faq|bulk-gifting|shipping-returns|privacy|terms)(\/|$)/, "About, FAQ and policy pages arrive in a later phase.", "हमारे बारे में, सवाल-जवाब और नीतियों के पेज जल्द आ रहे हैं।"],
];

/**
 * Design preview only: internal links to pages that are not built yet show a short
 * note instead of a dead page. Links to built pages work as normal.
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
      const path = href.split(/[?#]/)[0];
      const match = PHASE_BY_PATH.find(([re]) => re.test(path));
      if (!match) return;
      e.preventDefault();
      e.stopPropagation();
      toast(match[1], match[2]);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
