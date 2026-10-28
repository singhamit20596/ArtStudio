"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Phones only: a buy bar pinned to the bottom of the screen once the element
 * with id `watchId` (the main buttons) has scrolled out of view.
 */
export function StickyBar({ watchId, children }: { watchId: string; children: ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      data-sticky-bar={shown ? "shown" : "hidden"}
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 surface-sage border-t border-line transition-transform duration-300 md:hidden ${shown ? "translate-y-0" : "translate-y-full"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container-x flex items-center gap-3 py-3">{children}</div>
    </div>
  );
}
