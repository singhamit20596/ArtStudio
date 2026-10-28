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
  const [estimate, setEstimate] = useState<string | null>(null);
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
    setEstimate(check.status === "ok" ? formatDateRange(check.from, check.to) : null);
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
        <Loader2 className="animate-spin" size={18} aria-hidden="true" /> Placing your order…
      </p>
    );
  }

  if (totals.lines.length === 0) {
    return (
      <div className="mount mb-20 flex flex-col items-center px-8 py-16 text-center">
        <p className="text-[18px] font-medium">Your cart is empty</p>
        <p className="mt-2 text-muted">Add a piece to your cart to check out.</p>
        <AppLink href="/shop" className="btn btn-dark mt-7">
          Shop all
        </AppLink>
      </div>
    );
  }

  const submitLabel =
    payment === "whatsapp"
      ? "Continue to WhatsApp"
      : payment === "online"
        ? `Pay ${formatINR(totals.total)}`
        : payment === "upi"
          ? `Continue to pay · ${formatINR(totals.total)}`
          : `Place order · ${formatINR(totals.total)}`;

  return (
    <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 md:pb-28">
      <form id="checkout" onSubmit={submit} noValidate className="min-w-0 space-y-10">
        {isPreview && (
          <p className="surface-amber px-4 py-3 text-[12.5px] leading-relaxed">
            <strong className="font-semibold">Preview checkout.</strong>{" "}
            {isLocalPreview
              ? "Orders are saved on this computer only (in .data/), emails are saved as files, and no money is taken."
              : "Orders placed here are tests: they are not saved or sent to the studio, and no money is taken. “Order on WhatsApp” does open a real chat with the studio."}
          </p>
        )}

        <Section n={1} title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Full name" error={errors.name} className="sm:col-span-2">
              <input id="co-name" autoComplete="name" value={fields.name} onChange={(e) => set("name", e.target.value)} {...aria("name", errors)} className={input(errors.name)} />
            </Field>
            <Field id="phone" label="Mobile number" error={errors.phone} hint="For delivery updates">
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
            <Field id="email" label="Email (optional)" error={errors.email} hint="For your order confirmation">
              <input id="co-email" type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email", e.target.value)} {...aria("email", errors)} className={input(errors.email)} />
            </Field>
          </div>
        </Section>

        <Section n={2} title="Delivery address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pincode"
              label="Pincode"
              error={errors.pincode}
              hint={
                pinState?.status === "loading"
                  ? "Looking up your area…"
                  : estimate
                    ? `Estimated arrival ${estimate}`
                    : "We fill in the city and state for you"
              }
            >
              <input id="co-pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={fields.pincode} onChange={onPincode} {...aria("pincode", errors)} className={input(errors.pincode)} />
            </Field>
            <div className="hidden sm:block" />
            <Field id="line1" label="House or flat number, building" error={errors.line1} className="sm:col-span-2">
              <input id="co-line1" autoComplete="address-line1" value={fields.line1} onChange={(e) => set("line1", e.target.value)} {...aria("line1", errors)} className={input(errors.line1)} />
            </Field>
            <Field id="line2" label="Street, area or colony" error={errors.line2} className="sm:col-span-2">
              <input id="co-line2" autoComplete="address-line2" value={fields.line2} onChange={(e) => set("line2", e.target.value)} {...aria("line2", errors)} className={input(errors.line2)} />
            </Field>
            <Field id="landmark" label="Landmark (optional)" error={errors.landmark} className="sm:col-span-2">
              <input id="co-landmark" value={fields.landmark} onChange={(e) => set("landmark", e.target.value)} className={input(errors.landmark)} />
            </Field>
            <Field id="city" label="City or town" error={errors.city}>
              <input id="co-city" autoComplete="address-level2" value={fields.city} onChange={(e) => set("city", e.target.value)} {...aria("city", errors)} className={input(errors.city)} />
            </Field>
            <Field id="state" label="State" error={errors.state}>
              <select id="co-state" autoComplete="address-level1" value={fields.state} onChange={(e) => set("state", e.target.value)} {...aria("state", errors)} className={clsx(input(errors.state), "cursor-pointer")}>
                <option value="">Choose…</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {site.giftWrap.enabled && (
          <Section n={3} title="Gift options">
            <label className="flex cursor-pointer items-start gap-3 text-[14px]">
              <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="mt-1 h-4 w-4 accent-brown" />
              <span>
                Gift wrap this order <span className="text-muted">(+{formatINR(site.giftWrap.price)})</span>
              </span>
            </label>
            <Field id="giftMessage" label="Gift message (optional)" error={errors.giftMessage} className="mt-4" hint={`${fields.giftMessage.length}/${site.giftWrap.messageMaxLength}`}>
              <textarea
                id="co-giftMessage"
                rows={3}
                maxLength={site.giftWrap.messageMaxLength}
                value={fields.giftMessage}
                onChange={(e) => set("giftMessage", e.target.value)}
                placeholder="A short note to send with the gift"
                className={clsx(input(errors.giftMessage), "h-auto py-2.5")}
              />
            </Field>
          </Section>
        )}

        <Section n={site.giftWrap.enabled ? 4 : 3} title="Payment">
          <fieldset className="space-y-3">
            <legend className="sr-only">Payment method</legend>
            {upiAvailable() && (
              <PayOption value="upi" current={payment} onChange={setPayment} title="Pay by UPI" badge={isPreviewUpi() ? "Preview" : undefined}>
                GPay, PhonePe, Paytm or any UPI app. You pay on the next screen; scan the QR code on a computer.
              </PayOption>
            )}
            {site.payments.cashOnDelivery && (
              <PayOption value="cod" current={payment} onChange={setPayment} title="Cash on Delivery">
                Pay when your order arrives{site.payments.codFee ? ` (+${formatINR(site.payments.codFee)} fee)` : ""}.
              </PayOption>
            )}
            <PayOption value="online" current={payment} onChange={setPayment} title="Pay online" disabled={!site.payments.razorpayEnabled} badge={site.payments.razorpayEnabled ? undefined : "Coming soon"}>
              UPI, cards, netbanking and wallets, through Razorpay.
            </PayOption>
            {site.payments.orderOnWhatsApp && (
              <PayOption value="whatsapp" current={payment} onChange={setPayment} title="Order on WhatsApp">
                Send the order to us in a chat. We confirm it with you there.
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

      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line p-6">
          <h2 className="nav-label">Order summary</h2>
          {totals.unavailable.length > 0 && (
            <p className="mt-4 surface-amber px-3 py-2 text-[12.5px]" role="status">
              {totals.unavailable.length === 1 ? "One piece in your cart is" : `${totals.unavailable.length} pieces in your cart are`} no longer available, so{" "}
              {totals.unavailable.length === 1 ? "it is" : "they are"} left out of this order.
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
                  <span className="line-clamp-2">{l.product.name}</span>
                  {l.line.variant && <span className="block text-[12px] text-muted">{l.line.variant}</span>}
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
          {estimate && <p className="mt-3 text-[12.5px]">Estimated arrival {estimate}, including making time.</p>}

          {message && (
            <p role="alert" className="mt-5 border border-error px-3 py-2.5 text-[13px] text-error">
              {message}
            </p>
          )}
          <button
            type="submit"
            form="checkout"
            disabled={busy}
            className={clsx("btn mt-6 w-full disabled:opacity-60", payment === "whatsapp" ? "btn-whatsapp" : "btn-dark")}
          >
            {busy ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : payment === "whatsapp" ? <WhatsAppIcon size={17} /> : <Lock size={15} aria-hidden="true" />}
            {busy ? "Placing order…" : submitLabel}
          </button>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
            By placing this order you agree to our{" "}
            <AppLink href="/terms" className="underline underline-offset-2">
              terms
            </AppLink>{" "}
            and{" "}
            <AppLink href="/privacy" className="underline underline-offset-2">
              privacy policy
            </AppLink>
            .
          </p>
        </div>
        <AppLink href="/cart" className="mt-4 inline-block text-[12.5px] underline underline-offset-4">
          Back to cart
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

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
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

function Field({ id, label, error, hint, className, children }: { id: string; label: string; error?: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`co-${id}`} className="mb-1.5 block text-[12.5px] font-medium">
        {label}
      </label>
      {children}
      <p id={`co-${id}-note`} className={clsx("mt-1.5 min-h-[1em] text-[12px]", error ? "text-error" : "text-muted")} role={error ? "alert" : undefined}>
        {error ?? hint}
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
  title: string;
  disabled?: boolean;
  badge?: string;
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
