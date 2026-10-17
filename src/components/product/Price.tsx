import clsx from "clsx";
import type { Product } from "@/lib/types";
import { discountPercent, formatINR } from "@/lib/format";

/** Ready-made: price (with MRP and % off when set). Custom: "From ₹…". */
export function Price({ product, className }: { product: Pick<Product, "type" | "price" | "mrp" | "startingPrice">; className?: string }) {
  if (product.type === "custom") {
    return (
      <p className={clsx("tabular-nums", className)}>
        {product.startingPrice ? (
          <>
            <span className="text-muted">From </span>
            <span className="font-medium">{formatINR(product.startingPrice)}</span>
          </>
        ) : (
          <span className="text-muted">Price on request</span>
        )}
      </p>
    );
  }
  if (product.price == null) return null;
  const off = discountPercent(product.price, product.mrp);
  return (
    <p className={clsx("flex flex-wrap items-baseline gap-x-2 tabular-nums", className)}>
      <span className="font-medium">{formatINR(product.price)}</span>
      {off && product.mrp && (
        <>
          <s className="text-[12px] text-muted">{formatINR(product.mrp)}</s>
          <span className="text-[12px] font-medium text-gold-ink">{off}% off</span>
        </>
      )}
    </p>
  );
}
