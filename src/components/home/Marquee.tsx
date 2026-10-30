import { Sparkle } from "@/components/ui/Icons";
import { T } from "@/i18n/T";
import { tr } from "@/i18n/ui";

const PHRASES = ["Art with Soul", "Handcrafted with love", "Pan India shipping", "Made to order", "Cash on Delivery"];

/** Thin scrolling brand strip. Pauses on hover; static with reduced motion. */
export function Marquee({ phrases = PHRASES }: { phrases?: string[] }) {
  const run = [...phrases, ...phrases];
  return (
    <div className="marquee overflow-hidden surface-amber border-b border-line py-4">
      <p className="sr-only">
        <T en={phrases.join(". ")} hi={phrases.map((p) => tr(p) ?? p).join("। ")} />
      </p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((p, i) => (
              <span key={`${copy}-${i}`} className="nav-label flex items-center gap-7 px-7 text-ink">
                <T en={p} hi={tr(p)} />
                <Sparkle size={11} className="text-brown" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
