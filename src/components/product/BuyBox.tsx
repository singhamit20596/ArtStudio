"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { lineCode, MAX_QTY } from "@/lib/pricing";
import { shortName } from "@/lib/product";
import { useOrigin } from "@/lib/use-origin";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { useShop } from "@/components/providers/ShopProvider";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { toast } from "@/components/ui/Toaster";
import { DeliveryCheck } from "./DeliveryCheck";
import { StickyBar } from "./StickyBar";
import { WishlistButton } from "./WishlistButton";
import { hiShortName, variantNames, variantOptions } from "@/i18n/names";
import { T } from "@/i18n/T";

const ACTIONS_ID = "buy-actions";

/** Ready-made pieces: variants, stock note, quantity, cart buttons, WhatsApp order and delivery check. */
export function BuyBox({ product, path }: { product: Product; path: string }) {
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [missing, setMissing] = useState<string | null>(null);
  const origin = useOrigin();
  const router = useRouter();
  const { addToCart: add, setCartOpen } = useShop();

  const name = shortName(product);
  // No stock count means the piece is made to order (Christmas pieces): never sold out.
  const madeToOrder = product.stock == null;
  const stock = product.stock ?? MAX_QTY;
  const soldOut = stock <= 0;
  const maxQty = Math.max(1, Math.min(stock, MAX_QTY));
  const unmet = product.variants.find((v) => !choice[v.name]);
  const variantText = product.variants.map((v) => (choice[v.name] ? `${v.name}: ${choice[v.name]}` : null)).filter(Boolean).join(", ");
  const total = product.price != null ? formatINR(product.price * qty) : null;

  // The full code (with the letter or style) once every choice is made.
  const code = unmet ? null : lineCode(product, { variant: variantText || undefined });
  const item = `${name}${variantText ? ` (${variantText})` : ""}${code ? ` [${code}]` : ""}`;
  const orderHref = whatsappLink(messages.order(item, qty, total, origin ? `${origin}${path}` : undefined));

  /** Returns false (and points at the selector) when a variant still needs choosing. */
  const ready = () => {
    if (!unmet) return true;
    setMissing(unmet.name);
    document.getElementById(`variant-${unmet.name}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    return false;
  };
  /** Puts the chosen piece in the cart (never beyond stock); false if none could be added. */
  const putInCart = () => add({ slug: product.slug, quantity: qty, variant: variantText || undefined }, maxQty) > 0;
  const addToCart = () => {
    if (!ready()) return;
    putInCart();
    setCartOpen(true);
  };
  const buyNow = () => {
    if (!ready()) return;
    if (putInCart()) router.push("/checkout");
    else toast("This piece is no longer available.", "यह पीस अब उपलब्ध नहीं है।");
  };
  const orderOnWhatsApp = (e: React.MouseEvent) => {
    if (!ready()) e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {product.variants.map((v) => (
        <fieldset key={v.name} id={`variant-${v.name}`} className="scroll-mt-28">
          <legend className="text-[12px] font-semibold uppercase tracking-[0.16em]">
            <T en={v.name} hi={variantNames[v.name]} />
            {choice[v.name] ? (
              <span className="ml-2 font-normal normal-case tracking-normal text-muted">
                <T en={choice[v.name]} hi={variantOptions[choice[v.name]]} />
              </span>
            ) : null}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {v.options.map((o) => {
              const selected = choice[v.name] === o;
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setChoice((c) => ({ ...c, [v.name]: o }));
                    if (missing === v.name) setMissing(null);
                  }}
                  className={clsx(
                    "h-10 border text-[13px] transition-colors",
                    o.length <= 2 ? "w-10" : "px-4",
                    selected ? "border-brown bg-brown text-paper" : "border-ink/20 hover:border-ink",
                  )}
                >
                  <T en={o} hi={variantOptions[o]} />
                </button>
              );
            })}
          </div>
          {missing === v.name && (
            <p role="alert" className="mt-2 text-[12.5px] font-medium text-error">
              <T en={`Please choose a ${v.name.toLowerCase()}.`} hi={`कृपया ${variantNames[v.name] ?? v.name} चुनें।`} />
            </p>
          )}
        </fieldset>
      ))}

      {madeToOrder ? (
        <p className="text-[13px] text-muted">
          <T en="Made to order, by hand" hi="ऑर्डर पर, हाथ से बनता है" />
        </p>
      ) : (
        <StockNote stock={stock} />
      )}

      <div id={ACTIONS_ID} className="space-y-3">
        <div className="flex gap-3">
          {!soldOut && (
            <QuantityStepper value={qty} max={maxQty} onChange={(q) => setQty(Math.max(1, Math.min(maxQty, q)))} />
          )}
          <button type="button" onClick={addToCart} disabled={soldOut} className="btn btn-dark flex-1 px-4 disabled:cursor-not-allowed disabled:bg-brown/40">
            {soldOut ? <T en="Sold out" hi="बिक गया" /> : <T en="Add to cart" hi="कार्ट में डालें" />}
          </button>
          <WishlistButton slug={product.slug} name={name} className="!h-12 !w-12 shrink-0 !rounded-none border border-ink/20 !shadow-none" />
        </div>
        {!soldOut && (
          <button type="button" onClick={buyNow} className="btn btn-outline w-full">
            <T en="Buy now" hi="अभी खरीदें" />
          </button>
        )}
        <a href={orderHref} onClick={orderOnWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <WhatsAppIcon size={17} />
          {soldOut ? <T en="Ask us to make one" hi="हमसे एक बनवाएँ" /> : <T en="Order on WhatsApp" hi="WhatsApp पर ऑर्डर करें" />}
        </a>
      </div>

      <DeliveryCheck making={product.makingTimeDays} />

      {!soldOut && (
        <StickyBar watchId={ACTIONS_ID}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">
              <T en={name} hi={hiShortName(product.slug)} />
            </p>
            {total && <p className="text-[13px] tabular-nums text-muted">{total}</p>}
          </div>
          <button type="button" onClick={addToCart} className="btn btn-dark min-h-11 px-5">
            <T en="Add to cart" hi="कार्ट में डालें" />
          </button>
        </StickyBar>
      )}
    </div>
  );
}

function StockNote({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <p className="text-[13px] font-medium text-error">
        <T en="Sold out. Message us and we can make another." hi="यह बिक गया। मैसेज करें, हम एक और बना सकते हैं।" />
      </p>
    );
  if (stock <= 3)
    return (
      <p className="text-[13px]">
        <T
          en={
            <>
              <span className="font-semibold text-ink">Only {stock} left.</span> Each piece is handmade.
            </>
          }
          hi={
            <>
              <span className="font-semibold text-ink">सिर्फ़ {stock} बचे हैं।</span> हर पीस हाथ से बनता है।
            </>
          }
        />
      </p>
    );
  return (
    <p className="text-[13px] text-muted">
      <T en="In stock, ready to ship" hi="स्टॉक में है, भेजने के लिए तैयार" />
    </p>
  );
}
