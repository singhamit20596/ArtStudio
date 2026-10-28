"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { MAX_QTY } from "@/lib/pricing";
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
  const stock = product.stock ?? 0;
  const soldOut = stock <= 0;
  const maxQty = Math.max(1, Math.min(stock, MAX_QTY));
  const unmet = product.variants.find((v) => !choice[v.name]);
  const variantText = product.variants.map((v) => (choice[v.name] ? `${v.name}: ${choice[v.name]}` : null)).filter(Boolean).join(", ");
  const total = product.price != null ? formatINR(product.price * qty) : null;

  const orderHref = whatsappLink(messages.order(variantText ? `${name} (${variantText})` : name, qty, total, origin ? `${origin}${path}` : undefined));

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
    else toast("This piece is no longer available.");
  };
  const orderOnWhatsApp = (e: React.MouseEvent) => {
    if (!ready()) e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {product.variants.map((v) => (
        <fieldset key={v.name} id={`variant-${v.name}`} className="scroll-mt-28">
          <legend className="text-[12px] font-semibold uppercase tracking-[0.16em]">
            {v.name}
            {choice[v.name] ? <span className="ml-2 font-normal normal-case tracking-normal text-muted">{choice[v.name]}</span> : null}
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
                  {o}
                </button>
              );
            })}
          </div>
          {missing === v.name && (
            <p role="alert" className="mt-2 text-[12.5px] font-medium text-error">
              Please choose a {v.name.toLowerCase()}.
            </p>
          )}
        </fieldset>
      ))}

      <StockNote stock={stock} />

      <div id={ACTIONS_ID} className="space-y-3">
        <div className="flex gap-3">
          {!soldOut && (
            <QuantityStepper value={qty} max={maxQty} onChange={(q) => setQty(Math.max(1, Math.min(maxQty, q)))} />
          )}
          <button type="button" onClick={addToCart} disabled={soldOut} className="btn btn-dark flex-1 px-4 disabled:cursor-not-allowed disabled:bg-brown/40">
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
          <WishlistButton slug={product.slug} name={name} className="!h-12 !w-12 shrink-0 !rounded-none border border-ink/20 !shadow-none" />
        </div>
        {!soldOut && (
          <button type="button" onClick={buyNow} className="btn btn-outline w-full">
            Buy now
          </button>
        )}
        <a href={orderHref} onClick={orderOnWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <WhatsAppIcon size={17} />
          {soldOut ? "Ask us to make one" : "Order on WhatsApp"}
        </a>
      </div>

      <DeliveryCheck making={product.makingTimeDays} />

      {!soldOut && (
        <StickyBar watchId={ACTIONS_ID}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{name}</p>
            {total && <p className="text-[13px] tabular-nums text-muted">{total}</p>}
          </div>
          <button type="button" onClick={addToCart} className="btn btn-dark min-h-11 px-5">
            Add to cart
          </button>
        </StickyBar>
      )}
    </div>
  );
}

function StockNote({ stock }: { stock: number }) {
  if (stock <= 0) return <p className="text-[13px] font-medium text-error">Sold out. Message us and we can make another.</p>;
  if (stock <= 3)
    return (
      <p className="text-[13px]">
        <span className="font-semibold text-ink">Only {stock} left.</span> Each piece is handmade.
      </p>
    );
  return <p className="text-[13px] text-muted">In stock, ready to ship</p>;
}
