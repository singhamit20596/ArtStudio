"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { checkPincode, formatDateRange, type PincodeResult } from "@/lib/delivery";
import type { DayRange } from "@/lib/types";
import { messages, whatsappLink } from "@/lib/whatsapp";

/** Pincode checker: is it delivered there, and roughly when (making time + courier days). */
export function DeliveryCheck({ making }: { making: DayRange }) {
  const [result, setResult] = useState<{ pincode: string; check: PincodeResult } | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pincode = String(new FormData(e.currentTarget).get("pincode") ?? "").replace(/\s/g, "");
    // event.timeStamp is measured from page load, so add the page's start time to get "now".
    setResult({ pincode, check: checkPincode(pincode, making, performance.timeOrigin + e.timeStamp) });
  };

  return (
    <div className="border border-line p-4">
      <form onSubmit={submit} className="flex items-center gap-2">
        <MapPin size={18} strokeWidth={1.6} aria-hidden="true" className="shrink-0 text-gold-ink" />
        <label htmlFor="pincode" className="sr-only">
          Delivery pincode
        </label>
        <input
          id="pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter pincode for delivery date"
          className="h-10 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted"
        />
        <button type="submit" className="h-10 shrink-0 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:underline">
          Check
        </button>
      </form>
      <div aria-live="polite">
        {result && (
          <p className="mt-2 border-t border-line pt-3 text-[13px] leading-relaxed">
            {result.check.status === "ok" && (
              <>
                Delivers to <strong className="font-medium">{result.pincode}</strong>. Estimated arrival{" "}
                <strong className="font-medium">{formatDateRange(result.check.from, result.check.to)}</strong>, including making time.
              </>
            )}
            {result.check.status === "invalid" && <>Please enter a valid 6-digit pincode.</>}
            {result.check.status === "ask" && (
              <>
                For Army Post Office pincodes, please{" "}
                <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  message us on WhatsApp
                </a>{" "}
                to arrange delivery.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
