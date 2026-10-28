import { frameItems, serviceLabel, services, type FrameItemId, type ServiceId } from "@/config/tribute";
import { formatDate } from "./format";
import { normaliseMobile } from "./india";

/*
 * Tribute-frame requests: what the form sends to POST /api/requests, the shared validation
 * (browser for instant feedback, server for the real check) and the WhatsApp hand-off text.
 */

export interface FrameRequestInput {
  service: ServiceId;
  serviceOther: string;
  rank: string;
  name: string;
  unit: string;
  years: string;
  neededBy: string;
  items: FrameItemId[];
  notes: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  /** Honeypot: real visitors never fill this hidden field. */
  website?: string;
}

export type RequestField = Exclude<keyof FrameRequestInput, "website">;
export type RequestErrors = Partial<Record<RequestField, string>>;

export const REQUEST_STEPS = [
  { title: "Service", fields: ["service", "serviceOther"] },
  { title: "The officer", fields: ["rank", "name", "unit", "years", "neededBy"] },
  { title: "The frame", fields: ["items", "notes"] },
  { title: "Your details", fields: ["customerName", "phone", "email", "city"] },
] as const satisfies readonly { title: string; fields: readonly RequestField[] }[];

export const emptyRequest: FrameRequestInput = {
  service: "army",
  serviceOther: "",
  rank: "",
  name: "",
  unit: "",
  years: "",
  neededBy: "",
  items: ["medals", "badges", "insignia", "crests", "photo", "plate"],
  notes: "",
  customerName: "",
  phone: "",
  email: "",
  city: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const t = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** All errors, or only those for one step of the form. */
export function validateRequest(input: FrameRequestInput, step?: number): RequestErrors {
  const e: RequestErrors = {};
  if (!services.some((s) => s.id === input.service)) e.service = "Please choose the service.";
  if (input.service === "other" && t(input.serviceOther).length < 2) e.serviceOther = "Please tell us which service.";
  if (t(input.rank).length < 1) e.rank = "Please enter the rank.";
  if (t(input.name).length < 2) e.name = "Please enter the name as it should appear.";
  if (t(input.unit).length > 80) e.unit = "Please keep this under 80 characters.";
  if (t(input.years).length > 30) e.years = "Please keep this short, e.g. 1994–2026.";
  if (t(input.neededBy) && !DATE.test(t(input.neededBy))) e.neededBy = "Please choose a date.";
  if (!Array.isArray(input.items) || input.items.length === 0) e.items = "Please choose at least one thing to include.";
  if (t(input.notes).length > 600) e.notes = "Please keep notes under 600 characters.";
  if (t(input.customerName).length < 2) e.customerName = "Please enter your name.";
  if (!normaliseMobile(t(input.phone))) e.phone = "Please enter a 10-digit mobile number.";
  if (t(input.email) && !EMAIL.test(t(input.email))) e.email = "Please check your email address.";
  if (t(input.city).length > 60) e.city = "Please keep this under 60 characters.";

  if (step == null) return e;
  const fields: readonly RequestField[] = REQUEST_STEPS[step].fields;
  return Object.fromEntries(Object.entries(e).filter(([k]) => fields.includes(k as RequestField)));
}

export interface FrameRequest {
  id: string;
  createdAt: string;
  service: string;
  officer: { rank: string; name: string; unit: string | null; years: string | null };
  neededBy: string | null;
  items: string[];
  notes: string | null;
  customer: { name: string; phone: string; email: string | null; city: string | null };
  emailsSent?: boolean;
}

export const itemLabels = (ids: readonly string[]) => frameItems.filter((f) => ids.includes(f.id)).map((f) => f.label.toLowerCase());

export function describeService(input: Pick<FrameRequestInput, "service" | "serviceOther">) {
  return input.service === "other" ? t(input.serviceOther) : serviceLabel(input.service);
}

/** The message the customer sends on WhatsApp after submitting. */
export function requestMessage(r: FrameRequest) {
  const o = r.officer;
  return [
    `Hi! I'd like a retirement tribute frame (request ${r.id}).`,
    `Service: ${r.service}`,
    `Name plate: ${o.rank} ${o.name}`,
    o.unit ? `Unit: ${o.unit}` : null,
    o.years ? `Years of service: ${o.years}` : null,
    `To include: ${itemLabels(r.items).join(", ")}`,
    r.neededBy ? `Needed by: ${formatDate(r.neededBy)}` : null,
    r.notes ? `Notes: ${r.notes}` : null,
    `From: ${r.customer.name}${r.customer.city ? `, ${r.customer.city}` : ""}`,
    "I'll share photos of the medals, badges and the photograph here.",
  ]
    .filter(Boolean)
    .join("\n");
}
