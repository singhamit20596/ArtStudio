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
import { formatDateRangeHi } from "@/i18n/format";
import { hiProductName, hiVariant, paymentNames } from "@/i18n/names";
import { T } from "@/i18n/T";


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
        <h1 className="mt-5 text-[28px] font-semibold leading-tight md:text-[36px]">
          <T en="Thank you for your order" hi="आपके ऑर्डर के लिए धन्यवाद" />
        </h1>
        {id && (
          <p className="mt-4 text-muted">
            <T
              en={
                <>
                  Your order number is <strong className="text-ink">{id}</strong>. Keep it handy if you message us.
                </>
              }
              hi={
                <>
                  आपका ऑर्डर नंबर <strong className="text-ink">{id}</strong> है। हमें मैसेज करते समय इसे पास रखें।
                </>
              }
            />
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AppLink href="/shop" className="btn btn-dark">
            <T en="Continue shopping" hi="ख़रीदारी जारी रखें" />
          </AppLink>
          <a href={help} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <WhatsAppIcon size={17} /> <T en="Message us" hi="हमें मैसेज करें" />
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
  const deliveryHi = order.delivery ? formatDateRangeHi(new Date(order.delivery.from), new Date(order.delivery.to)) : null;
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
        <p className="eyebrow mt-5">
          <T en="Order" hi="ऑर्डर" /> {order.id}
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-tight md:text-[38px]">
          {viaWhatsApp ? (
            <T en="One last step: send it on WhatsApp" hi="बस एक आख़िरी कदम: इसे WhatsApp पर भेजें" />
          ) : order.status === "paid" ? (
            <T en={`Payment received. Thank you, ${firstName}!`} hi={`भुगतान मिल गया। धन्यवाद, ${firstName}!`} />
          ) : (
            <T en={`Thank you, ${firstName}!`} hi={`धन्यवाद, ${firstName}!`} />
          )}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          {viaWhatsApp ? (
            <T
              en="Tap the button to send your order to us. We confirm it with you in the chat and share how to pay."
              hi="बटन दबाकर अपना ऑर्डर हमें भेजें। हम चैट में आपके साथ उसकी पुष्टि करेंगे और भुगतान का तरीक़ा बताएँगे।"
            />
          ) : order.payment.method === "upi" && order.status === "awaiting_payment" ? (
            <T
              en="Your order is in. Pay by UPI below, then tell us how to personalise it. We start making your tribute once the payment arrives."
              hi="आपका ऑर्डर मिल गया है। नीचे UPI से भुगतान करें, फिर बताएँ कि इसे कैसे पर्सनलाइज़ करना है। भुगतान आते ही हम आपका ट्रिब्यूट बनाना शुरू कर देंगे।"
            />
          ) : order.status === "payment_claimed" ? (
            <T
              en="Your order is in. We are checking your payment and confirm it on WhatsApp, then we start making your tribute."
              hi="आपका ऑर्डर मिल गया है। हम आपका भुगतान जाँच रहे हैं और WhatsApp पर पुष्टि करेंगे, फिर आपका ट्रिब्यूट बनाना शुरू करेंगे।"
            />
          ) : (
            <T
              en="Your order is in. Every piece is handmade, so we start making yours now and let you know when it ships."
              hi="आपका ऑर्डर मिल गया है। हर पीस हाथ से बनता है, इसलिए हम आपका पीस अभी बनाना शुरू कर रहे हैं और भेजते समय आपको बताएँगे।"
            />
          )}
        </p>
        {viaWhatsApp && whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-7">
            <WhatsAppIcon size={18} /> <T en="Send order on WhatsApp" hi="WhatsApp पर ऑर्डर भेजें" />
          </a>
        )}
        {order.customer.email && order.emailsSent && (
          <p className="mt-4 text-[13px] text-muted">
            <T en={`We have emailed a copy to ${order.customer.email}.`} hi={`हमने इसकी कॉपी ${order.customer.email} पर ईमेल कर दी है।`} />
          </p>
        )}
        {isPreview && !order.emailsSent && (
          <p className="mx-auto mt-5 max-w-lg surface-amber px-4 py-2.5 text-[12.5px]">
            {isLocalPreview ? (
              <T
                en={
                  <>
                    Preview: the order was saved in <code>.data/store/orders/</code> and its emails in <code>.data/emails/</code> instead of being sent.
                  </>
                }
                hi={
                  <>
                    प्रीव्यू: ऑर्डर <code>.data/store/orders/</code> में और उसके ईमेल भेजने की जगह <code>.data/emails/</code> में सेव हुए।
                  </>
                }
              />
            ) : (
              <T
                en="Preview: this test order was saved, but no emails went out because email is not set up yet."
                hi="प्रीव्यू: यह टेस्ट ऑर्डर सेव हो गया, पर ईमेल अभी सेट नहीं है, इसलिए कोई ईमेल नहीं गया।"
              />
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
        <p className="surface-amber mt-10 px-5 py-4 text-[14px]">
          <T
            en={`Thank you. We are checking your UPI payment${order.payment.upiRef ? ` (reference ${order.payment.upiRef})` : ""} and will confirm it on WhatsApp.`}
            hi={`धन्यवाद। हम आपका UPI भुगतान${order.payment.upiRef ? ` (रेफ़रेंस ${order.payment.upiRef})` : ""} जाँच रहे हैं और WhatsApp पर पुष्टि करेंगे।`}
          />
        </p>
      )}
      {personaliseUrl && (
        <section aria-labelledby="personalise-title" className="surface-brown mt-10 p-6 md:p-8">
          <p className="eyebrow">{payNow ? <T en="Step 2 of 2" hi="चरण 2 / 2" /> : <T en="Next step" hi="अगला कदम" />}</p>
          <h2 id="personalise-title" className="mt-2 text-[22px] font-semibold md:text-[26px]">
            <T en="Personalise your tribute" hi="अपना ट्रिब्यूट पर्सनलाइज़ करें" />
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
            <T
              en="Choose the layout, add the name and rank, upload photos of the officer and the medals, and pick the background colour. You can do it now or later from this link."
              hi="लेआउट चुनें, नाम और रैंक लिखें, अफ़सर और मेडल की फ़ोटो अपलोड करें, और बैकग्राउंड का रंग चुनें। यह अभी करें या बाद में इसी लिंक से।"
            />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={personaliseUrl} className="btn btn-light btn-press">
              <T en="Personalise now" hi="अभी पर्सनलाइज़ करें" />
            </a>
            <a href={`https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(`My Art Studio order ${order.id}: personalise it here ${personaliseUrl}`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-press">
              <WhatsAppIcon size={17} /> <T en="Save link to my WhatsApp" hi="लिंक अपने WhatsApp पर सेव करें" />
            </a>
          </div>
        </section>
      )}

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="items-title" className="border border-line p-6">
          <h2 id="items-title" className="nav-label">
            <T en="Your order" hi="आपका ऑर्डर" />
          </h2>
          <ul className="mt-5 space-y-4">
            {order.items.map((i) => (
              <li key={`${i.slug}|${i.variant ?? ""}`} className="flex gap-3">
                <span className="relative h-[75px] w-[60px] shrink-0 overflow-hidden bg-brown">
                  {i.image && <Image src={i.image} alt="" fill sizes="60px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug">
                  <span className="line-clamp-2">
                    <T en={i.name} hi={hiProductName(i.slug)} />
                  </span>
                  {i.variant && (
                    <span className="block text-[12px] text-muted">
                      <T en={i.variant} hi={hiVariant(i.variant)} />
                    </span>
                  )}
                  <span className="block text-[12px] text-muted">
                    <T en={`Qty ${i.quantity}`} hi={`मात्रा ${i.quantity}`} />
                  </span>
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
            <T en="Delivery and payment" hi="डिलीवरी और भुगतान" />
          </h2>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              <T en="Delivering to" hi="डिलीवरी का पता" />
            </p>
            <p className="mt-2">
              {order.customer.name}
              <br />
              {a.line1}, {a.line2}
              {a.landmark && (
                <>
                  <br />
                  <T en={`Near ${a.landmark}`} hi={`${a.landmark} के पास`} />
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
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                <T en="Estimated arrival" hi="अनुमानित पहुँच" />
              </p>
              <p className="mt-2">
                <T en={delivery} hi={deliveryHi} />
              </p>
            </div>
          )}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              <T en="Payment" hi="भुगतान" />
            </p>
            <p className="mt-2">
              <T en={PAYMENT_LABELS[order.payment.method]} hi={paymentNames[order.payment.method]} />
              {order.payment.method === "cod" && <T en={` · ${formatINR(t.total)} to pay on delivery`} hi={` · डिलीवरी पर ${formatINR(t.total)} देने हैं`} />}
            </p>
          </div>
          {(order.gift.wrap || order.gift.message) && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                <T en="Gift" hi="गिफ़्ट" />
              </p>
              <p className="mt-2">
                {order.gift.wrap && <T en="Gift wrapped. " hi="गिफ़्ट रैप किया जाएगा। " />}
                {order.gift.message && <T en={<>Message: “{order.gift.message}”</>} hi={<>संदेश: “{order.gift.message}”</>} />}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <AppLink href="/shop" className="btn btn-dark">
              <T en="Continue shopping" hi="ख़रीदारी जारी रखें" />
            </AppLink>
            <a href={help} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <WhatsAppIcon size={17} /> <T en="Questions?" hi="कोई सवाल?" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
