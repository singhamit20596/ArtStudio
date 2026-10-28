import { backgrounds, templates } from "@/config/tribute";

/*
 * Personalising a tribute after checkout: the shared rules for the /personalise form
 * (browser, instant feedback) and POST /api/personalise/[id] (server, the real check).
 */

export interface PersonaliseInput {
  /** Index of the order item being personalised. */
  item: number;
  template: string;
  rank: string;
  name: string;
  unit: string;
  years: string;
  background: string;
  neededBy: string;
  notes: string;
  /** Storage keys returned by the upload route. */
  files: string[];
}

export type PersonaliseField = Exclude<keyof PersonaliseInput, "item">;
export type PersonaliseErrors = Partial<Record<PersonaliseField, string>>;

export const PERSONALISE_STEPS = [
  { title: "Design", fields: ["template"] },
  { title: "Name plate", fields: ["rank", "name", "unit", "years"] },
  { title: "Photos", fields: ["files"] },
  { title: "Colour", fields: ["background"] },
  { title: "Anything else", fields: ["neededBy", "notes"] },
] as const satisfies readonly { title: string; fields: readonly PersonaliseField[] }[];

export const MAX_FILES = 12;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const t = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function emptyPersonalise(item: number, slug: string): PersonaliseInput {
  return { item, template: templates[slug]?.[0]?.id ?? "", rank: "", name: "", unit: "", years: "", background: backgrounds[0].id, neededBy: "", notes: "", files: [] };
}

/** All errors, or only those for one step. `slug` picks the product's templates. */
export function validatePersonalise(input: PersonaliseInput, slug: string, step?: number): PersonaliseErrors {
  const e: PersonaliseErrors = {};
  const options = templates[slug] ?? [];
  if (options.length && !options.some((o) => o.id === input.template)) e.template = "Please choose a design.";
  if (t(input.rank).length < 1) e.rank = "Please enter the rank.";
  if (t(input.name).length < 2) e.name = "Please enter the name as it should appear.";
  if (t(input.unit).length > 80) e.unit = "Please keep this under 80 characters.";
  if (t(input.years).length > 30) e.years = "Please keep this short, e.g. 1994–2026.";
  if (!Array.isArray(input.files) || input.files.length === 0) e.files = "Please add at least one photo.";
  else if (input.files.length > MAX_FILES) e.files = `Please add up to ${MAX_FILES} photos.`;
  if (!backgrounds.some((b) => b.id === input.background)) e.background = "Please choose a background colour.";
  if (t(input.neededBy) && !DATE.test(t(input.neededBy))) e.neededBy = "Please choose a date.";
  if (t(input.notes).length > 1000) e.notes = "Please keep this under 1,000 characters.";

  if (step == null) return e;
  const fields: readonly PersonaliseField[] = PERSONALISE_STEPS[step].fields;
  return Object.fromEntries(Object.entries(e).filter(([k]) => fields.includes(k as PersonaliseField)));
}

/** Link to an uploaded photo, readable only with the order's secret token. */
export const fileUrl = (key: string, token: string) => `/api/files/${key.split("/").map(encodeURIComponent).join("/")}?t=${encodeURIComponent(token)}`;
