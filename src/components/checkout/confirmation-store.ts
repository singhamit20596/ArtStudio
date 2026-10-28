"use client";

import type { Order } from "@/lib/checkout";

/*
 * The confirmation page reads the order the checkout just placed from this tab's
 * sessionStorage. Phase 4 adds a server lookup ("Track order") from the database.
 */
const key = (id: string) => `artstudio.order.${id}`;
const CHANGE = "artstudio:confirmation";

/** For useSyncExternalStore: re-read when the stored confirmation changes (e.g. after a UPI payment). */
export function subscribeConfirmation(listener: () => void) {
  window.addEventListener(CHANGE, listener);
  return () => window.removeEventListener(CHANGE, listener);
}

export interface Confirmation {
  order: Order;
  whatsappUrl?: string;
  /** Where the customer adds the name, rank, photos and colours. */
  personaliseUrl?: string;
}

export function saveConfirmation(order: Order, whatsappUrl?: string, personaliseUrl?: string) {
  try {
    sessionStorage.setItem(key(order.id), JSON.stringify({ order, whatsappUrl, personaliseUrl } satisfies Confirmation));
    window.dispatchEvent(new Event(CHANGE));
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
