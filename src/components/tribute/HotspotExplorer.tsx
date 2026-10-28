"use client";

import clsx from "clsx";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InstagramIcon } from "@/components/ui/Icons";
import type { exampleFrame as ExampleFrame, hotspots as Hotspots } from "@/config/tribute";

interface HotspotExplorerProps {
  frame: typeof ExampleFrame;
  spots: typeof Hotspots;
}

/**
 * "What goes inside": numbered points on the example photo, linked to a list.
 * Cycles through the points on its own while in view, until the visitor picks one.
 */
export function HotspotExplorer({ frame, spots }: HotspotExplorerProps) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setActive((i) => (i + 1) % spots.length), 3200);
    });
    if (root.current) io.observe(root.current);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [touched, spots.length]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const spot = spots[active];

  return (
    <div ref={root} className="grid items-start gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
      <div className="reveal-scale relative mx-auto w-full max-w-[520px]">
        <div className="relative aspect-[4/5] overflow-hidden bg-brown">
          <Image src={frame.image} alt={frame.alt} fill sizes="(min-width: 768px) 45vw, 100vw" quality={85} className="object-cover" />
          {/* Dim everything except the chosen point */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-[background] duration-500"
            style={{ background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, transparent 0 9%, rgb(90 62 43 / 0.6) 22%)` }}
          />
          {spots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(i)}
              aria-label={s.title}
              aria-pressed={i === active}
              className={clsx(
                "absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 transition-transform duration-300 hover:scale-110",
                i === active ? "scale-110 border-amber bg-brown text-amber" : "ping border-brown bg-amber text-[#1e140d]",
              )}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className="relative text-[12px] font-semibold tabular-nums">{i + 1}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-muted">{frame.caption}. Tap a number to explore.</p>
      </div>

      <div>
        <ol className="space-y-1">
          {spots.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pick(i)}
                aria-pressed={i === active}
                className={clsx("flex w-full items-start gap-4 border-l-2 px-4 py-3.5 text-left transition-colors duration-300", i === active ? "border-brown bg-brown/10" : "border-transparent hover:border-line")}
              >
                <span className={clsx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums transition-colors", i === active ? "bg-brown text-white" : "bg-amber text-[#1e140d]")}>
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">{s.title}</span>
                  <span className={clsx("grid transition-[grid-template-rows,opacity] duration-400", i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <span className="overflow-hidden text-[13.5px] leading-relaxed text-muted">{s.text}</span>
                  </span>
                </span>
                <Plus size={16} aria-hidden="true" className={clsx("ml-auto mt-1 shrink-0 transition-transform duration-300", i === active && "rotate-45")} />
              </button>
            </li>
          ))}
        </ol>
        <a href={frame.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-70">
          <InstagramIcon size={17} /> <span className="link-line">See this frame on Instagram</span>
        </a>
      </div>
    </div>
  );
}
