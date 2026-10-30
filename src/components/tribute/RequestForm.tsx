"use client";

import clsx from "clsx";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { frameItems, services, type FrameItemId, type ServiceId } from "@/config/tribute";
import { isLocalPreview, isPreview } from "@/lib/preview";
import { emptyRequest, itemLabels, REQUEST_STEPS, validateRequest, type FrameRequest, type FrameRequestInput, type RequestErrors, type RequestField } from "@/lib/requests";
import { FramePreview } from "./FramePreview";
import { hiMessage } from "@/i18n/messages";
import { T } from "@/i18n/T";
import { frameItemsHi, servicesHi, stepTitlesHi } from "@/i18n/tribute";
import { useLang } from "@/i18n/use-lang";

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
  const hi = useLang() === "hi";

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
        <p className="eyebrow mt-5">
          <T en="Request" hi="अनुरोध" /> {r.id}
        </p>
        <h2 tabIndex={-1} className="mt-3 text-[28px] font-semibold leading-tight outline-none md:text-[38px]">
          <T en="One last step: send it on WhatsApp" hi="बस एक आख़िरी कदम: इसे WhatsApp पर भेजें" />
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          <T
            en="Tap below to send your request to us, then attach photos of the medals, badges and the photograph in the chat. We reply with the layout and the final price."
            hi="नीचे टैप करके अपना अनुरोध हमें भेजें, फिर चैट में मेडल, बैज और तस्वीर की फ़ोटो लगाएँ। हम लेआउट और आख़िरी कीमत के साथ जवाब देंगे।"
          />
        </p>
        <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-press mt-8">
          <WhatsAppIcon size={18} /> <T en="Send on WhatsApp" hi="WhatsApp पर भेजें" />
        </a>
        {r.customer.email && r.emailsSent && (
          <p className="mt-4 text-[13px] text-muted">
            <T en={`We have emailed a copy to ${r.customer.email}.`} hi={`हमने इसकी कॉपी ${r.customer.email} पर ईमेल कर दी है।`} />
          </p>
        )}
        {isPreview && !r.emailsSent && (
          <p className="surface-amber mx-auto mt-6 max-w-lg px-4 py-2.5 text-[12.5px]">
            {isLocalPreview ? (
              <T en="Preview: saved in .data/requests.jsonl, with the emails in .data/emails/." hi="प्रीव्यू: .data/requests.jsonl में सेव हुआ, ईमेल .data/emails/ में।" />
            ) : (
              <T en="Preview: this test request was not saved or emailed." hi="प्रीव्यू: यह टेस्ट अनुरोध न सेव हुआ, न ईमेल हुआ।" />
            )}
          </p>
        )}
        <div className="mx-auto mt-10 max-w-md">{preview}</div>
        <p className="mt-3 text-[12px] text-muted">
          <T
            en={`${r.officer.rank} ${r.officer.name} · ${r.service} · ${itemLabels(r.items).join(", ")}`}
            hi={`${r.officer.rank} ${r.officer.name} · ${servicesHi[services.find((s) => s.label === r.service)?.id ?? ""]?.label ?? r.service} · ${r.items.map((id) => frameItemsHi[id] ?? id).join(", ")}`}
          />
        </p>
      </div>
    );
  }

  const pct = ((step + 1) / REQUEST_STEPS.length) * 100;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
      <div className="min-w-0">
        {/* Progress */}
        <ol className="grid grid-cols-4 gap-2" aria-label={hi ? "चरण" : "Steps"}>
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
                <span className="block truncate">
                  <T en={s.title} hi={stepTitlesHi[s.title]} />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 h-1 bg-brown/20" role="progressbar" aria-label={hi ? "अनुरोध की प्रगति" : "Request progress"} aria-valuemin={1} aria-valuemax={REQUEST_STEPS.length} aria-valuenow={step + 1}>
          <div className="h-full bg-brown transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>

        <div className="mx-auto mt-8 max-w-md md:hidden">{preview}</div>

        <form onSubmit={submit} noValidate className="mt-8">
          <div ref={stepRef} key={step} className="step-in">
            {step === 0 && (
              <Step title={<T en="Which service did they retire from?" hi="वे किस सेना से रिटायर हुए?" />}>
                <fieldset>
                  <legend className="sr-only">
                    <T en="Service" hi="सेवा" />
                  </legend>
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
                        <span className="text-[15px] font-medium">
                          <T en={s.label} hi={servicesHi[s.id]?.label} />
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {values.service === "other" && (
                  <Field id="serviceOther" label={<T en="Which service?" hi="कौन-सी सेवा?" />} error={errors.serviceOther} className="pop-in mt-5">
                    <input id="rq-serviceOther" value={values.serviceOther} onChange={(e) => set("serviceOther", e.target.value)} className={input(errors.serviceOther)} />
                  </Field>
                )}
              </Step>
            )}

            {step === 1 && (
              <Step
                title={<T en="Who is the frame for?" hi="फ़्रेम किसके लिए है?" />}
                hint={<T en="This is what we engrave on the name plate." hi="यही हम नेम प्लेट पर खुदवाएँगे।" />}
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <Field id="rank" label={<T en="Rank" hi="रैंक" />} error={errors.rank}>
                    <input id="rq-rank" value={values.rank} onChange={(e) => set("rank", e.target.value)} placeholder={hi ? "जैसे Col, Cdr, Wg Cdr" : "e.g. Col, Cdr, Wg Cdr"} className={input(errors.rank)} />
                  </Field>
                  <Field id="name" label={<T en="Full name" hi="पूरा नाम" />} error={errors.name}>
                    <input id="rq-name" value={values.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} />
                  </Field>
                </div>
                <Field id="unit" label={<T en="Unit, squadron, ship or regiment (optional)" hi="यूनिट, स्क्वाड्रन, जहाज़ या रेजिमेंट (ज़रूरी नहीं)" />} error={errors.unit} className="mt-4">
                  <input id="rq-unit" value={values.unit} onChange={(e) => set("unit", e.target.value)} className={input(errors.unit)} />
                </Field>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field id="years" label={<T en="Years of service (optional)" hi="सेवा के साल (ज़रूरी नहीं)" />} error={errors.years}>
                    <input id="rq-years" value={values.years} onChange={(e) => set("years", e.target.value)} placeholder={hi ? "जैसे 1994–2026" : "e.g. 1994–2026"} className={input(errors.years)} />
                  </Field>
                  <Field id="neededBy" label={<T en="Needed by (optional)" hi="कब तक चाहिए (ज़रूरी नहीं)" />} error={errors.neededBy}>
                    <input id="rq-neededBy" type="date" value={values.neededBy} onChange={(e) => set("neededBy", e.target.value)} className={input(errors.neededBy)} />
                  </Field>
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step
                title={<T en="What should go inside?" hi="अंदर क्या रखना है?" />}
                hint={<T en="Tick what they have. We plan the layout around it." hi="जो उनके पास है, उस पर टिक करें। हम उसी के हिसाब से लेआउट बनाते हैं।" />}
              >
                <fieldset>
                  <legend className="sr-only">
                    <T en="Include in the frame" hi="फ़्रेम में शामिल करें" />
                  </legend>
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
                        <span className="text-[14px]">
                          <T en={f.label} hi={frameItemsHi[f.id]} />
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.items && (
                    <p role="alert" className="mt-2 text-[12.5px] text-error">
                      <T en={errors.items} hi={hiMessage(errors.items)} />
                    </p>
                  )}
                </fieldset>
                <Field id="notes" label={<T en="Anything else? (optional)" hi="कुछ और? (ज़रूरी नहीं)" />} error={errors.notes} className="mt-5" hint={`${values.notes.length}/600`}>
                  <textarea
                    id="rq-notes"
                    rows={4}
                    maxLength={600}
                    value={values.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder={hi ? "आपके मन का साइज़, रंग, कोई पंक्ति जो जोड़नी हो…" : "Size you have in mind, colours, a line you would like added…"}
                    className={clsx(input(errors.notes), "h-auto py-2.5")}
                  />
                </Field>
              </Step>
            )}

            {step === 3 && (
              <Step
                title={<T en="Where can we reach you?" hi="हम आपसे कहाँ संपर्क करें?" />}
                hint={<T en="We reply on WhatsApp with the layout and the final price." hi="हम WhatsApp पर लेआउट और आख़िरी कीमत के साथ जवाब देते हैं।" />}
              >
                <Field id="customerName" label={<T en="Your name" hi="आपका नाम" />} error={errors.customerName}>
                  <input id="rq-customerName" autoComplete="name" value={values.customerName} onChange={(e) => set("customerName", e.target.value)} className={input(errors.customerName)} />
                </Field>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field id="phone" label={<T en="WhatsApp number" hi="WhatsApp नंबर" />} error={errors.phone}>
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
                  <Field id="city" label={<T en="City (optional)" hi="शहर (ज़रूरी नहीं)" />} error={errors.city}>
                    <input id="rq-city" autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} className={input(errors.city)} />
                  </Field>
                </div>
                <Field
                  id="email"
                  label={<T en="Email (optional)" hi="ईमेल (ज़रूरी नहीं)" />}
                  error={errors.email}
                  className="mt-4"
                  hint={<T en="For a copy of your request" hi="आपके अनुरोध की कॉपी के लिए" />}
                >
                  <input id="rq-email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={input(errors.email)} />
                </Field>
                {isPreview && (
                  <p className="surface-amber mt-5 px-4 py-3 text-[12.5px]">
                    <T
                      en={`Preview: ${isLocalPreview ? "requests are saved on this computer only." : "requests sent here are tests and go nowhere."} WhatsApp opens a real chat with the studio.`}
                      hi={`प्रीव्यू: ${isLocalPreview ? "अनुरोध सिर्फ़ इसी कंप्यूटर पर सेव होते हैं।" : "यहाँ भेजे गए अनुरोध टेस्ट हैं और कहीं नहीं जाते।"} WhatsApp से स्टूडियो के साथ असली चैट खुलती है।`}
                    />
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
              <T en={message} hi={hiMessage(message)} />
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-outline btn-press px-5">
                <ArrowLeft size={16} aria-hidden="true" /> <T en="Back" hi="पीछे" />
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={busy} className="btn btn-dark btn-press px-6 disabled:opacity-70">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              {busy ? <T en="Sending…" hi="भेजा जा रहा है…" /> : last ? <T en="Send request" hi="अनुरोध भेजें" /> : <T en="Continue" hi="आगे बढ़ें" />}
              {!busy && !last && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
        </form>
      </div>

      <aside aria-label={hi ? "प्रीव्यू" : "Preview"} className="hidden md:block">
        <div className="sticky top-28">
          <div className="shadow-[0_30px_60px_-30px_rgb(90_62_43/0.9)]">{preview}</div>
          <p className="mt-3 text-[12px] text-muted">
            <T
              en="A sketch of the idea. We plan the real layout with you around their own medals and photograph."
              hi="यह सिर्फ़ एक झलक है। असली लेआउट हम आपके साथ, उनके अपने मेडल और तस्वीर के हिसाब से तय करते हैं।"
            />
          </p>
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

function Step({ title, hint, children }: { title: ReactNode; hint?: ReactNode; children: ReactNode }) {
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

function Field({ id, label, error, hint, className, children }: { id: string; label: ReactNode; error?: string; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`rq-${id}`} className="mb-1.5 block text-[12.5px] font-medium">
        {label}
      </label>
      {children}
      <p className={clsx("mt-1.5 min-h-[1em] text-[12px]", error ? "text-error" : "text-muted")} role={error ? "alert" : undefined}>
        {error ? <T en={error} hi={hiMessage(error)} /> : hint}
      </p>
    </div>
  );
}
