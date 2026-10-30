/* Hindi versions of the formatters in src/lib/format.ts and src/lib/delivery.ts. Digits and ₹ stay as they are. */

/** { min: 5, max: 7 } → "5–7 दिन" */
export function formatDaysHi(range: { min: number; max: number }) {
  return range.min === range.max ? `${range.min} दिन` : `${range.min}–${range.max} दिन`;
}

const dayMonth = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata", numberingSystem: "latn" });

/** "24 अक्तूबर – 31 अक्तूबर" */
export function formatDateRangeHi(from: Date, to: Date) {
  return `${dayMonth.format(from)} – ${dayMonth.format(to)}`;
}

const longDate = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata", numberingSystem: "latn" });

/** "2026-10-31" or an ISO timestamp → "31 अक्तूबर 2026" (India time). */
export function formatDateHi(iso: string) {
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00+05:30` : iso);
  return Number.isNaN(d.getTime()) ? iso : longDate.format(d);
}
