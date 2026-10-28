import clsx from "clsx";
import Image from "next/image";
import { site } from "@/config/site";

/** Logo badge from Instagram plus the "Art Studio · Art with Soul" wordmark. */
export function Logo({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <Image
        src="/brand/logo.png"
        alt=""
        width={88}
        height={88}
        priority
        className={clsx("rounded-full", compact ? "h-9 w-9" : "h-10 w-10 lg:h-11 lg:w-11")}
      />
      <span className="flex flex-col leading-none">
        <span className={clsx("font-semibold uppercase", compact ? "text-[13px] tracking-[0.2em]" : "text-[15px] tracking-[0.24em]")}>
          {site.name}
        </span>
        <span className={clsx("mt-[5px] text-[9.5px] font-medium uppercase tracking-[0.34em]", inverted ? "text-white/80" : "text-eyebrow")}>
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
