"use client";

import { Copy, X } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { Drawer } from "@/components/ui/Drawer";
import { toast } from "@/components/ui/Toaster";
import { InstagramIcon } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { availableCoupons } from "@/lib/coupons";
import { formatDate } from "@/lib/format";
import { formatDateHi } from "@/i18n/format";
import { T } from "@/i18n/T";
import { useT } from "@/i18n/use-lang";

/** Active coupon codes with copy and apply buttons. */
export function OffersDrawer() {
  const { offersOpen, setOffersOpen, couponCode, setCouponCode } = useShop();
  const close = () => setOffersOpen(false);
  const offers = availableCoupons();
  const t = useT();

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`${code} copied`, `${code} कॉपी हो गया`);
    } catch {
      toast(`Your code is ${code}`, `आपका कोड है ${code}`);
    }
  };

  return (
    <Drawer open={offersOpen} onClose={close} side="right" label={t("Offers", "ऑफ़र")}>
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="nav-label">
          <T en="Offers" hi="ऑफ़र" />
        </h2>
        <button type="button" onClick={close} aria-label={t("Close offers", "ऑफ़र बंद करें")} className="-mr-2 grid h-10 w-10 place-items-center">
          <X size={22} />
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
          <p className="text-[16px] font-medium">
            <T en="No offers right now" hi="अभी कोई ऑफ़र नहीं है" />
          </p>
          <p className="max-w-[30ch] text-muted">
            <T en="Follow us on Instagram to hear about festive offers." hi="त्योहारों के ऑफ़र की ख़बर के लिए हमें Instagram पर फ़ॉलो करें।" />
          </p>
          <a href={site.social.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-3">
            <InstagramIcon size={17} /> <T en="Follow" hi="फ़ॉलो करें" /> {site.social.instagramHandle}
          </a>
        </div>
      ) : (
        <ul className="flex-1 space-y-4 px-6 py-6">
          {offers.map((c) => {
            const applied = couponCode === c.code;
            return (
              <li key={c.code} className="border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="border border-dashed border-brown px-3 py-1.5 text-[14px] font-semibold tracking-[0.12em] text-ink">{c.code}</p>
                  <button type="button" onClick={() => copy(c.code)} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em]">
                    <Copy size={14} aria-hidden="true" /> <T en="Copy" hi="कॉपी" />
                  </button>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed">{c.description}</p>
                {c.expires && (
                  <p className="mt-1 text-[12px] text-muted">
                    <T en={`Valid until ${formatDate(c.expires)}`} hi={`${formatDateHi(c.expires)} तक मान्य`} />
                  </p>
                )}
                <button
                  type="button"
                  disabled={applied}
                  onClick={() => {
                    setCouponCode(c.code);
                    toast(`${c.code} added to your cart`, `${c.code} आपके कार्ट में लग गया`);
                    close();
                  }}
                  className="btn btn-dark mt-4 w-full min-h-10 disabled:bg-brown/40"
                >
                  {applied ? <T en="Applied" hi="लग गया" /> : <T en="Apply to cart" hi="कार्ट पर लगाएँ" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
