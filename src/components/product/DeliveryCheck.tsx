"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { checkPincode, formatDateRange, type PincodeResult } from "@/lib/delivery";
import type { DayRange } from "@/lib/types";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { formatDateRangeHi } from "@/i18n/format";
import { T } from "@/i18n/T";
import { useLang } from "@/i18n/use-lang";

/** Pincode checker: is it delivered there, and roughly when (making time + courier days). */
export function DeliveryCheck({ making }: { making: DayRange }) {
  const [result, setResult] = useState<{ pincode: string; check: PincodeResult } | null>(null);
  const hi = useLang() === "hi";

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pincode = String(new FormData(e.currentTarget).get("pincode") ?? "").replace(/\s/g, "");
    // event.timeStamp is measured from page load, so add the page's start time to get "now".
    setResult({ pincode, check: checkPincode(pincode, making, performance.timeOrigin + e.timeStamp) });
  };

  return (
    <div className="border border-line p-4">
      <form onSubmit={submit} className="flex items-center gap-2">
        <MapPin size={18} strokeWidth={1.6} aria-hidden="true" className="shrink-0 text-brown" />
        <label htmlFor="pincode" className="sr-only">
          <T en="Delivery pincode" hi="डिलीवरी पिनकोड" />
        </label>
        <input
          id="pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder={hi ? "डिलीवरी की तारीख़ के लिए पिनकोड डालें" : "Enter pincode for delivery date"}
          className="h-10 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted"
        />
        <button type="submit" className="h-10 shrink-0 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:underline">
          <T en="Check" hi="देखें" />
        </button>
      </form>
      <div aria-live="polite">
        {result && (
          <p className="mt-2 border-t border-line pt-3 text-[13px] leading-relaxed">
            {result.check.status === "ok" && (
              <T
                en={
                  <>
                    Delivers to <strong className="font-medium">{result.pincode}</strong>. Estimated arrival{" "}
                    <strong className="font-medium">{formatDateRange(result.check.from, result.check.to)}</strong>, including making time.
                  </>
                }
                hi={
                  <>
                    <strong className="font-medium">{result.pincode}</strong> पर डिलीवरी होती है। बनने के समय को मिलाकर, अनुमानित पहुँच{" "}
                    <strong className="font-medium">{formatDateRangeHi(result.check.from, result.check.to)}</strong>।
                  </>
                }
              />
            )}
            {result.check.status === "invalid" && <T en="Please enter a valid 6-digit pincode." hi="कृपया सही 6 अंकों का पिनकोड डालें।" />}
            {result.check.status === "ask" && (
              <T
                en={
                  <>
                    For Army Post Office pincodes, please{" "}
                    <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      message us on WhatsApp
                    </a>{" "}
                    to arrange delivery.
                  </>
                }
                hi={
                  <>
                    आर्मी पोस्ट ऑफ़िस (APO) पिनकोड पर डिलीवरी के लिए कृपया{" "}
                    <a href={whatsappLink(messages.general)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      WhatsApp पर मैसेज करें
                    </a>
                    ।
                  </>
                }
              />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
