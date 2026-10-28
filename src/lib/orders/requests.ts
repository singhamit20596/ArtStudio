import { site } from "@/config/site";
import { frameItems, services, type FrameItemId, type ServiceId } from "@/config/tribute";
import { formatDate } from "@/lib/format";
import { normaliseMobile } from "@/lib/india";
import { describeService, itemLabels, requestMessage, validateRequest, type FrameRequest, type FrameRequestInput, type RequestErrors } from "@/lib/requests";
import { whatsappLink } from "@/lib/whatsapp";
import { makeOrderId } from "./build";
import { esc, type Email } from "./emails";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

/** Turns untrusted JSON into a clean request input (strings trimmed and capped, ids checked). */
export function readRequestInput(raw: unknown): FrameRequestInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const service = services.some((s) => s.id === r.service) ? (r.service as ServiceId) : ("" as ServiceId);
  const items = Array.isArray(r.items) ? r.items.filter((i): i is FrameItemId => frameItems.some((f) => f.id === i)) : [];
  return {
    service,
    serviceOther: clip(r.serviceOther, 60),
    rank: clip(r.rank, 40),
    name: clip(r.name, 60),
    unit: clip(r.unit, 100),
    years: clip(r.years, 40),
    neededBy: clip(r.neededBy, 10),
    items: [...new Set(items)],
    notes: typeof r.notes === "string" ? r.notes.trim().slice(0, 800) : "",
    customerName: clip(r.customerName, 80),
    phone: clip(r.phone, 20),
    email: clip(r.email, 120).toLowerCase(),
    city: clip(r.city, 80),
    website: clip(r.website, 200),
  };
}

export type BuildRequestResult = { ok: true; request: FrameRequest } | { ok: false; status: number; message: string; errors?: RequestErrors };

export function buildRequest(input: FrameRequestInput, now: number): BuildRequestResult {
  const errors = validateRequest(input);
  if (Object.keys(errors).length > 0) return { ok: false, status: 400, message: "Please check the highlighted fields.", errors };
  return {
    ok: true,
    request: {
      id: makeOrderId(now, "TR"),
      createdAt: new Date(now).toISOString(),
      service: describeService(input),
      officer: { rank: input.rank, name: input.name, unit: input.unit || null, years: input.years || null },
      neededBy: input.neededBy || null,
      items: input.items,
      notes: input.notes || null,
      customer: { name: input.customerName, phone: normaliseMobile(input.phone)!, email: input.email || null, city: input.city || null },
    },
  };
}

function rows(r: FrameRequest) {
  const o = r.officer;
  return [
    ["Service", r.service],
    ["Name plate", `${o.rank} ${o.name}`],
    ["Unit", o.unit],
    ["Years of service", o.years],
    ["To include", itemLabels(r.items).join(", ")],
    ["Needed by", r.neededBy ? formatDate(r.neededBy) : null],
    ["Notes", r.notes],
  ].filter((row): row is [string, string] => Boolean(row[1]));
}

function render(r: FrameRequest, forOwner: boolean) {
  const table = rows(r)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-size:13px;color:#76655a;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;font-size:14px">${esc(v)}</td></tr>`,
    )
    .join("");
  const c = r.customer;
  const contact = forOwner
    ? `<p style="margin:20px 0 4px;font-size:12px;letter-spacing:2px;font-weight:600">FROM</p>
       <p style="margin:0;font-size:14px;line-height:1.6">${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ""}<br>
       <a href="tel:+91${c.phone}" style="color:#33241a">+91 ${c.phone}</a> · <a href="https://wa.me/91${c.phone}" style="color:#33241a">WhatsApp</a>
       ${c.email ? `<br>${esc(c.email)}` : ""}</p>`
    : `<p style="margin:24px 0 0;font-size:14px;line-height:1.6">Next, <a href="${whatsappLink(requestMessage(r))}" style="color:#33241a;font-weight:600">send the request to us on WhatsApp</a>
       with photos of the medals, badges and the photograph. We reply there with the layout and the final price.</p>`;

  return `<!doctype html><html><body style="margin:0;background:#87a96b;font-family:Poppins,Helvetica,Arial,sans-serif;color:#1e140d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#87a96b;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#d5851f;padding:32px 28px"><tr><td>
  <p style="margin:0;font-size:13px;letter-spacing:4px;font-weight:600;color:#5a3e2b">ART STUDIO</p>
  <p style="margin:2px 0 24px;font-size:10px;letter-spacing:3px;color:#2e2016">ART WITH SOUL</p>
  <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3">${forOwner ? `New frame request ${r.id}` : "We have your request"}</h1>
  <p style="margin:0 0 18px;font-size:13px;color:#2e2016">Request <strong>${r.id}</strong> · Retirement tribute frame</p>
  <table role="presentation" cellpadding="0" cellspacing="0">${table}</table>
  ${contact}
  ${forOwner ? "" : `<p style="margin:24px 0 0;font-size:13px">Questions? WhatsApp ${site.contact.whatsappDisplay} with your request number.</p>`}
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#1e140d">${site.name} · ${site.tagline} · Handmade in India</p>
</td></tr></table></body></html>`;
}

const plain = (r: FrameRequest) => [`Request ${r.id}`, ...rows(r).map(([k, v]) => `${k}: ${v}`), `From: ${r.customer.name}, +91 ${r.customer.phone}`].join("\n");

export function requestEmails(r: FrameRequest): Email[] {
  const emails: Email[] = [
    {
      to: site.contact.email,
      subject: `New frame request ${r.id} · ${r.officer.rank} ${r.officer.name} · ${r.service}`,
      html: render(r, true),
      text: plain(r),
      replyTo: r.customer.email ?? undefined,
    },
  ];
  if (r.customer.email) {
    emails.push({ to: r.customer.email, subject: `Your ${site.name} frame request ${r.id}`, html: render(r, false), text: plain(r), replyTo: site.contact.email });
  }
  return emails;
}
