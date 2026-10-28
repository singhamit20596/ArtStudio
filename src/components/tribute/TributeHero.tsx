import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { exampleFrame } from "@/config/tribute";
import { formatINR } from "@/lib/format";
import type { Category } from "@/lib/types";
import { PointerGlow } from "./PointerGlow";
import { RequestFrameButton } from "./RequestFrameButton";
import { TiltCard } from "./TiltCard";

/** Brown opening section: headline, two actions and the example frame, which tilts toward the pointer. */
export function TributeHero({ category }: { category: Category }) {
  return (
    <PointerGlow aria-labelledby="hero-title" className="surface-brown -mt-16 lg:-mt-[76px]">
      <div className="container-x grid min-h-[min(92svh,860px)] items-center gap-12 pt-28 pb-20 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-16 lg:pt-36">
        <div className="hero-copy max-w-xl">
          <p className="eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
            Defence retirement tribute frames
          </p>
          <h1 id="hero-title" className="mt-5 text-[40px] font-semibold leading-[1.05] md:text-[60px]" style={{ "--i": 1 } as React.CSSProperties}>
            Honour a <span className="shimmer">lifetime of service</span>
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-muted" style={{ "--i": 2 } as React.CSSProperties}>
            A handmade shadow box for an Army, Navy or Air Force retirement, built around their own medals, badges and photograph, and finished with an
            engraved name plate.
          </p>
          <div className="mt-9 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
            <RequestFrameButton variant="light" />
            <a href="#inside" className="btn btn-outline-light btn-press">
              See what goes inside
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6 text-[12.5px]" style={{ "--i": 4 } as React.CSSProperties}>
            <div>
              <dt className="text-muted">For</dt>
              <dd className="mt-1 font-medium">Army · Navy · Air Force</dd>
            </div>
            <div>
              <dt className="text-muted">Made</dt>
              <dd className="mt-1 font-medium">By hand, to order</dd>
            </div>
            <div>
              <dt className="text-muted">Starting at</dt>
              <dd className="mt-1 font-medium tabular-nums">{category.startingPrice ? formatINR(category.startingPrice) : "On request"}</dd>
            </div>
          </dl>
        </div>

        <TiltCard className="mx-auto w-full max-w-[440px]">
          <figure className="relative border border-line p-3 shadow-[0_40px_80px_-30px_rgb(30_20_13/0.8)]">
            <div className="sheen relative aspect-[4/5] overflow-hidden bg-brown">
              <Image src={exampleFrame.image} alt={exampleFrame.alt} fill priority sizes="(min-width: 768px) 40vw, 90vw" quality={85} className="slow-zoom object-cover" />
            </div>
            <figcaption className="pop-in absolute -bottom-4 left-6 bg-amber px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1e140d]">
              {exampleFrame.caption}
            </figcaption>
          </figure>
        </TiltCard>
      </div>

      <a href="#inside" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted md:flex">
        Scroll
        <ChevronDown size={18} aria-hidden="true" className="scroll-cue" />
      </a>
    </PointerGlow>
  );
}
