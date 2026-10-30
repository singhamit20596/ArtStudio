import { formatINR } from "@/lib/format";
import type { Totals } from "@/lib/pricing";
import { T } from "@/i18n/T";

/** Subtotal, coupon, shipping, fees and total. `final` shows every charge (checkout). */
export function TotalsTable({ totals, final = false }: { totals: Totals; final?: boolean }) {
  const row = "flex justify-between gap-4 py-1";
  return (
    <dl className="text-[13.5px] tabular-nums">
      <div className={row}>
        <dt className="text-muted">
          <T en={`Subtotal (${totals.count} ${totals.count === 1 ? "item" : "items"})`} hi={`सामान की कीमत (${totals.count} पीस)`} />
        </dt>
        <dd>{formatINR(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && totals.coupon && (
        <div className={row}>
          <dt className="text-muted">
            <T en="Coupon" hi="कूपन" /> {totals.coupon.code}
          </dt>
          <dd className="font-medium text-ink">−{formatINR(totals.discount)}</dd>
        </div>
      )}
      <div className={row}>
        <dt className="text-muted">
          <T en="Shipping" hi="डिलीवरी" />
        </dt>
        <dd>{totals.shipping === 0 ? <T en="Free" hi="मुफ़्त" /> : formatINR(totals.shipping)}</dd>
      </div>
      {totals.giftWrap > 0 && (
        <div className={row}>
          <dt className="text-muted">
            <T en="Gift wrap" hi="गिफ़्ट रैप" />
          </dt>
          <dd>{formatINR(totals.giftWrap)}</dd>
        </div>
      )}
      {totals.codFee > 0 && (
        <div className={row}>
          <dt className="text-muted">
            <T en="Cash on Delivery fee" hi="कैश ऑन डिलीवरी शुल्क" />
          </dt>
          <dd>{formatINR(totals.codFee)}</dd>
        </div>
      )}
      <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-[15px] font-semibold">
        <dt>{final ? <T en="Total to pay" hi="कुल भुगतान" /> : <T en="Total" hi="कुल" />}</dt>
        <dd>{formatINR(totals.total)}</dd>
      </div>
      <p className="mt-1 text-[11.5px] font-normal text-muted">
        <T en="Prices include taxes." hi="कीमतों में टैक्स शामिल है।" />
      </p>
    </dl>
  );
}
