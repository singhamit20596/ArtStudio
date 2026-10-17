import { Sparkle } from "@/components/ui/Icons";

const PHRASES = ["Art with Soul", "Handcrafted with love", "Pan India shipping", "Made to order", "Cash on Delivery"];

/** Thin scrolling brand strip above the footer. Pauses on hover; static with reduced motion. */
export function Marquee() {
  const run = [...PHRASES, ...PHRASES];
  return (
    <div className="marquee overflow-hidden border-b border-white/10 bg-ink-2 py-4 text-paper">
      <p className="sr-only">{PHRASES.join(". ")}</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((p, i) => (
              <span key={`${copy}-${i}`} className="nav-label flex items-center gap-7 px-7 text-white/85">
                {p}
                <Sparkle size={11} className="text-gold" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
