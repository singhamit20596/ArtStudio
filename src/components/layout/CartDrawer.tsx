"use client";

import { ShoppingBag, X } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { CartLines, SavedForLater } from "@/components/cart/CartLines";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { useCartTotals } from "@/components/cart/useCartTotals";
import { AppLink } from "@/components/ui/AppLink";
import { Drawer } from "@/components/ui/Drawer";
import { site } from "@/config/site";
import { availableCoupons } from "@/lib/coupons";
import { formatINR } from "@/lib/format";
import type { CartProduct } from "@/lib/pricing";
import { T } from "@/i18n/T";
import { useT } from "@/i18n/use-lang";

/** Slide-out cart: lines, free-shipping progress, saved for later, checkout. */
export function CartDrawer({ catalogue }: { catalogue: CartProduct[] }) {
  const { cartOpen, setCartOpen, setOffersOpen } = useShop();
  const totals = useCartTotals(catalogue);
  const close = () => setCartOpen(false);
  const empty = totals.lines.length === 0 && totals.unavailable.length === 0;
  const t = useT();

  return (
    <Drawer open={cartOpen} onClose={close} side="right" label={t("Your cart", "आपका कार्ट")}>
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="nav-label">
          <T en="Your cart" hi="आपका कार्ट" />
          {totals.count > 0 ? ` (${totals.count})` : ""}
        </h2>
        <button type="button" onClick={close} aria-label={t("Close cart", "कार्ट बंद करें")} className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      {empty ? (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-amber text-[#1e140d]">
              <ShoppingBag size={26} strokeWidth={1.5} />
            </span>
            <p className="text-[16px] font-medium">
              <T en="Your cart is empty" hi="आपका कार्ट ख़ाली है" />
            </p>
            <p className="max-w-[28ch] text-muted">
              <T
                en="Ready-made pieces ship in a few days. Custom pieces are made to order for you."
                hi="तैयार पीस कुछ ही दिनों में भेज दिए जाते हैं। कस्टम पीस आपके ऑर्डर पर बनाए जाते हैं।"
              />
            </p>
            <AppLink href="/shop" onClick={close} className="btn btn-dark mt-2">
              <T en="Start shopping" hi="ख़रीदारी शुरू करें" />
            </AppLink>
          </div>
          <div className="px-6 pb-6">
            <SavedForLater catalogue={catalogue} />
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-6 py-4">
            <FreeShippingBar subtotal={totals.subtotal} remaining={totals.freeShippingRemaining} />
          </div>
          <div className="flex-1 px-6">
            <CartLines lines={totals.lines} unavailable={totals.unavailable} />
            <div className="border-t border-line py-5">
              <SavedForLater catalogue={catalogue} />
            </div>
          </div>
          <div className="surface-sage sticky bottom-0 border-t border-line px-6 py-5">
            <div className="flex items-baseline justify-between text-[15px] font-semibold tabular-nums">
              <span>
                <T en="Subtotal" hi="सामान की कीमत" />
              </span>
              <span>{formatINR(totals.subtotal)}</span>
            </div>
            <p className="mt-1 text-[12px] text-muted">
              {totals.shipping === 0 && totals.subtotal > 0 ? (
                <T en="Free shipping. " hi="डिलीवरी मुफ़्त। " />
              ) : (
                <T
                  en={`${formatINR(site.shipping.flatFee)} shipping below ${formatINR(site.shipping.freeShippingThreshold)}. `}
                  hi={`${formatINR(site.shipping.freeShippingThreshold)} से कम पर ${formatINR(site.shipping.flatFee)} डिलीवरी शुल्क। `}
                />
              )}
              <T en="Coupons and gift wrap at checkout." hi="कूपन और गिफ़्ट रैप चेकआउट पर।" />
              {availableCoupons().length > 0 && (
                <>
                  {" "}
                  <button type="button" onClick={() => setOffersOpen(true)} className="underline underline-offset-4">
                    <T en="See offers" hi="ऑफ़र देखें" />
                  </button>
                </>
              )}
            </p>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-3">
              <AppLink href="/cart" onClick={close} className="btn btn-outline px-5">
                <T en="View cart" hi="कार्ट देखें" />
              </AppLink>
              <AppLink href="/checkout" onClick={close} className="btn btn-dark aria-disabled:pointer-events-none aria-disabled:bg-brown/40" aria-disabled={totals.lines.length === 0}>
                <T en="Checkout" hi="चेकआउट" />
              </AppLink>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
