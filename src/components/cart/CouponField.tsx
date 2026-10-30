"use client";

import clsx from "clsx";
import { Tag, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { availableCoupons } from "@/lib/coupons";
import type { Totals } from "@/lib/pricing";
import { hiMessage } from "@/i18n/messages";
import { T } from "@/i18n/T";
import { useT } from "@/i18n/use-lang";

/** Enter or remove a coupon code; links to the Offers drawer. */
export function CouponField({ totals }: { totals: Totals }) {
  const { couponCode, setCouponCode, setOffersOpen } = useShop();
  const [error, setError] = useState<string | null>(null);
  const coupon = totals.coupon;
  const t = useT();

  const apply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("coupon") ?? "").trim().toUpperCase();
    if (!code) return;
    if (!availableCoupons().some((c) => c.code === code)) {
      setError("This code isn't valid.");
      return;
    }
    setError(null);
    setCouponCode(code);
  };

  return (
    <div>
      {couponCode && coupon ? (
        <div className={clsx("flex items-start gap-3 border px-3 py-2.5", coupon.ok ? "border-brown" : "border-line")}>
          <Tag size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brown" />
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold tracking-[0.08em]">{coupon.code}</p>
            <p className={clsx("text-[12.5px]", coupon.ok ? "text-ink" : "text-error")} aria-live="polite">
              <T en={coupon.message} hi={hiMessage(coupon.message)} />
            </p>
          </div>
          <button type="button" onClick={() => setCouponCode("")} aria-label={t(`Remove coupon ${coupon.code}`, `कूपन ${coupon.code} हटाएँ`)} className="-m-1 grid h-8 w-8 place-items-center">
            <X size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={apply} className="flex gap-2">
          <label htmlFor="coupon" className="sr-only">
            <T en="Coupon code" hi="कूपन कोड" />
          </label>
          <input
            id="coupon"
            name="coupon"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder={t("Coupon code", "कूपन कोड")}
            onChange={() => setError(null)}
            className="h-11 min-w-0 flex-1 border border-ink/20 px-3 text-[13px] uppercase outline-none placeholder:normal-case placeholder:text-muted focus:border-ink"
          />
          <button type="submit" className="h-11 shrink-0 border border-ink px-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-brown hover:border-brown hover:text-paper">
            <T en="Apply" hi="लगाएँ" />
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-error">
          <T en={error} hi={hiMessage(error)} />
        </p>
      )}
      {availableCoupons().length > 0 && (
        <button type="button" onClick={() => setOffersOpen(true)} className="mt-2 text-[12.5px] underline underline-offset-4 hover:no-underline">
          <T en="View available offers" hi="उपलब्ध ऑफ़र देखें" />
        </button>
      )}
    </div>
  );
}
