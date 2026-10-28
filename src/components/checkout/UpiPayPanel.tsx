"use client";

import { Copy, Loader2, Smartphone } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toaster";
import type { Order } from "@/lib/checkout";
import { formatINR } from "@/lib/format";
import { cleanUtr, isPreviewUpi, isUtr, upiId, upiLink } from "@/lib/upi";

/**
 * Pay by UPI: a button that opens the customer's UPI app (phones) and a QR code to scan
 * (computers), then "I've paid" with the transaction reference for the studio to check.
 */
export function UpiPayPanel({ order, onClaimed }: { order: Order; onClaimed: (order: Order) => void }) {
  const link = upiLink(order.totals.total, order.id);
  const [qr, setQr] = useState<string | null>(null);
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toString(link, { type: "svg", margin: 1, color: { dark: "#1e140d", light: "#87a96b" }, errorCorrectionLevel: "M" })
      .then((svg) => alive && setQr(svg))
      .catch(() => alive && setQr(null));
    return () => {
      alive = false;
    };
  }, [link]);

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ref.trim() && !isUtr(ref)) {
      setError("The UPI reference is the 12-digit number in your app's payment details. Leave it empty if you can't find it.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}/paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: order.token, ref: cleanUtr(ref) }),
      });
      const data = await res.json();
      if (data.ok) onClaimed(data.order);
      else setError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(upiId());
      toast("UPI ID copied");
    } catch {
      toast(`UPI ID: ${upiId()}`);
    }
  };

  return (
    <section aria-labelledby="upi-title" className="surface-amber p-6 md:p-8">
      <p className="eyebrow">Step 1 of 2</p>
      <h2 id="upi-title" className="mt-2 text-[22px] font-semibold md:text-[26px]">
        Pay {formatINR(order.totals.total)} by UPI
      </h2>
      {isPreviewUpi() && (
        <p className="mt-3 border border-line px-3 py-2 text-[12.5px]">Preview: no UPI ID is set yet (src/config/site.ts), so this uses a placeholder that cannot receive money.</p>
      )}
      <div className="mt-6 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:items-center">
        <div className="mx-auto w-[200px] border-4 border-brown bg-sage p-2">
          {qr ? <div aria-label="UPI QR code" role="img" dangerouslySetInnerHTML={{ __html: qr }} /> : <div className="grid aspect-square place-items-center"><Loader2 className="animate-spin" /></div>}
        </div>
        <div>
          <a href={link} className="btn btn-dark btn-press w-full md:hidden">
            <Smartphone size={17} aria-hidden="true" /> Open UPI app
          </a>
          <p className="mt-3 text-[14px] leading-relaxed md:mt-0">
            <span className="hidden md:inline">Scan the code with GPay, PhonePe, Paytm or any UPI app. </span>
            <span className="md:hidden">Or scan the code from another phone. </span>
            The amount and order number are filled in for you.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            UPI ID <strong className="font-semibold">{upiId()}</strong>
            <button type="button" onClick={copyId} className="inline-flex items-center gap-1 underline underline-offset-4">
              <Copy size={13} aria-hidden="true" /> Copy
            </button>
          </p>
        </div>
      </div>

      <form onSubmit={claim} className="mt-8 border-t border-line pt-6">
        <label htmlFor="upi-ref" className="block text-[13px] font-semibold">
          Paid? Enter the UPI reference (UTR) from your app
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="upi-ref"
            value={ref}
            onChange={(e) => setRef(e.target.value.slice(0, 20))}
            inputMode="numeric"
            autoComplete="off"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "upi-ref-error" : undefined}
            placeholder="12-digit UTR (optional)"
            className="h-12 min-w-0 flex-1 border border-line bg-transparent px-3 text-[14px] outline-none placeholder:text-muted focus:border-ink"
          />
          <button type="submit" disabled={busy} className="btn btn-dark btn-press shrink-0 px-6 disabled:opacity-70">
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} I&apos;ve paid
          </button>
        </div>
        {error && (
          <p id="upi-ref-error" role="alert" className="mt-2 text-[12.5px] text-error">
            {error}
          </p>
        )}
        <p className="mt-2 text-[12px] text-muted">We check the payment and confirm it on WhatsApp. Then we start making your tribute.</p>
      </form>
    </section>
  );
}
