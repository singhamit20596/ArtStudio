"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { TotalsTable } from "@/components/cart/TotalsTable";
import { AppLink } from "@/components/ui/AppLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { PAYMENT_LABELS } from "@/lib/checkout";
import { formatDateRange } from "@/lib/delivery";
import { formatINR } from "@/lib/format";
import { isLocalPreview, isPreview } from "@/lib/preview";
import type { Totals } from "@/lib/pricing";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { readConfirmationRaw, saveConfirmation, subscribeConfirmation, type Confirmation } from "./confirmation-store";
import { UpiPayPanel } from "./UpiPayPanel";


/** "Thank you" page after checkout, built from the order the checkout just placed. */
export function ConfirmationView() {
  const id = useSearchParams().get("order") ?? "";
  const raw = useSyncExternalStore(subscribeConfirmation, () => readConfirmationRaw(id), () => null);
  const saved = useMemo(() => (raw ? (JSON.parse(raw) as Confirmation) : null), [raw]);

  const help = whatsappLink(id ? `Hi! I have a question about my order ${id}.` : messages.general);

  if (!saved) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 size={40} strokeWidth={1.4} className="mx-auto text-brown" aria-hidden="true" />
        <h1 className="mt-5 text-[28px] font-semibold leading-tight md:text-[36px]">Thank you for your order</h1>
        {id && (
          <p className="mt-4 text-muted">
            Your order number is <strong className="text-ink">{id}</strong>. Keep it handy if you message us.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AppLink href="/shop" className="btn btn-dark">
            Continue shopping
          </AppLink>
          <a href={help} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <WhatsAppIcon size={17} /> Message us
          </a>
        </div>
      </div>
    );
  }

  const { order, whatsappUrl, personaliseUrl } = saved;
  const payNow = order.payment.method === "upi" && order.status === "awaiting_payment";
  const viaWhatsApp = order.payment.method === "whatsapp";
  const firstName = order.customer.name.split(" ")[0];
  const delivery = order.delivery ? formatDateRange(new Date(order.delivery.from), new Date(order.delivery.to)) : null;
  const t = order.totals;
  const totals = {
    count: order.items.reduce((n, i) => n + i.quantity, 0),
    subtotal: t.subtotal,
    discount: t.discount,
    coupon: order.coupon ? { code: order.coupon.code, ok: true, discount: order.coupon.discount, message: "" } : null,
    shipping: t.shipping,
    codFee: t.codFee,
    giftWrap: t.giftWrap,
    total: t.total,
  } as Totals;
  const a = order.address;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        {viaWhatsApp ? <WhatsAppIcon size={40} className="mx-auto text-brown" /> : <CheckCircle2 size={40} strokeWidth={1.4} className="mx-auto text-brown" aria-hidden="true" />}
        <p className="eyebrow mt-5">Order {order.id}</p>
        <h1 className="mt-3 text-[28px] font-semibold leading-tight md:text-[38px]">
          {viaWhatsApp ? "One last step: send it on WhatsApp" : order.status === "paid" ? `Payment received. Thank you, ${firstName}!` : `Thank you, ${firstName}!`}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          {viaWhatsApp
            ? "Tap the button to send your order to us. We confirm it with you in the chat and share how to pay."
            : order.payment.method === "upi" && order.status === "awaiting_payment"
              ? "Your order is in. Pay by UPI below, then tell us how to personalise it. We start making your tribute once the payment arrives."
              : order.status === "payment_claimed"
                ? "Your order is in. We are checking your payment and confirm it on WhatsApp, then we start making your tribute."
                : "Your order is in. Every piece is handmade, so we start making yours now and let you know when it ships."}
        </p>
        {viaWhatsApp && whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-7">
            <WhatsAppIcon size={18} /> Send order on WhatsApp
          </a>
        )}
        {order.customer.email && order.emailsSent && <p className="mt-4 text-[13px] text-muted">We have emailed a copy to {order.customer.email}.</p>}
        {isPreview && !order.emailsSent && (
          <p className="mx-auto mt-5 max-w-lg surface-amber px-4 py-2.5 text-[12.5px]">
            {isLocalPreview ? (
              <>
                Preview: the order was saved in <code>.data/store/orders/</code> and its emails in <code>.data/emails/</code> instead of being sent.
              </>
            ) : (
              "Preview: this test order was saved, but no emails went out because email is not set up yet."
            )}
          </p>
        )}
      </div>

      {payNow && (
        <div className="mt-10">
          <UpiPayPanel order={order} onClaimed={(o) => saveConfirmation(o, whatsappUrl, personaliseUrl)} />
        </div>
      )}
      {order.status === "payment_claimed" && (
        <p className="surface-amber mt-10 px-5 py-4 text-[14px]">Thank you. We are checking your UPI payment{order.payment.upiRef ? ` (reference ${order.payment.upiRef})` : ""} and will confirm it on WhatsApp.</p>
      )}
      {personaliseUrl && (
        <section aria-labelledby="personalise-title" className="surface-brown mt-10 p-6 md:p-8">
          <p className="eyebrow">{payNow ? "Step 2 of 2" : "Next step"}</p>
          <h2 id="personalise-title" className="mt-2 text-[22px] font-semibold md:text-[26px]">
            Personalise your tribute
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">Choose the layout, add the name and rank, upload photos of the officer and the medals, and pick the background colour. You can do it now or later from this link.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={personaliseUrl} className="btn btn-light btn-press">
              Personalise now
            </a>
            <a href={`https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(`My Art Studio order ${order.id}: personalise it here ${personaliseUrl}`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-press">
              <WhatsAppIcon size={17} /> Save link to my WhatsApp
            </a>
          </div>
        </section>
      )}

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="items-title" className="border border-line p-6">
          <h2 id="items-title" className="nav-label">
            Your order
          </h2>
          <ul className="mt-5 space-y-4">
            {order.items.map((i) => (
              <li key={`${i.slug}|${i.variant ?? ""}`} className="flex gap-3">
                <span className="relative h-[75px] w-[60px] shrink-0 overflow-hidden bg-brown">
                  {i.image && <Image src={i.image} alt="" fill sizes="60px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug">
                  <span className="line-clamp-2">{i.name}</span>
                  {i.variant && <span className="block text-[12px] text-muted">{i.variant}</span>}
                  <span className="block text-[12px] text-muted">Qty {i.quantity}</span>
                </span>
                <span className="text-[13px] tabular-nums">{formatINR(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-ink/10 pt-4">
            <TotalsTable totals={totals} final />
          </div>
        </section>

        <section aria-labelledby="details-title" className="space-y-6 text-[14px] leading-relaxed">
          <h2 id="details-title" className="sr-only">
            Delivery and payment
          </h2>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">Delivering to</p>
            <p className="mt-2">
              {order.customer.name}
              <br />
              {a.line1}, {a.line2}
              {a.landmark && (
                <>
                  <br />
                  Near {a.landmark}
                </>
              )}
              <br />
              {a.city}, {a.state} {a.pincode}
              <br />
              +91 {order.customer.phone}
            </p>
          </div>
          {delivery && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">Estimated arrival</p>
              <p className="mt-2">{delivery}</p>
            </div>
          )}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">Payment</p>
            <p className="mt-2">
              {PAYMENT_LABELS[order.payment.method]}
              {order.payment.method === "cod" && ` · ${formatINR(t.total)} to pay on delivery`}
            </p>
          </div>
          {(order.gift.wrap || order.gift.message) && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">Gift</p>
              <p className="mt-2">
                {order.gift.wrap && "Gift wrapped. "}
                {order.gift.message && <>Message: “{order.gift.message}”</>}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <AppLink href="/shop" className="btn btn-dark">
              Continue shopping
            </AppLink>
            <a href={help} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <WhatsAppIcon size={17} /> Questions?
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
