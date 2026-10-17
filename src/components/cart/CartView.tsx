"use client";

import { ShoppingBag } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { AppLink } from "@/components/ui/AppLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { formatINR } from "@/lib/format";
import type { CartProduct } from "@/lib/pricing";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { CartLines, SavedForLater } from "./CartLines";
import { CouponField } from "./CouponField";
import { FreeShippingBar } from "./FreeShippingBar";
import { TotalsTable } from "./TotalsTable";
import { useCartTotals } from "./useCartTotals";

/** The full cart page: lines and saved items on the left, coupon and totals on the right. */
export function CartView({ catalogue }: { catalogue: CartProduct[] }) {
  const { saved } = useShop();
  const totals = useCartTotals(catalogue);
  const empty = totals.lines.length === 0 && totals.unavailable.length === 0;

  if (empty) {
    return (
      <div className="pb-20">
        <div className="mount flex flex-col items-center px-8 py-16 text-center">
          <ShoppingBag size={28} strokeWidth={1.5} className="text-gold-ink" aria-hidden="true" />
          <p className="mt-4 text-[18px] font-medium">Your cart is empty</p>
          <p className="mt-2 max-w-sm text-muted">Find something handmade for your home, or a gift that tells a story.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <AppLink href="/shop" className="btn btn-dark">
              Shop all
            </AppLink>
            <AppLink href="/custom" className="btn btn-outline">
              Custom made
            </AppLink>
          </div>
        </div>
        {saved.length > 0 && (
          <div className="mt-12 max-w-2xl">
            <SavedForLater catalogue={catalogue} />
          </div>
        )}
      </div>
    );
  }

  const waText = messages.cart(
    totals.lines.map((l) => ({ name: l.product.name.split(" | ")[0], variant: l.line.variant, quantity: l.quantity, total: formatINR(l.lineTotal) })),
    formatINR(totals.subtotal),
  );

  return (
    <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 md:pb-28">
      <div className="min-w-0">
        <div className="border-b border-line pb-4">
          <FreeShippingBar subtotal={totals.subtotal} remaining={totals.freeShippingRemaining} />
        </div>
        <CartLines lines={totals.lines} unavailable={totals.unavailable} />
        <div className="border-t border-line pt-6">
          <SavedForLater catalogue={catalogue} />
        </div>
      </div>

      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-cream p-6">
          <h2 className="nav-label">Order summary</h2>
          <div className="mt-5">
            <CouponField totals={totals} />
          </div>
          <div className="mt-6">
            <TotalsTable totals={totals} />
          </div>
          <AppLink href="/checkout" className="btn btn-dark mt-6 w-full aria-disabled:pointer-events-none aria-disabled:bg-ink/40" aria-disabled={totals.lines.length === 0}>
            Checkout
          </AppLink>
          <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-3 w-full">
            <WhatsAppIcon size={17} /> Order on WhatsApp
          </a>
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            {site.payments.cashOnDelivery && "Cash on Delivery available. "}
            {site.payments.razorpayEnabled ? "UPI, cards and netbanking accepted." : `${site.payments.onlineComingSoonLabel}.`}
          </p>
        </div>
      </aside>
    </div>
  );
}
