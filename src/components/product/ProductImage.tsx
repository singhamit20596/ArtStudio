import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import { T } from "@/i18n/T";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  /** Text shown on the mount when there is no photo yet (can be a <T> with both languages). */
  fallbackTitle?: ReactNode;
  fallbackNote?: ReactNode;
  priority?: boolean;
  className?: string;
  zoom?: boolean;
}

/**
 * Fills its (aspect-ratio) parent. Without a photo it shows a framed
 * mount-board card, so missing images still look intentional.
 */
export function ProductImage({ src, alt, sizes, fallbackTitle, fallbackNote = <T en="Photo coming soon" hi="फ़ोटो जल्द आएगी" />, priority, className, zoom = true }: ProductImageProps) {
  if (!src) {
    return (
      <span className={clsx("mount absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center", className)} role="img" aria-label={alt}>
        <span className="eyebrow">{fallbackNote}</span>
        {fallbackTitle && <span className="text-[15px] font-medium leading-snug text-ink">{fallbackTitle}</span>}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={clsx("object-cover", zoom && "transition-transform duration-700 ease-soft group-hover:scale-[1.045]", className)}
    />
  );
}
