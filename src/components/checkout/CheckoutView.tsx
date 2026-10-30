"use client";

import clsx from "clsx";
import Image from "next/image";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { CouponField } from "@/components/cart/CouponField";
import { TotalsTable } from "@/components/cart/TotalsTable";
import { useCartTotals } from "@/components/cart/useCartTotals";
import { AppLink } from "@/components/ui/AppLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { validateCheckout, type CheckoutErrors, type CheckoutField, type CheckoutInput, type Order } from "@/lib/checkout";
import { checkPincode, formatDateRange } from "@/lib/delivery";
import { formatINR } from "@/lib/format";
import { INDIAN_STATES, isPincode } from "@/lib/india";
import { isLocalPreview, isPreview } from "@/lib/preview";
import type { CartProduct, PaymentMethod } from "@/lib/pricing";
import { saveConfirmation } from "./confirmation-store";
import { isPreviewUpi, upiAvailable } from "@/lib/upi";
import { payWithRazorpay } from "./razorpay-client";
import { formatDateRangeHi } from "@/i18n/format";
import { hiMessage } from "@/i18n/messages";
import { hiProductName, hiVariant, stateNames } from "@/i18n/names";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

type Fields = Pick<CheckoutInput, "name" | "phone" | "email" | "pincode" | "line1" | "line2" | "landmark" | "city" | "state" | "giftMessage">;
const EMPTY: Fields = { name: "", phone: "", email: "", pincode: "", line1: "", line2: "", landmark: "", city: "", state: "", giftMessage: "" };
const FIELD_ORDER: CheckoutField[] = ["name", "phone", "email", "pincode", "line1", "line2", "landmark", "city", "state", "giftMessage", "payment"];

const defaultPayment: PaymentMethod = upiAvailable() ? "upi" : site.payments.cashOnDelivery ? "cod" : "whatsapp";

/** Guest checkout: contact, address (pincode fills city and state), gift options, payment, summary. */
export function CheckoutView({ catalogue }: { catalogue: CartProduct[] }) {
  const router = useRouter();
  const { couponCode, clearCart } = useShop();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [giftWrap, setGiftWrap] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>(defaultPayment);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [pinState, setPinState] = useState<{ pin: string; status: "loading" | "found" | "missing" } | null>(null);
  /** Estimated arrival, in English and Hindi. */
  const [estimate, setEstimate] = useState<{ en: string; hi: string } | null>(null);
  const hi = useLang() === "hi";
  const autoFilled = useRef({ city: false, state: false });
  const honeypot = useRef<HTMLInputElement>(null);

  const totals = useCartTotals(catalogue, giftWrap, payment);

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (key === "city" || key === "state") autoFilled.current[key] = false;
    if (errors[key])
      setErrors((cur) => {
        const next = { ...cur };
        delete next[key];
        return next;
      });
  };

  const onPincode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    set("pincode", pin);
    if (!isPincode(pin)) {
      setPinState(null);
      setEstimate(null);
      return;
    }
    // event.timeStamp is measured from page load; add the page's start time for "now".
    const check = checkPincode(pin, totals.making, performance.timeOrigin + e.timeStamp);
    setEstimate(check.status === "ok" ? { en: formatDateRange(check.from, check.to), hi: formatDateRangeHi(check.from, check.to) } : null);
    setPinState({ pin, status: "loading" });
    try {
      const res = await fetch(`/api/pincode/${pin}`);
      const data = (await res.json()) as { ok: boolean; city?: string; state?: string | null };
      setPinState((cur) => (cur?.pin === pin ? { pin, status: data.ok ? "found" : "missing" } : cur));
      if (!data.ok) return;
      setErrors(({ city, state, ...rest }) => ({ ...rest, ...(data.city ? {} : { city }), ...(data.state ? {} : { state }) }));
      setFields((f) => {
        if (f.pincode !== pin) return f;
        const next = { ...f };
        if (data.city && (!f.city || autoFilled.current.city)) {
          next.city = data.city;
          autoFilled.current.city = true;
        }
        if (data.state && (!f.state || autoFilled.current.state)) {
          next.state = data.state;
          autoFilled.current.state = true;
        }
        return next;
      });
    } catch {
      setPinState((cur) => (cur?.pin === pin ? { pin, status: "missing" } : cur));
    }
  };

  const finish = (order: Order, whatsappUrl?: string, personaliseUrl?: string) => {
    saveConfirmation(order, whatsappUrl, personaliseUrl);
    setPlaced(true);
    clearCart();
    router.push(`/checkout/confirmation?order=${encodeURIComponent(order.id)}`);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send only the pieces shown in the summary: a saved cart can still hold a piece that has
    // since been renamed or removed, and the server would refuse the whole order for it.
    const lines = totals.lines.map((l) => ({ ...l.line, quantity: l.quantity }));
    const input: CheckoutInput = { ...fields, giftWrap, payment, couponCode, lines, website: honeypot.current?.value ?? "" };
    const found = validateCheckout(input);
    setErrors(found);
    setMessage(null);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    if (found.lines || totals.lines.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const data = await res.json();
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "We couldn't place your order. Please try again.");
        setBusy(false);
        return;
      }
      if (data.razorpay) {
        const paid = await payWithRazorpay(data.order, data.razorpay);
        if (paid.ok) finish(paid.order);
        else {
          setMessage(paid.message);
          setBusy(false);
        }
        return;
      }
      finish(data.order, data.whatsappUrl, data.personaliseUrl);
    } catch {
      setMessage("We couldn't place your order. Please check your connection and try again, or order on WhatsApp.");
      setBusy(false);
    }
  };

  if (placed) {
    return (
      <p className="flex items-center gap-3 py-24 text-[15px]" role="status">
        <Loader2 className="animate-spin" size={18} aria-hidden="true" /> <T en="Placing your order…" hi="आपका ऑर्डर हो रहा है…" />
      </p>
    );
  }

  if (totals.lines.length === 0) {
    return (
      <div className="mount mb-20 flex flex-col items-center px-8 py-16 text-center">
        <p className="text-[18px] font-medium">
          <T en="Your cart is empty" hi="आपका कार्ट ख़ाली है" />
        </p>
        <p className="mt-2 text-muted">
          <T en="Add a piece to your cart to check out." hi="चेकआउट के लिए कार्ट में कोई पीस डालें।" />
        </p>
        <AppLink href="/shop" className="btn btn-dark mt-7">
          <T en="Shop all" hi="सभी चीज़ें देखें" />
        </AppLink>
      </div>
    );
  }

  const total = formatINR(totals.total);
  const submitLabel =
    payment === "whatsapp" ? (
      <T en="Continue to WhatsApp" hi="WhatsApp पर आगे बढ़ें" />
    ) : payment === "online" ? (
      <T en={`Pay ${total}`} hi={`${total} चुकाएँ`} />
    ) : payment === "upi" ? (
      <T en={`Continue to pay · ${total}`} hi={`भुगतान के लिए आगे बढ़ें · ${total}`} />
    ) : (
      <T en={`Place order · ${total}`} hi={`ऑर्डर करें · ${total}`} />
    );

  return (
    <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 md:pb-28">
      <form id="checkout" onSubmit={submit} noValidate className="min-w-0 space-y-10">
        {isPreview && (
          <p className="surface-amber px-4 py-3 text-[12.5px] leading-relaxed">
            <strong className="font-semibold">
              <T en="Preview checkout." hi="प्रीव्यू चेकआउट।" />
            </strong>{" "}
            {isLocalPreview ? (
              <T
                en="Orders are saved on this computer only (in .data/), emails are saved as files, and no money is taken."
                hi="ऑर्डर सिर्फ़ इसी कंप्यूटर पर (.data/ में) सेव होते हैं, ईमेल फ़ाइल के रूप में सेव होते हैं, और कोई पैसा नहीं कटता।"
              />
            ) : (
              <T
                en="Orders placed here are tests: they are not saved or sent to the studio, and no money is taken. “Order on WhatsApp” does open a real chat with the studio."
                hi="यहाँ किए गए ऑर्डर टेस्ट हैं: ये न सेव होते हैं, न स्टूडियो तक जाते हैं, और कोई पैसा नहीं कटता। “WhatsApp पर ऑर्डर करें” से स्टूडियो के साथ असली चैट खुलती है।"
              />
            )}
          </p>
        )}

        <Section n={1} title={<T en="Contact" hi="संपर्क" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label={<T en="Full name" hi="पूरा नाम" />} error={errors.name} className="sm:col-span-2">
              <input id="co-name" autoComplete="name" value={fields.name} onChange={(e) => set("name", e.target.value)} {...aria("name", errors)} className={input(errors.name)} />
            </Field>
            <Field id="phone" label={<T en="Mobile number" hi="मोबाइल नंबर" />} error={errors.phone} hint={<T en="For delivery updates" hi="डिलीवरी की जानकारी के लिए" />}>
              <div className={clsx(input(errors.phone), "flex items-center gap-2 px-0")}>
                <span className="border-r border-ink/15 px-3 text-muted">+91</span>
                <input
                  id="co-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={fields.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  {...aria("phone", errors)}
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 outline-none"
                />
              </div>
            </Field>
            <Field id="email" label={<T en="Email (optional)" hi="ईमेल (ज़रूरी नहीं)" />} error={errors.email} hint={<T en="For your order confirmation" hi="ऑर्डर की पुष्टि के लिए" />}>
              <input id="co-email" type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email", e.target.value)} {...aria("email", errors)} className={input(errors.email)} />
            </Field>
          </div>
        </Section>

        <Section n={2} title={<T en="Delivery address" hi="डिलीवरी का पता" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pincode"
              label={<T en="Pincode" hi="पिनकोड" />}
              error={errors.pincode}
              hint={
                pinState?.status === "loading" ? (
                  <T en="Looking up your area…" hi="आपका इलाका ढूँढ़ रहे हैं…" />
                ) : estimate ? (
                  <T en={`Estimated arrival ${estimate.en}`} hi={`अनुमानित पहुँच ${estimate.hi}`} />
                ) : (
                  <T en="We fill in the city and state for you" hi="शहर और राज्य हम अपने आप भर देते हैं" />
                )
              }
            >
              <input id="co-pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={fields.pincode} onChange={onPincode} {...aria("pincode", errors)} className={input(errors.pincode)} />
            </Field>
            <div className="hidden sm:block" />
            <Field id="line1" label={<T en="House or flat number, building" hi="मकान या फ़्लैट नंबर, बिल्डिंग" />} error={errors.line1} className="sm:col-span-2">
              <input id="co-line1" autoComplete="address-line1" value={fields.line1} onChange={(e) => set("line1", e.target.value)} {...aria("line1", errors)} className={input(errors.line1)} />
            </Field>
            <Field id="line2" label={<T en="Street, area or colony" hi="गली, इलाका या कॉलोनी" />} error={errors.line2} className="sm:col-span-2">
              <input id="co-line2" autoComplete="address-line2" value={fields.line2} onChange={(e) => set("line2", e.target.value)} {...aria("line2", errors)} className={input(errors.line2)} />
            </Field>
            <Field id="landmark" label={<T en="Landmark (optional)" hi="पास की कोई पहचान (ज़रूरी नहीं)" />} error={errors.landmark} className="sm:col-span-2">
              <input id="co-landmark" value={fields.landmark} onChange={(e) => set("landmark", e.target.value)} className={input(errors.landmark)} />
            </Field>
            <Field id="city" label={<T en="City or town" hi="शहर या कस्बा" />} error={errors.city}>
              <input id="co-city" autoComplete="address-level2" value={fields.city} onChange={(e) => set("city", e.target.value)} {...aria("city", errors)} className={input(errors.city)} />
            </Field>
            <Field id="state" label={<T en="State" hi="राज्य" />} error={errors.state}>
              <select id="co-state" autoComplete="address-level1" value={fields.state} onChange={(e) => set("state", e.target.value)} {...aria("state", errors)} className={clsx(input(errors.state), "cursor-pointer")}>
                <option value="">{hi ? "चुनें…" : "Choose…"}</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {hi ? (stateNames[s] ?? s) : s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {site.giftWrap.enabled && (
          <Section n={3} title={<T en="Gift options" hi="गिफ़्ट के विकल्प" />}>
            <label className="flex cursor-pointer items-start gap-3 text-[14px]">
              <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="mt-1 h-4 w-4 accent-brown" />
              <span>
                <T en="Gift wrap this order" hi="इस ऑर्डर को गिफ़्ट रैप करें" /> <span className="text-muted">(+{formatINR(site.giftWrap.price)})</span>
              </span>
            </label>
            <Field id="giftMessage" label={<T en="Gift message (optional)" hi="गिफ़्ट संदेश (ज़रूरी नहीं)" />} error={errors.giftMessage} className="mt-4" hint={`${fields.giftMessage.length}/${site.giftWrap.messageMaxLength}`}>
              <textarea
                id="co-giftMessage"
                rows={3}
                maxLength={site.giftWrap.messageMaxLength}
                value={fields.giftMessage}
                onChange={(e) => set("giftMessage", e.target.value)}
                placeholder={hi ? "तोहफ़े के साथ भेजने के लिए एक छोटा संदेश" : "A short note to send with the gift"}
                className={clsx(input(errors.giftMessage), "h-auto py-2.5")}
              />
            </Field>
          </Section>
        )}

        <Section n={site.giftWrap.enabled ? 4 : 3} title={<T en="Payment" hi="भुगतान" />}>
          <fieldset className="space-y-3">
            <legend className="sr-only">
              <T en="Payment method" hi="भुगतान का तरीक़ा" />
            </legend>
            {upiAvailable() && (
              <PayOption
                value="upi"
                current={payment}
                onChange={setPayment}
                title={<T en="Pay by UPI" hi="UPI से भुगतान करें" />}
                badge={isPreviewUpi() ? <T en="Preview" hi="प्रीव्यू" /> : undefined}
              >
                <T
                  en="GPay, PhonePe, Paytm or any UPI app. You pay on the next screen; scan the QR code on a computer."
                  hi="GPay, PhonePe, Paytm या कोई भी UPI ऐप। भुगतान अगली स्क्रीन पर होगा; कंप्यूटर पर QR कोड स्कैन करें।"
                />
              </PayOption>
            )}
            {site.payments.cashOnDelivery && (
              <PayOption value="cod" current={payment} onChange={setPayment} title={<T en="Cash on Delivery" hi="कैश ऑन डिलीवरी" />}>
                <T
                  en={`Pay when your order arrives${site.payments.codFee ? ` (+${formatINR(site.payments.codFee)} fee)` : ""}.`}
                  hi={`ऑर्डर पहुँचने पर भुगतान करें${site.payments.codFee ? ` (+${formatINR(site.payments.codFee)} शुल्क)` : ""}।`}
                />
              </PayOption>
            )}
            <PayOption
              value="online"
              current={payment}
              onChange={setPayment}
              title={<T en="Pay online" hi="ऑनलाइन भुगतान" />}
              disabled={!site.payments.razorpayEnabled}
              badge={site.payments.razorpayEnabled ? undefined : <T en="Coming soon" hi="जल्द आ रहा है" />}
            >
              <T en="UPI, cards, netbanking and wallets, through Razorpay." hi="Razorpay से UPI, कार्ड, नेटबैंकिंग और वॉलेट।" />
            </PayOption>
            {site.payments.orderOnWhatsApp && (
              <PayOption value="whatsapp" current={payment} onChange={setPayment} title={<T en="Order on WhatsApp" hi="WhatsApp पर ऑर्डर करें" />}>
                <T en="Send the order to us in a chat. We confirm it with you there." hi="ऑर्डर हमें चैट में भेजें। हम वहीं आपके साथ उसकी पुष्टि करेंगे।" />
              </PayOption>
            )}
          </fieldset>
        </Section>

        {/* Honeypot: hidden from people, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </form>

      <aside aria-label={hi ? "ऑर्डर का सारांश" : "Order summary"} className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line p-6">
          <h2 className="nav-label">
            <T en="Order summary" hi="ऑर्डर का सारांश" />
          </h2>
          {totals.unavailable.length > 0 && (
            <p className="mt-4 surface-amber px-3 py-2 text-[12.5px]" role="status">
              <T
                en={`${totals.unavailable.length === 1 ? "One piece in your cart is" : `${totals.unavailable.length} pieces in your cart are`} no longer available, so ${totals.unavailable.length === 1 ? "it is" : "they are"} left out of this order.`}
                hi={`आपके कार्ट के ${totals.unavailable.length === 1 ? "एक पीस" : `${totals.unavailable.length} पीस`} अब उपलब्ध नहीं ${totals.unavailable.length === 1 ? "है" : "हैं"}, इसलिए ${totals.unavailable.length === 1 ? "उसे" : "उन्हें"} इस ऑर्डर में शामिल नहीं किया गया।`}
              />
            </p>
          )}
          <ul className="mt-5 space-y-4">
            {totals.lines.map((l) => (
              <li key={l.key} className="flex gap-3">
                <span className="relative h-[75px] w-[60px] shrink-0 overflow-hidden bg-brown">
                  {l.product.image && <Image src={l.product.image} alt="" fill sizes="60px" className="object-cover" />}
                  <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center bg-brown px-1 text-[10.5px] font-semibold text-paper tabular-nums">{l.quantity}</span>
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug">
                  <span className="line-clamp-2">
                    <T en={l.product.name} hi={hiProductName(l.product.slug)} />
                  </span>
                  {l.line.variant && (
                    <span className="block text-[12px] text-muted">
                      <T en={l.line.variant} hi={hiVariant(l.line.variant)} />
                    </span>
                  )}
                </span>
                <span className="text-[13px] tabular-nums">{formatINR(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-ink/10 pt-5">
            <CouponField totals={totals} />
          </div>
          <div className="mt-5">
            <TotalsTable totals={totals} final />
          </div>
          {estimate && (
            <p className="mt-3 text-[12.5px]">
              <T en={`Estimated arrival ${estimate.en}, including making time.`} hi={`बनने के समय को मिलाकर, अनुमानित पहुँच ${estimate.hi}।`} />
            </p>
          )}

          {message && (
            <p role="alert" className="mt-5 border border-error px-3 py-2.5 text-[13px] text-error">
              <T en={message} hi={hiMessage(message)} />
            </p>
          )}
          <button
            type="submit"
            form="checkout"
            disabled={busy}
            className={clsx("btn mt-6 w-full disabled:opacity-60", payment === "whatsapp" ? "btn-whatsapp" : "btn-dark")}
          >
            {busy ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : payment === "whatsapp" ? <WhatsAppIcon size={17} /> : <Lock size={15} aria-hidden="true" />}
            {busy ? <T en="Placing order…" hi="ऑर्डर हो रहा है…" /> : submitLabel}
          </button>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
            <T
              en={
                <>
                  By placing this order you agree to our{" "}
                  <AppLink href="/terms" className="underline underline-offset-2">
                    terms
                  </AppLink>{" "}
                  and{" "}
                  <AppLink href="/privacy" className="underline underline-offset-2">
                    privacy policy
                  </AppLink>
                  .
                </>
              }
              hi={
                <>
                  ऑर्डर करके आप हमारे{" "}
                  <AppLink href="/terms" className="underline underline-offset-2">
                    नियम और शर्तें
                  </AppLink>{" "}
                  और{" "}
                  <AppLink href="/privacy" className="underline underline-offset-2">
                    प्राइवेसी पॉलिसी
                  </AppLink>{" "}
                  मानते हैं।
                </>
              }
            />
          </p>
        </div>
        <AppLink href="/cart" className="mt-4 inline-block text-[12.5px] underline underline-offset-4">
          <T en="Back to cart" hi="कार्ट पर वापस जाएँ" />
        </AppLink>
      </aside>
    </div>
  );
}

const input = (error?: string) =>
  clsx(
    "h-12 w-full border bg-transparent px-3 text-[14px] outline-none transition-colors focus-within:border-ink focus:border-ink",
    error ? "border-error" : "border-ink/30",
  );

const aria = (key: CheckoutField, errors: CheckoutErrors) => ({
  "aria-invalid": errors[key] ? true : undefined,
  "aria-describedby": `co-${key}-note`,
});

function Section({ n, title, children }: { n: number; title: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.16em]">
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-brown text-[12px] text-paper">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, error, hint, className, children }: { id: string; label: ReactNode; error?: string; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`co-${id}`} className="mb-1.5 block text-[12.5px] font-medium">
        {label}
      </label>
      {children}
      <p id={`co-${id}-note`} className={clsx("mt-1.5 min-h-[1em] text-[12px]", error ? "text-error" : "text-muted")} role={error ? "alert" : undefined}>
        {error ? <T en={error} hi={hiMessage(error)} /> : hint}
      </p>
    </div>
  );
}

function PayOption({
  value,
  current,
  onChange,
  title,
  disabled,
  badge,
  children,
}: {
  value: PaymentMethod;
  current: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  title: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
  children: ReactNode;
}) {
  const selected = current === value;
  return (
    <label className={clsx("flex items-start gap-3 border p-4 transition-colors", selected ? "border-brown ring-1 ring-brown" : "border-ink/30", disabled ? "cursor-not-allowed border-dashed text-muted" : "cursor-pointer hover:border-ink/50")}>
      <input type="radio" name="payment" value={value} checked={selected} disabled={disabled} onChange={() => onChange(value)} className="mt-1 h-4 w-4 accent-brown" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[14px] font-medium">
          {title}
          {badge && <span className="bg-amber px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#1e140d]">{badge}</span>}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">{children}</span>
      </span>
    </label>
  );
}
