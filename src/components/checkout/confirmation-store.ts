"use client";

import type { Order } from "@/lib/checkout";

/*
 * The confirmation page reads the order the checkout just placed from this tab's
 * sessionStorage. Phase 4 adds a server lookup ("Track order") from the database.
 */
const key = (id: string) => `artstudio.order.${id}`;

export interface Confirmation {
  order: Order;
  whatsappUrl?: string;
}

export function saveConfirmation(order: Order, whatsappUrl?: string) {
  try {
    sessionStorage.setItem(key(order.id), JSON.stringify({ order, whatsappUrl } satisfies Confirmation));
  } catch {
    /* storage blocked: the page falls back to the order number alone */
  }
}

export function readConfirmationRaw(id: string): string | null {
  try {
    return sessionStorage.getItem(key(id));
  } catch {
    return null;
  }
}
