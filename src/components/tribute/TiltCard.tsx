"use client";

import clsx from "clsx";
import { useRef, type ReactNode } from "react";

/**
 * Tilts gently toward the pointer (mouse only) and lights an amber glow where it points.
 * Does nothing for touch, keyboard or visitors who prefer reduced motion.
 */
export function TiltCard({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 2 * max}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 2 * max}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div style={{ perspective: "1000px" }} className={className}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className={clsx("tilt relative h-full w-full transition-transform duration-300 ease-out will-change-transform")}
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))", transformStyle: "preserve-3d" }}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [.tilt:hover>&]:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgb(213 133 31 / 0.22), transparent 55%)" }}
        />
      </div>
    </div>
  );
}
