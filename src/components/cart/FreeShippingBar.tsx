import { site } from "@/config/site";
import { formatINR } from "@/lib/format";
import { T } from "@/i18n/T";

/** "Add ₹1,201 more for free shipping", with a progress line. */
export function FreeShippingBar({ subtotal, remaining }: { subtotal: number; remaining: number }) {
  const threshold = site.shipping.freeShippingThreshold;
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  return (
    <div>
      <p className="text-[12.5px]">
        {remaining > 0 ? (
          <T
            en={
              <>
                Add <strong className="font-semibold tabular-nums">{formatINR(remaining)}</strong> more for free shipping
              </>
            }
            hi={
              <>
                <strong className="font-semibold tabular-nums">{formatINR(remaining)}</strong> का सामान और जोड़ें, डिलीवरी मुफ़्त हो जाएगी
              </>
            }
          />
        ) : (
          <strong className="font-semibold">
            <T en="You have free shipping" hi="आपकी डिलीवरी मुफ़्त है" />
          </strong>
        )}
      </p>
      <div className="mt-2 h-1 bg-brown/20" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full bg-brown transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
