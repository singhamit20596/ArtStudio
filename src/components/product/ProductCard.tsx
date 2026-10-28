import clsx from "clsx";
import type { Product } from "@/lib/types";
import { productHref, shortName } from "@/lib/product";
import { AppLink } from "@/components/ui/AppLink";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { WishlistButton } from "./WishlistButton";

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
          <ProductImage src={first} alt={shortName(product)} sizes={sizes} fallbackTitle={shortName(product)} />
          {rest[0] && (
            <ProductImage src={rest[0]} alt="" sizes={sizes} zoom={false} className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
          {badge && (
            <span className={clsx("absolute left-3 top-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]", BADGE_STYLES[badge] ?? "bg-sage text-[#1e140d]")}>{badge}</span>
          )}
        </span>
        <h3 className="mt-3.5 line-clamp-2 text-[13px] leading-snug text-ink">{product.name}</h3>
        <Price product={product} className="mt-1.5 text-[13px]" />
        {product.type === "custom" && <p className="mt-0.5 text-[11.5px] text-muted">Made to order</p>}
      </AppLink>
      <WishlistButton slug={product.slug} name={shortName(product)} className="absolute right-3 top-3" />
    </article>
  );
}
