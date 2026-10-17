"use client";

import { ShoppingBag, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useShop } from "@/components/providers/ShopProvider";
import { site } from "@/config/site";
import { formatINR } from "@/lib/format";

/** Slide-out cart. Phase 1 shows the empty state; lines, coupons and checkout arrive in Phase 3. */
export function CartDrawer() {
  const { cartOpen, setCartOpen, cartCount } = useShop();
  const close = () => setCartOpen(false);

  return (
    <Drawer open={cartOpen} onClose={close} side="right" label="Your cart">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="nav-label">Your cart{cartCount > 0 ? ` (${cartCount})` : ""}</h2>
        <button type="button" onClick={close} aria-label="Close cart" className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-cream text-gold-ink">
          <ShoppingBag size={26} strokeWidth={1.5} />
        </span>
        <p className="text-[16px] font-medium">Your cart is empty</p>
        <p className="max-w-[28ch] text-muted">Ready-made pieces ship in a few days. Custom pieces are made to order for you.</p>
        <button type="button" onClick={close} className="btn btn-dark mt-2">
          Continue shopping
        </button>
      </div>

      <div className="border-t border-line bg-cream px-6 py-5 text-[12.5px] leading-relaxed text-muted">
        <p>
          Free shipping on orders above {formatINR(site.shipping.freeShippingThreshold)}. A flat {formatINR(site.shipping.flatFee)} below that.
        </p>
        <p>Cash on Delivery available. {site.payments.razorpayEnabled ? "UPI, cards and netbanking accepted." : `${site.payments.onlineComingSoonLabel}.`}</p>
      </div>
    </Drawer>
  );
}
