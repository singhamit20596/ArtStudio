"use client";

import clsx from "clsx";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { backgrounds, templates } from "@/config/tribute";
import type { Personalisation } from "@/lib/checkout";
import { emptyPersonalise, MAX_FILES, PERSONALISE_STEPS, validatePersonalise, type PersonaliseErrors, type PersonaliseInput } from "@/lib/personalise";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { TemplateThumb, TributeArt } from "./TributeArt";

interface OrderItemView {
  index: number;
  slug: string;
  name: string;
  variant: string | null;
  image: string | null;
  personalisation: Personalisation | null;
  fileUrls: Record<string, string>;
}
interface OrderView {
  id: string;
  customerName: string;
  status: string;
  items: OrderItemView[];
}
type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; order: OrderView };
type Upload = { id: string; preview: string; key?: string; url?: string; error?: string };

/** Shrinks a photo to at most 2000 px (JPEG) before upload; leaves it alone if the browser can't read it (e.g. HEIC). */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    return blob ?? file;
  } catch {
    return file;
  }
}

/** /personalise/[id]?t=…: the customer adds design, name plate, photos, colour and notes for each piece. */
export function PersonaliseFlow() {
  const { id } = useParams<{ id: string }>();
  const token = useSearchParams().get("t") ?? "";
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/personalise/${encodeURIComponent(id)}?t=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (!data.ok) setLoad({ state: "error", message: data.message ?? "We couldn't open this link." });
        else setLoad({ state: "ready", order: data.order });
      })
      .catch(() => alive && setLoad({ state: "error", message: "We couldn't load your order. Please check your connection and try again." }));
    return () => {
      alive = false;
    };
  }, [id, token]);

  if (load.state === "loading")
    return (
      <p className="flex items-center gap-3 py-24" role="status">
        <Loader2 className="animate-spin" size={18} aria-hidden="true" /> Opening your order…
      </p>
    );
  if (load.state === "error")
    return (
      <div className="py-16">
        <p className="text-[18px] font-medium">{load.message}</p>
        <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-6">
          <WhatsAppIcon size={17} /> Message us
        </a>
      </div>
    );

  const { order } = load;
  if (order.items.length === 0) return <p className="py-16 text-[16px]">Nothing in order {order.id} needs personalising.</p>;
  const current = order.items.find((i) => i.index === active) ?? (order.items.length === 1 ? order.items[0] : null);

  const markDone = (index: number, p: Personalisation, fileUrls: Record<string, string>) =>
    setLoad({ state: "ready", order: { ...order, items: order.items.map((i) => (i.index === index ? { ...i, personalisation: p, fileUrls } : i)) } });

  return (
    <div>
      <p className="eyebrow">Order {order.id}</p>
      <h1 className="mt-3 text-[30px] font-semibold leading-tight md:text-[42px]">
        {current ? "Personalise your tribute" : `Thank you, ${order.customerName}. Let's make it theirs`}
      </h1>

      {!current ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {order.items.map((i) => (
            <li key={i.index}>
              <button type="button" onClick={() => setActive(i.index)} className="btn-press flex w-full items-center gap-4 border border-line p-4 text-left transition-colors hover:border-ink">
                <span className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden bg-brown">
                  <TributeArt kind={i.slug} className="h-full w-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{i.name.split(" | ")[0]}</span>
                  <span className="block text-[12.5px] text-muted">{i.variant}</span>
                </span>
                {i.personalisation ? (
                  <span className="flex items-center gap-1 text-[12px] font-semibold">
                    <Check size={15} aria-hidden="true" /> Done
                  </span>
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ItemFlow
          key={current.index}
          orderId={order.id}
          token={token}
          item={current}
          onBack={order.items.length > 1 ? () => setActive(null) : undefined}
          onSaved={(p, urls) => markDone(current.index, p, urls)}
        />
      )}
    </div>
  );
}

function ItemFlow({
  orderId,
  token,
  item,
  onBack,
  onSaved,
}: {
  orderId: string;
  token: string;
  item: OrderItemView;
  onBack?: () => void;
  onSaved: (p: Personalisation, fileUrls: Record<string, string>) => void;
}) {
  const p = item.personalisation;
  const [values, setValues] = useState<PersonaliseInput>(() =>
    p
      ? { item: item.index, template: p.template, rank: p.rank, name: p.name, unit: p.unit ?? "", years: p.years ?? "", background: p.background, neededBy: p.neededBy ?? "", notes: p.notes ?? "", files: p.files }
      : emptyPersonalise(item.index, item.slug),
  );
  const [uploads, setUploads] = useState<Upload[]>(() => (p?.files ?? []).map((k) => ({ id: k, preview: item.fileUrls[k], key: k, url: item.fileUrls[k] })));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<PersonaliseErrors>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(Boolean(p));
  const stepRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    stepRef.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [step, done]);

  const set = <K extends keyof PersonaliseInput>(key: K, value: PersonaliseInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key as keyof PersonaliseErrors];
      return next;
    });
  };

  const keys = uploads.filter((u) => u.key).map((u) => u.key!);
  const uploading = uploads.some((u) => !u.key && !u.error);
  const bg = backgrounds.find((b) => b.id === values.background)?.swatch;
  const options = templates[item.slug] ?? [];
  const last = step === PERSONALISE_STEPS.length - 1;

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_FILES - uploads.length;
    for (const file of Array.from(files).slice(0, room)) {
      const uid = `${file.name}-${file.size}-${file.lastModified}`;
      const preview = URL.createObjectURL(file);
      setUploads((u) => [...u, { id: uid, preview }]);
      try {
        const blob = await shrink(file);
        const form = new FormData();
        form.append("file", blob, file.name.replace(/\.\w+$/, "") + (blob.type === "image/jpeg" ? ".jpg" : ""));
        const res = await fetch(`/api/personalise/${encodeURIComponent(orderId)}/files?t=${encodeURIComponent(token)}&item=${item.index}`, { method: "POST", body: form });
        const data = await res.json();
        setUploads((u) => u.map((x) => (x.id === uid ? (data.ok ? { ...x, key: data.key, url: data.url } : { ...x, error: data.message }) : x)));
        if (data.ok) setErrors((e) => ({ ...e, files: undefined }));
      } catch {
        setUploads((u) => u.map((x) => (x.id === uid ? { ...x, error: "Upload failed. Please try again." } : x)));
      }
    }
  };
  const removeUpload = (uid: string) => setUploads((u) => u.filter((x) => x.id !== uid));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const input = { ...values, files: keys };
    const found = validatePersonalise(input, item.slug, step);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (!last) {
      setStep((s) => s + 1);
      return;
    }
    if (uploading) {
      setMessage("Please wait for the photos to finish uploading.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/personalise/${encodeURIComponent(orderId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, ...input }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "We couldn't save your details. Please try again.");
        const bad = PERSONALISE_STEPS.findIndex((s) => s.fields.some((f) => data.errors?.[f]));
        if (bad >= 0) setStep(bad);
      } else {
        onSaved(data.personalisation, Object.fromEntries(uploads.filter((u) => u.key).map((u) => [u.key!, u.url!])));
        setDone(true);
      }
    } catch {
      setMessage("We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const preview = <TributeArt kind={item.slug} rank={values.rank} name={values.name} background={bg} className="block h-auto w-full" />;

  if (done) {
    return (
      <div ref={stepRef} className="pop-in mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <div>
          <CheckCircle2 size={40} strokeWidth={1.4} className="text-brown" aria-hidden="true" />
          <h2 tabIndex={-1} className="mt-4 text-[26px] font-semibold outline-none md:text-[32px]">
            Thank you. We have everything we need
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            We will look through your photos and message you on WhatsApp if anything is unclear. You can change the details from this link until we start making it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => (setDone(false), setStep(0))} className="btn btn-outline btn-press">
              Change details
            </button>
            {onBack && (
              <button type="button" onClick={onBack} className="btn btn-dark btn-press">
                Personalise the next piece
              </button>
            )}
            <a href={whatsappLink(`Hi! A question about my order ${orderId}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-press">
              <WhatsAppIcon size={17} /> Questions?
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md shadow-[0_30px_60px_-30px_rgb(90_62_43/0.9)]">{preview}</div>
      </div>
    );
  }

  const pct = ((step + 1) / PERSONALISE_STEPS.length) * 100;
  const input = (error?: string) =>
    clsx("h-12 w-full border bg-transparent px-3 text-[14px] outline-none transition-colors placeholder:text-muted focus:border-ink", error ? "border-error" : "border-line");

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-14">
      <div className="min-w-0">
        <p className="text-[14px] text-muted">
          {item.name.split(" | ")[0]} · {item.variant}
          {onBack && (
            <button type="button" onClick={onBack} className="ml-3 underline underline-offset-4">
              Other pieces
            </button>
          )}
        </p>
        <ol className="mt-6 grid grid-cols-5 gap-2" aria-label="Steps">
          {PERSONALISE_STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === step ? "step" : undefined}
                className={clsx("w-full text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] disabled:cursor-default", i <= step ? "opacity-100" : "opacity-50")}
              >
                <span className="block tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="hidden truncate sm:block">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] sm:hidden" aria-hidden="true">
          Step {step + 1} of {PERSONALISE_STEPS.length} · {PERSONALISE_STEPS[step].title}
        </p>
        <div className="mt-3 h-1 bg-brown/20" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={PERSONALISE_STEPS.length} aria-valuenow={step + 1}>
          <div className="h-full bg-brown transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>

        <div className="mx-auto mt-8 max-w-sm md:hidden">{preview}</div>

        <form onSubmit={submit} noValidate className="mt-8">
          <div ref={stepRef} key={step} className="step-in">
            {step === 0 && (
              <Step title="Choose a design" hint="You can tell us about changes in the last step.">
                <div className="grid gap-3 sm:grid-cols-3">
                  {options.map((o, i) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={values.template === o.id}
                      onClick={() => set("template", o.id)}
                      className={clsx("drop-in btn-press border p-3 text-left transition-colors", values.template === o.id ? "border-brown ring-1 ring-brown" : "border-line hover:border-ink")}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span className="relative block aspect-square w-full overflow-hidden">
                        {o.image ? (
                          <Image src={o.image} alt="" fill sizes="(min-width: 640px) 240px, 90vw" className="object-cover" />
                        ) : (
                          <TemplateThumb id={o.id} className="absolute inset-0 h-full w-full" />
                        )}
                      </span>
                      <span className="mt-3 block text-[14px] font-semibold">{o.name}</span>
                      <span className="mt-1 block text-[12.5px] leading-snug text-muted">{o.text}</span>
                    </button>
                  ))}
                </div>
                <Err text={errors.template} />
              </Step>
            )}

            {step === 1 && (
              <Step title="What goes on the name plate?">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <Field label="Rank" error={errors.rank}>
                    <input value={values.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. Col, Cdr, Wg Cdr" className={input(errors.rank)} />
                  </Field>
                  <Field label="Full name" error={errors.name}>
                    <input value={values.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} />
                  </Field>
                </div>
                <Field label="Unit, squadron, ship or regiment (optional)" error={errors.unit} className="mt-4">
                  <input value={values.unit} onChange={(e) => set("unit", e.target.value)} className={input(errors.unit)} />
                </Field>
                <Field label="Years of service (optional)" error={errors.years} className="mt-4">
                  <input value={values.years} onChange={(e) => set("years", e.target.value)} placeholder="e.g. 1994–2026" className={input(errors.years)} />
                </Field>
              </Step>
            )}

            {step === 2 && (
              <Step title="Upload photos" hint={`The officer's portrait, the medals and badges, and anything else to include. Up to ${MAX_FILES} photos.`}>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-brown/50 px-6 py-10 text-center transition-colors hover:border-brown">
                  <ImagePlus size={28} strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-[15px] font-semibold">Choose photos</span>
                  <span className="text-[12.5px] text-muted">JPG, PNG or HEIC. Large photos are resized for you.</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => (addFiles(e.target.files), (e.target.value = ""))} disabled={uploads.length >= MAX_FILES} />
                </label>
                {uploads.length > 0 && (
                  <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {uploads.map((u, i) => (
                      <li key={u.id} className="drop-in relative aspect-square overflow-hidden bg-brown" style={{ "--i": i } as React.CSSProperties}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- local previews and private photo links */}
                        <img src={u.preview} alt={`Photo ${i + 1}`} className={clsx("h-full w-full object-cover", !u.key && "opacity-60")} />
                        {!u.key && !u.error && <Loader2 className="absolute inset-0 m-auto animate-spin text-white" size={22} aria-label="Uploading" />}
                        {u.error && <span className="absolute inset-x-0 bottom-0 bg-brown px-1.5 py-1 text-[10.5px] text-white">{u.error}</span>}
                        <button type="button" onClick={() => removeUpload(u.id)} aria-label={`Remove photo ${i + 1}`} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-amber text-[#1e140d]">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <Err text={errors.files} />
              </Step>
            )}

            {step === 3 && (
              <Step title="Choose the background colour" hint="Watch the preview change.">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {backgrounds.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={values.background === b.id}
                      onClick={() => set("background", b.id)}
                      className={clsx("drop-in btn-press flex items-center gap-3 border p-3 text-left transition-colors", values.background === b.id ? "border-brown ring-1 ring-brown" : "border-line hover:border-ink")}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span className="h-9 w-9 shrink-0 border border-brown/40" style={{ background: b.swatch }} aria-hidden="true" />
                      <span className="text-[14px] font-medium">{b.label}</span>
                    </button>
                  ))}
                </div>
                <Err text={errors.background} />
              </Step>
            )}

            {step === 4 && (
              <Step title="Anything else?" hint="Wording, colours, a date to meet, anything you'd like us to know.">
                <Field label="Needed by (optional)" error={errors.neededBy}>
                  <input type="date" value={values.neededBy} onChange={(e) => set("neededBy", e.target.value)} className={input(errors.neededBy)} />
                </Field>
                <Field label="Describe what you'd like (optional)" error={errors.notes} className="mt-4">
                  <textarea
                    rows={5}
                    maxLength={1000}
                    value={values.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="e.g. Add 'With gratitude, 17 Squadron' under the name, and keep the medals in the order of the photo."
                    className={clsx(input(errors.notes), "h-auto py-2.5")}
                  />
                </Field>
              </Step>
            )}
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
              {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              {busy ? "Saving…" : last ? "Send details" : "Continue"}
              {!busy && !last && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
        </form>
      </div>

      <aside aria-label="Preview" className="hidden md:block">
        <div className="sticky top-28">
          <div className="shadow-[0_30px_60px_-30px_rgb(90_62_43/0.9)]">{preview}</div>
          <p className="mt-3 text-[12px] text-muted">A sketch of the idea. The finished piece is made from your photos.</p>
        </div>
      </aside>
    </div>
  );
}

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

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 block text-[12.5px] font-medium">{label}</span>
      {children}
      <Err text={error} />
    </label>
  );
}

function Err({ text }: { text?: string }) {
  return text ? (
    <span role="alert" className="mt-1.5 block text-[12px] text-error">
      {text}
    </span>
  ) : null;
}
