import { site } from "@/config/site";
import { formatINR } from "@/lib/format";

/** "Add ₹1,201 more for free shipping", with a progress line. */
export function FreeShippingBar({ subtotal, remaining }: { subtotal: number; remaining: number }) {
  const threshold = site.shipping.freeShippingThreshold;
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  return (
    <div>
      <p className="text-[12.5px]">
        {remaining > 0 ? (
          <>
            Add <strong className="font-semibold tabular-nums">{formatINR(remaining)}</strong> more for free shipping
          </>
        ) : (
          <strong className="font-semibold">You have free shipping</strong>
        )}
      </p>
      <div className="mt-2 h-1 bg-sand" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
