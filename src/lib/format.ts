const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 1299 → "₹1,299", 125000 → "₹1,25,000" */
export function formatINR(amount: number) {
  return inr.format(amount);
}

export function formatDays(range: { min: number; max: number }) {
  return range.min === range.max ? `${range.min} days` : `${range.min}–${range.max} days`;
}

export function discountPercent(price: number, mrp: number | null) {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

const longDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** "2026-10-31" or a full ISO timestamp → "31 Oct 2026" (India time). */
export function formatDate(iso: string) {
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00+05:30` : iso);
  return Number.isNaN(d.getTime()) ? iso : longDate.format(d);
}
