"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface ProductCarouselProps {
  /** Accessible name for the scrolling list. */
  label: string;
  /** Heading block rendered on the left of the header row. */
  header: ReactNode;
  /** Usually a "View all" link, shown before the arrows. */
  action?: ReactNode;
  children: ReactNode;
}

/** Scroll-snap carousel: swipe on touch, arrows on larger screens. */
export function ProductCarousel({ label, header, action, children }: ProductCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    update();
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = "grid h-11 w-11 place-items-center border border-ink/20 transition-colors hover:border-ink disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink/20";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="min-w-0 max-w-2xl">{header}</div>
        <div className="flex items-center gap-5">
          {action}
          <div className={clsx("hidden gap-2 md:flex", edges.start && edges.end && "md:hidden")}>
            <button type="button" className={arrow} onClick={() => go(-1)} disabled={edges.start} aria-label="Previous items">
              <ChevronLeft size={18} strokeWidth={1.6} />
            </button>
            <button type="button" className={arrow} onClick={() => go(1)} disabled={edges.end} aria-label="Next items">
              <ChevronRight size={18} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="scroller mt-9 gap-4 pb-2 md:gap-6 [&>*]:w-[46%] [&>*]:shrink-0 sm:[&>*]:w-[31%] lg:[&>*]:w-[calc((100%-4.5rem)/4)]"
      >
        {children}
      </div>
    </div>
  );
}
