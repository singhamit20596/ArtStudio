import { formatINR } from "@/lib/format";
import type { Totals } from "@/lib/pricing";

/** Subtotal, coupon, shipping, fees and total. `final` shows every charge (checkout). */
export function TotalsTable({ totals, final = false }: { totals: Totals; final?: boolean }) {
  const row = "flex justify-between gap-4 py-1";
  return (
    <dl className="text-[13.5px] tabular-nums">
      <div className={row}>
        <dt className="text-muted">Subtotal ({totals.count} {totals.count === 1 ? "item" : "items"})</dt>
        <dd>{formatINR(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && totals.coupon && (
        <div className={row}>
          <dt className="text-muted">Coupon {totals.coupon.code}</dt>
          <dd className="font-medium text-ink">−{formatINR(totals.discount)}</dd>
        </div>
      )}
      <div className={row}>
        <dt className="text-muted">Shipping</dt>
        <dd>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</dd>
      </div>
      {totals.giftWrap > 0 && (
        <div className={row}>
          <dt className="text-muted">Gift wrap</dt>
          <dd>{formatINR(totals.giftWrap)}</dd>
        </div>
      )}
      {totals.codFee > 0 && (
        <div className={row}>
          <dt className="text-muted">Cash on Delivery fee</dt>
          <dd>{formatINR(totals.codFee)}</dd>
        </div>
      )}
      <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-[15px] font-semibold">
        <dt>{final ? "Total to pay" : "Total"}</dt>
        <dd>{formatINR(totals.total)}</dd>
      </div>
      <p className="mt-1 text-[11.5px] font-normal text-muted">Prices include taxes.</p>
    </dl>
  );
}
