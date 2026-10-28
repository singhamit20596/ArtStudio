"use client";

import clsx from "clsx";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { ProductImage } from "./ProductImage";

type Media = { kind: "image"; src: string } | { kind: "video"; src: string };

interface GalleryProps {
  images: string[];
  video: string | null;
  /** Product name, used for alt text and the no-photo card. */
  name: string;
  /** Shown on the no-photo card ("Photo coming soon", "Made to order"). */
  fallbackNote?: string;
}

const SIZES = "(min-width: 768px) 50vw, 100vw";

/**
 * Product photos: swipe on phones (pinch-zoom works natively), thumbnails and
 * hover zoom on desktop. A product video, when there is one, is the second slide.
 */
export function Gallery({ images, video, name, fallbackNote }: GalleryProps) {
  const media: Media[] = images.map((src) => ({ kind: "image", src }));
  if (video) media.splice(Math.min(1, media.length), 0, { kind: "video", src: video });

  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  };

  if (media.length === 0) {
    return (
      <div className="relative aspect-[4/5] bg-brown">
        <ProductImage src={null} alt={name} sizes={SIZES} fallbackTitle={name} fallbackNote={fallbackNote} />
      </div>
    );
  }

  return (
    <div className={clsx(media.length > 1 && "md:grid md:grid-cols-[72px_minmax(0,1fr)] md:gap-4")}>
      {media.length > 1 && (
        <ul className="order-first hidden flex-col gap-3 md:flex" aria-label="Choose a photo">
          {media.map((m, i) => (
            <li key={m.src}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={m.kind === "video" ? "Play the video" : `Photo ${i + 1} of ${media.length}`}
                aria-current={active === i}
                className={clsx("relative block aspect-[4/5] w-full overflow-hidden bg-brown ring-offset-2 ring-offset-sage transition", active === i ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100")}
              >
                {m.kind === "image" ? (
                  <Image src={m.src} alt="" fill sizes="72px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-brown text-paper">
                    <Play size={18} fill="currentColor" />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
          }}
          className="scroller -mx-4 [scroll-padding-inline:0] md:mx-0"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} photos`}
        >
          {media.map((m, i) => (
            <div key={m.src} className="w-full shrink-0" aria-roledescription="slide" aria-label={`${i + 1} of ${media.length}`}>
              {m.kind === "image" ? <ZoomImage src={m.src} alt={i === 0 ? name : `${name}, photo ${i + 1}`} priority={i === 0} /> : <Video src={m.src} />}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 md:hidden" aria-hidden="true">
            {media.map((m, i) => (
              <span key={m.src} className={clsx("h-1.5 rounded-full transition-all", active === i ? "w-5 bg-brown" : "w-1.5 bg-brown/25")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Hover to magnify (2×) around the pointer on devices with a mouse. */
function ZoomImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    box.current.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    box.current.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div ref={box} onPointerMove={move} className="zoom-box relative aspect-[4/5] overflow-hidden bg-brown">
      <Image src={src} alt={alt} fill sizes={SIZES} priority={priority} quality={85} className="object-cover" />
    </div>
  );
}

function Video({ src }: { src: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-brown">
      <video src={src} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline controls preload="metadata" />
    </div>
  );
}
