"use client";

import { useSyncExternalStore } from "react";
import { createLocalStore, pushRecent } from "./local-store";

const NONE: string[] = [];
const store = createLocalStore<string[]>("artstudio.recentSearches", NONE);

/** The visitor's last few searches, newest first (this browser only). */
export function useRecentSearches() {
  return useSyncExternalStore(store.subscribe, store.get, store.server);
}

export function rememberSearch(query: string) {
  const q = query.trim();
  if (q) store.set(pushRecent(store.get(), q, 6));
}

export function clearRecentSearches() {
  store.set(NONE);
}
