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

/** Slide-out cart: lines, free-shipping progress, saved for later, checkout. */
export function CartDrawer({ catalogue }: { catalogue: CartProduct[] }) {
  const { cartOpen, setCartOpen, setOffersOpen } = useShop();
  const totals = useCartTotals(catalogue);
  const close = () => setCartOpen(false);
  const empty = totals.lines.length === 0 && totals.unavailable.length === 0;

  return (
    <Drawer open={cartOpen} onClose={close} side="right" label="Your cart">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="nav-label">Your cart{totals.count > 0 ? ` (${totals.count})` : ""}</h2>
        <button type="button" onClick={close} aria-label="Close cart" className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      {empty ? (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-amber text-[#1e140d]">
              <ShoppingBag size={26} strokeWidth={1.5} />
            </span>
            <p className="text-[16px] font-medium">Your cart is empty</p>
            <p className="max-w-[28ch] text-muted">Ready-made pieces ship in a few days. Custom pieces are made to order for you.</p>
            <AppLink href="/shop" onClick={close} className="btn btn-dark mt-2">
              Start shopping
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
              <span>Subtotal</span>
              <span>{formatINR(totals.subtotal)}</span>
            </div>
            <p className="mt-1 text-[12px] text-muted">
              {totals.shipping === 0 && totals.subtotal > 0 ? "Free shipping. " : `${formatINR(site.shipping.flatFee)} shipping below ${formatINR(site.shipping.freeShippingThreshold)}. `}
              Coupons and gift wrap at checkout.
              {availableCoupons().length > 0 && (
                <>
                  {" "}
                  <button type="button" onClick={() => setOffersOpen(true)} className="underline underline-offset-4">
                    See offers
                  </button>
                </>
              )}
            </p>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-3">
              <AppLink href="/cart" onClick={close} className="btn btn-outline px-5">
                View cart
              </AppLink>
              <AppLink href="/checkout" onClick={close} className="btn btn-dark aria-disabled:pointer-events-none aria-disabled:bg-brown/40" aria-disabled={totals.lines.length === 0}>
                Checkout
              </AppLink>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
