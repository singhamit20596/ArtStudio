"use client";

import clsx from "clsx";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { frameItems, services, type FrameItemId, type ServiceId } from "@/config/tribute";
import { isLocalPreview, isPreview } from "@/lib/preview";
import { emptyRequest, itemLabels, REQUEST_STEPS, validateRequest, type FrameRequest, type FrameRequestInput, type RequestErrors, type RequestField } from "@/lib/requests";
import { FramePreview } from "./FramePreview";

type Done = { request: FrameRequest; whatsappUrl: string };

/** Four short steps, a live preview beside them, then the hand-off to WhatsApp. */
export function RequestForm({ initial }: { initial: Partial<Pick<FrameRequestInput, "service" | "rank" | "name">> }) {
  const [values, setValues] = useState<FrameRequestInput>({ ...emptyRequest, ...initial });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [step, done]);

  const set = <K extends RequestField>(key: K, value: FrameRequestInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key])
      setErrors((cur) => {
        const next = { ...cur };
        delete next[key];
        return next;
      });
  };
  const toggleItem = (id: FrameItemId) => set("items", values.items.includes(id) ? values.items.filter((i) => i !== id) : [...values.items, id]);

  const last = step === REQUEST_STEPS.length - 1;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const found = validateRequest(values, step);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`rq-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (!last) {
      setStep((s) => s + 1);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "" }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "We couldn't send your request. Please try again.");
        const bad = REQUEST_STEPS.findIndex((s) => s.fields.some((f) => data.errors?.[f]));
        if (bad >= 0) setStep(bad);
      } else {
        setDone({ request: data.request, whatsappUrl: data.whatsappUrl });
      }
    } catch {
      setMessage("We couldn't send your request. Please check your connection and try again, or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  const detail = [values.unit, values.years].filter((s) => s.trim()).join(" · ");
  const preview = (
    <FramePreview service={values.service} rank={values.rank} name={values.name} detail={detail || undefined} items={values.items} className="block h-auto w-full" />
  );

  if (done) {
    const r = done.request;
    return (
      <div ref={stepRef} className="pop-in mx-auto max-w-2xl text-center">
        <CheckCircle2 size={44} strokeWidth={1.4} className="mx-auto text-brown" aria-hidden="true" />
        <p className="eyebrow mt-5">Request {r.id}</p>
        <h2 tabIndex={-1} className="mt-3 text-[28px] font-semibold leading-tight outline-none md:text-[38px]">
          One last step: send it on WhatsApp
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Tap below to send your request to us, then attach photos of the medals, badges and the photograph in the chat. We reply with the layout and the final price.
        </p>
        <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-press mt-8">
          <WhatsAppIcon size={18} /> Send on WhatsApp
        </a>
        {r.customer.email && r.emailsSent && <p className="mt-4 text-[13px] text-muted">We have emailed a copy to {r.customer.email}.</p>}
        {isPreview && !r.emailsSent && (
          <p className="surface-amber mx-auto mt-6 max-w-lg px-4 py-2.5 text-[12.5px]">
            {isLocalPreview ? "Preview: saved in .data/requests.jsonl, with the emails in .data/emails/." : "Preview: this test request was not saved or emailed."}
          </p>
        )}
        <div className="mx-auto mt-10 max-w-md">{preview}</div>
        <p className="mt-3 text-[12px] text-muted">
          {r.officer.rank} {r.officer.name} · {r.service} · {itemLabels(r.items).join(", ")}
        </p>
      </div>
    );
  }

  const pct = ((step + 1) / REQUEST_STEPS.length) * 100;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
      <div className="min-w-0">
        {/* Progress */}
        <ol className="grid grid-cols-4 gap-2" aria-label="Steps">
          {REQUEST_STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={clsx("w-full text-left text-[11px] font-semibold uppercase tracking-[0.14em] transition-opacity disabled:cursor-default", i <= step ? "opacity-100" : "opacity-50")}
              >
                <span className="block tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="block truncate">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 h-1 bg-brown/20" role="progressbar" aria-label="Request progress" aria-valuemin={1} aria-valuemax={REQUEST_STEPS.length} aria-valuenow={step + 1}>
          <div className="h-full bg-brown transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>

        <div className="mx-auto mt-8 max-w-md md:hidden">{preview}</div>

        <form onSubmit={submit} noValidate className="mt-8">
          <div ref={stepRef} key={step} className="step-in">
            {step === 0 && (
              <Step title="Which service did they retire from?">
                <fieldset>
                  <legend className="sr-only">Service</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {services.map((s) => (
                      <label
                        key={s.id}
                        className={clsx(
                          "btn-press flex cursor-pointer items-center gap-3 border p-4 transition-colors",
                          values.service === s.id ? "border-brown ring-1 ring-brown" : "border-line hover:border-ink",
                        )}
                      >
                        <input id={s.id === "army" ? "rq-service" : undefined} type="radio" name="service" checked={values.service === s.id} onChange={() => set("service", s.id as ServiceId)} />
                        <span className="text-[15px] font-medium">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {values.service === "other" && (
                  <Field id="serviceOther" label="Which service?" error={errors.serviceOther} className="pop-in mt-5">
                    <input id="rq-serviceOther" value={values.serviceOther} onChange={(e) => set("serviceOther", e.target.value)} className={input(errors.serviceOther)} />
                  </Field>
                )}
              </Step>
            )}

            {step === 1 && (
              <Step title="Who is the frame for?" hint="This is what we engrave on the name plate.">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <Field id="rank" label="Rank" error={errors.rank}>
                    <input id="rq-rank" value={values.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. Col, Cdr, Wg Cdr" className={input(errors.rank)} />
                  </Field>
                  <Field id="name" label="Full name" error={errors.name}>
                    <input id="rq-name" value={values.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} />
                  </Field>
                </div>
                <Field id="unit" label="Unit, squadron, ship or regiment (optional)" error={errors.unit} className="mt-4">
                  <input id="rq-unit" value={values.unit} onChange={(e) => set("unit", e.target.value)} className={input(errors.unit)} />
                </Field>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field id="years" label="Years of service (optional)" error={errors.years}>
                    <input id="rq-years" value={values.years} onChange={(e) => set("years", e.target.value)} placeholder="e.g. 1994–2026" className={input(errors.years)} />
                  </Field>
                  <Field id="neededBy" label="Needed by (optional)" error={errors.neededBy}>
                    <input id="rq-neededBy" type="date" value={values.neededBy} onChange={(e) => set("neededBy", e.target.value)} className={input(errors.neededBy)} />
                  </Field>
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step title="What should go inside?" hint="Tick what they have. We plan the layout around it.">
                <fieldset>
                  <legend className="sr-only">Include in the frame</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {frameItems.map((f, i) => (
                      <label
                        key={f.id}
                        className={clsx(
                          "drop-in flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors",
                          values.items.includes(f.id) ? "border-brown" : "border-line hover:border-ink",
                        )}
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        <input id={i === 0 ? "rq-items" : undefined} type="checkbox" checked={values.items.includes(f.id)} onChange={() => toggleItem(f.id)} />
                        <span className="text-[14px]">{f.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.items && (
                    <p role="alert" className="mt-2 text-[12.5px] text-error">
                      {errors.items}
                    </p>
                  )}
                </fieldset>
                <Field id="notes" label="Anything else? (optional)" error={errors.notes} className="mt-5" hint={`${values.notes.length}/600`}>
                  <textarea
                    id="rq-notes"
                    rows={4}
                    maxLength={600}
                    value={values.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Size you have in mind, colours, a line you would like added…"
                    className={clsx(input(errors.notes), "h-auto py-2.5")}
                  />
                </Field>
              </Step>
            )}

            {step === 3 && (
              <Step title="Where can we reach you?" hint="We reply on WhatsApp with the layout and the final price.">
                <Field id="customerName" label="Your name" error={errors.customerName}>
                  <input id="rq-customerName" autoComplete="name" value={values.customerName} onChange={(e) => set("customerName", e.target.value)} className={input(errors.customerName)} />
                </Field>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field id="phone" label="WhatsApp number" error={errors.phone}>
                    <div className={clsx(input(errors.phone), "flex items-center gap-2 px-0")}>
                      <span className="border-r border-line px-3 text-muted">+91</span>
                      <input
                        id="rq-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={values.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="h-full min-w-0 flex-1 bg-transparent pr-3 outline-none"
                      />
                    </div>
                  </Field>
                  <Field id="city" label="City (optional)" error={errors.city}>
                    <input id="rq-city" autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} className={input(errors.city)} />
                  </Field>
                </div>
                <Field id="email" label="Email (optional)" error={errors.email} className="mt-4" hint="For a copy of your request">
                  <input id="rq-email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={input(errors.email)} />
                </Field>
                {isPreview && (
                  <p className="surface-amber mt-5 px-4 py-3 text-[12.5px]">
                    Preview: {isLocalPreview ? "requests are saved on this computer only." : "requests sent here are tests and go nowhere."} WhatsApp opens a real chat with the studio.
                  </p>
                )}
              </Step>
            )}
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {message && (
            <p role="alert" className="mt-6 border border-error px-3 py-2.5 text-[13px] text-error">
              {message}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-outline btn-press px-5">
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={busy} className="btn btn-dark btn-press px-6 disabled:opacity-70">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              {busy ? "Sending…" : last ? "Send request" : "Continue"}
              {!busy && !last && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
        </form>
      </div>

      <aside aria-label="Preview" className="hidden md:block">
        <div className="sticky top-28">
          <div className="shadow-[0_30px_60px_-30px_rgb(90_62_43/0.9)]">{preview}</div>
          <p className="mt-3 text-[12px] text-muted">A sketch of the idea. We plan the real layout with you around their own medals and photograph.</p>
        </div>
      </aside>
    </div>
  );
}

const input = (error?: string) =>
  clsx(
    "h-12 w-full border bg-transparent px-3 text-[14px] outline-none transition-colors placeholder:text-muted focus-within:border-ink focus:border-ink",
    error ? "border-error" : "border-line",
  );

function Step({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <h2 tabIndex={-1} className="text-[22px] font-semibold leading-snug outline-none md:text-[26px]">
        {title}
      </h2>
      {hint && <p className="mt-1.5 text-[14px] text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ id, label, error, hint, className, children }: { id: string; label: string; error?: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`rq-${id}`} className="mb-1.5 block text-[12.5px] font-medium">
        {label}
      </label>
      {children}
      <p className={clsx("mt-1.5 min-h-[1em] text-[12px]", error ? "text-error" : "text-muted")} role={error ? "alert" : undefined}>
        {error ?? hint}
      </p>
    </div>
  );
}
