"use client";

import { Copy, X } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { Drawer } from "@/components/ui/Drawer";
import { toast } from "@/components/ui/Toaster";
import { InstagramIcon } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { availableCoupons } from "@/lib/coupons";
import { formatDate } from "@/lib/format";

/** Active coupon codes with copy and apply buttons. */
export function OffersDrawer() {
  const { offersOpen, setOffersOpen, couponCode, setCouponCode } = useShop();
  const close = () => setOffersOpen(false);
  const offers = availableCoupons();

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`${code} copied`);
    } catch {
      toast(`Your code is ${code}`);
    }
  };

  return (
    <Drawer open={offersOpen} onClose={close} side="right" label="Offers">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="nav-label">Offers</h2>
        <button type="button" onClick={close} aria-label="Close offers" className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
          <p className="text-[16px] font-medium">No offers right now</p>
          <p className="max-w-[30ch] text-muted">Follow us on Instagram to hear about festive offers.</p>
          <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-3">
            <InstagramIcon size={17} /> Follow {site.social.instagramHandle}
          </a>
        </div>
      ) : (
        <ul className="flex-1 space-y-4 px-6 py-6">
          {offers.map((c) => {
            const applied = couponCode === c.code;
            return (
              <li key={c.code} className="border border-line p-4">
                {c.sample && <p className="mb-2 inline-block bg-preview px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]">Sample offer · preview only</p>}
                <div className="flex items-center justify-between gap-3">
                  <p className="border border-dashed border-gold-ink px-3 py-1.5 text-[14px] font-semibold tracking-[0.12em] text-gold-ink">{c.code}</p>
                  <button type="button" onClick={() => copy(c.code)} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em]">
                    <Copy size={14} aria-hidden="true" /> Copy
                  </button>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed">{c.description}</p>
                {c.expires && <p className="mt-1 text-[12px] text-muted">Valid until {formatDate(c.expires)}</p>}
                <button
                  type="button"
                  disabled={applied}
                  onClick={() => {
                    setCouponCode(c.code);
                    toast(`${c.code} added to your cart`);
                    close();
                  }}
                  className="btn btn-dark mt-4 w-full min-h-10 disabled:bg-ink/40"
                >
                  {applied ? "Applied" : "Apply to cart"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
