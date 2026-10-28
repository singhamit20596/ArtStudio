import path from "node:path";
import type { Order } from "@/lib/checkout";
import type { FrameRequest } from "@/lib/requests";
import { bucket } from "@/lib/storage";

/*
 * Orders, keyed by order number, in durable storage (src/lib/storage.ts):
 * Netlify Blobs on the live site, .data/store/orders/ on your computer.
 * Phase 4 may move them to a database; keep all access behind these functions.
 */

const orders = () => bucket("orders");

export async function saveOrder(order: Order) {
  await orders().setJSON(order.id, order);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!/^AS-\d{6}-[A-Z0-9]{4}$/.test(id)) return null;
  return orders().getJSON<Order>(id);
}

/** Loads an order only if the secret link token matches. */
export async function getOrderWithToken(id: string, token: string | null): Promise<Order | null> {
  const order = await getOrder(id);
  return order?.token && token && order.token === token ? order : null;
}

/** Tribute-frame requests from the parked request form. */
export async function saveRequest(request: FrameRequest) {
  await bucket("requests").setJSON(request.id, request);
}

/** Local folder for email previews when no email service is configured. */
export const EMAIL_PREVIEW_DIR = path.join(process.cwd(), ".data", "emails");
