import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "@/lib/checkout";
import type { FrameRequest } from "@/lib/requests";

/*
 * Where orders are kept until the Supabase database arrives in Phase 4.
 *
 * - On your computer (`npm run dev` / `npm run preview`): appended to .data/orders.jsonl,
 *   one JSON order per line, newest version last.
 * - In production: written to the server log only. The order emails are the record,
 *   which is why /api/orders refuses Cash on Delivery orders in production unless email is set up.
 */
const LOCAL = process.env.NODE_ENV !== "production";
const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "orders.jsonl");

export const hasOrderStore = LOCAL;

export async function saveOrder(order: Order) {
  if (!LOCAL) {
    console.info("[order]", JSON.stringify(order));
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.appendFile(FILE, `${JSON.stringify(order)}\n`, "utf8");
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!LOCAL) return null;
  try {
    const lines = (await fs.readFile(FILE, "utf8")).trim().split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      const order = JSON.parse(lines[i]) as Order;
      if (order.id === id) return order;
    }
  } catch {
    /* no orders yet */
  }
  return null;
}

/** Tribute-frame requests, kept the same way as orders. */
export async function saveRequest(request: FrameRequest) {
  if (!LOCAL) {
    console.info("[request]", JSON.stringify(request));
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.appendFile(path.join(DIR, "requests.jsonl"), `${JSON.stringify(request)}\n`, "utf8");
}

/** Local folder for email previews when no email service is configured. */
export const EMAIL_PREVIEW_DIR = path.join(DIR, "emails");
