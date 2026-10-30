import clsx from "clsx";
import type { Product } from "@/lib/types";
import { discountPercent, formatINR } from "@/lib/format";
import { T } from "@/i18n/T";

/** Ready-made: price (with MRP and % off when set). Custom: "From ₹…". */
export function Price({ product, className }: { product: Pick<Product, "type" | "price" | "mrp" | "startingPrice">; className?: string }) {
  if (product.type === "custom") {
    return (
      <p className={clsx("tabular-nums", className)}>
        {product.startingPrice ? (
          <T
            en={
              <>
                <span className="text-muted">From </span>
                <span className="font-medium">{formatINR(product.startingPrice)}</span>
              </>
            }
            hi={
              <>
                <span className="font-medium">{formatINR(product.startingPrice)}</span>
                <span className="text-muted"> से शुरू</span>
              </>
            }
          />
        ) : (
          <span className="text-muted">
            <T en="Price on request" hi="कीमत पूछने पर" />
          </span>
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
          <span className="text-[12px] font-semibold text-ink">
            <T en={`${off}% off`} hi={`${off}% छूट`} />
          </span>
        </>
      )}
    </p>
  );
}
