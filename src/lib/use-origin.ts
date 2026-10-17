"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/config/site";
import { isPreview } from "./preview";

const noop = () => () => {};

/**
 * The site's address for links shared on WhatsApp: the configured domain, or wherever
 * the site is being served from. Empty in the design preview, whose address is not public.
 */
export function useOrigin() {
  return useSyncExternalStore(
    noop,
    () => site.url || (isPreview ? "" : window.location.origin),
    () => site.url,
  );
}
