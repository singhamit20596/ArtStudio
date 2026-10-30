import clsx from "clsx";
import type { Product } from "@/lib/types";
import { productHref, shortName } from "@/lib/product";
import { AppLink } from "@/components/ui/AppLink";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { WishlistButton } from "./WishlistButton";
import { hiProductName, hiShortName } from "@/i18n/names";
import { T } from "@/i18n/T";

/** Badges in Hindi. */
const BADGE_HI: Record<string, string> = {
  New: "नया",
  Bestseller: "बेस्टसेलर",
  "Sold out": "बिक गया",
  Customisable: "आपकी पसंद से",
  Handmade: "हाथ से बना",
};

/** New in amber, Bestseller and Sold out in brown, the rest in sage. */
const BADGE_STYLES: Record<string, string> = {
  New: "bg-amber text-[#1e140d]",
  Bestseller: "bg-brown text-white",
  "Sold out": "bg-brown text-white",
};

function badgeFor(p: Product): string | null {
  if (p.type === "ready" && p.stock != null && p.stock <= 0) return "Sold out";
  if (p.isNew) return "New";
  if (p.isBestseller) return "Bestseller";
  if (p.isCustomisable) return "Customisable";
  return "Handmade";
}

/** Borderless 4:5 product card: image, one badge, wishlist heart, "Name | Material | Size", price. */
export function ProductCard({ product, sizes, className }: { product: Product; sizes: string; className?: string }) {
  const badge = badgeFor(product);
  const href = productHref(product);
  const [first, ...rest] = product.images;

  return (
    <article className={clsx("group relative", className)}>
      <AppLink href={href} className="block">
        <span className="relative block aspect-[4/5] overflow-hidden bg-brown">
          <ProductImage src={first} alt={shortName(product)} sizes={sizes} fallbackTitle={<T en={shortName(product)} hi={hiShortName(product.slug)} />} />
          {rest[0] && (
            <ProductImage src={rest[0]} alt="" sizes={sizes} zoom={false} className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
          {badge && (
            // Smaller on phones, where cards sit two side by side, so the longest badge clears the heart.
            <span
              className={clsx(
                "absolute left-2 top-2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.18em]",
                BADGE_STYLES[badge] ?? "bg-sage text-[#1e140d]",
              )}
            >
              <T en={badge} hi={BADGE_HI[badge]} />
            </span>
          )}
        </span>
        <h3 className="mt-2.5 line-clamp-2 text-[13px] leading-snug text-ink sm:mt-3.5">
          <T en={product.name} hi={hiProductName(product.slug)} />
        </h3>
        <Price product={product} className="mt-1.5 text-[13px]" />
        {product.type === "custom" && (
          <p className="mt-0.5 text-[11.5px] text-muted">
            <T en="Made to order" hi="ऑर्डर पर तैयार" />
          </p>
        )}
      </AppLink>
      <WishlistButton slug={product.slug} name={shortName(product)} className="absolute right-2 top-2 sm:right-3 sm:top-3" />
    </article>
  );
}
