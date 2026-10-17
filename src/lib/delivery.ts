import { site } from "@/config/site";
import type { DayRange } from "./types";

export type PincodeResult =
  | { status: "ok"; from: Date; to: Date }
  | { status: "invalid" }
  /** Army Post Office pincodes (starting with 9) need a word with the studio first. */
  | { status: "ask" };

const DAY = 24 * 60 * 60 * 1000;

/**
 * Pan-India delivery estimate: making time plus courier days, counted from `now`.
 * Courier days are a placeholder in site.ts until the courier partner is confirmed.
 */
export function checkPincode(pincode: string, making: DayRange, now: number): PincodeResult {
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return { status: "invalid" };
  if (pincode.startsWith("9")) return { status: "ask" };
  const { courierDays } = site.shipping;
  return {
    status: "ok",
    from: new Date(now + (making.min + courierDays.min) * DAY),
    to: new Date(now + (making.max + courierDays.max) * DAY),
  };
}

const dayMonth = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/** "24 Oct – 31 Oct" */
export function formatDateRange(from: Date, to: Date) {
  return `${dayMonth.format(from)} – ${dayMonth.format(to)}`;
}
