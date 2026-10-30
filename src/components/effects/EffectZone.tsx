import type { ReactNode } from "react";
import type { EffectName } from "./types";

/**
 * Marks a homepage section as a collection's: while it fills most of the screen, the page's
 * `<FestiveEffects zones />` plays that collection's effect. A plain block wrapper (no client code).
 */
export function EffectZone({ effect, className, children }: { effect: EffectName; className?: string; children: ReactNode }) {
  return (
    <div data-fx-zone={effect} className={className}>
      {children}
    </div>
  );
}
