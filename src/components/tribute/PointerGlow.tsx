"use client";

import clsx from "clsx";
import { useRef, type ReactNode } from "react";

/** A soft amber light (or a theme's `--glow`) that follows the mouse across a dark section. Static for touch and reduced motion. */
export function PointerGlow({ children, className, as: Tag = "section", ...rest }: { children: ReactNode; className?: string; as?: "section" | "div" } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref as never} onPointerMove={move} className={clsx("relative isolate overflow-hidden", className)} {...rest}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-[background-position] duration-300"
        style={{ background: "radial-gradient(640px circle at var(--mx, 75%) var(--my, 30%), var(--glow, rgb(213 133 31 / 0.16)), transparent 60%)" }}
      />
      {children}
    </Tag>
  );
}
