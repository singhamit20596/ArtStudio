import { formatINR } from "@/lib/format";
import { categoryHref } from "@/lib/product";
import type { Category } from "@/lib/types";
import { AppLink } from "@/components/ui/AppLink";
import { ProductImage } from "@/components/product/ProductImage";

/** A custom category tile: photo (or a "Made to order" mount card), name, line and starting price. */
export function CustomCategoryCard({ category, sizes }: { category: Category; sizes: string }) {
  return (
    <AppLink href={categoryHref(category)} className="group block">
      <span className="relative block aspect-[4/5] overflow-hidden bg-brown">
        <ProductImage
          src={category.image}
          alt={category.name}
          sizes={sizes}
          fallbackTitle={category.name}
          fallbackNote={category.status === "coming-soon" ? "Coming soon" : "Made to order"}
        />
      </span>
      <h3 className="mt-3.5 text-[12.5px] font-semibold uppercase leading-snug tracking-[0.14em]">{category.name}</h3>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{category.description}</p>
      <p className="mt-1.5 text-[12.5px] tabular-nums">
        {category.status === "coming-soon" ? (
          <span className="text-muted">Coming soon</span>
        ) : category.startingPrice ? (
          <>
            <span className="text-muted">From </span>
            <span className="font-medium">{formatINR(category.startingPrice)}</span>
          </>
        ) : (
          <span className="text-muted">Price on request</span>
        )}
      </p>
    </AppLink>
  );
}
