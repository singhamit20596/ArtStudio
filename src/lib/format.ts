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
