import { T } from "@/i18n/T";

const STEPS: [string, string][] = [
  ["Tap the button to message us on WhatsApp.", "बटन दबाकर हमें WhatsApp पर मैसेज करें।"],
  ["Share your photos, names, colours and the date you need it by.", "अपनी फ़ोटो, नाम, रंग और जिस तारीख़ तक चाहिए, वह भेजें।"],
  ["We reply with the design details and the final price.", "हम डिज़ाइन की जानकारी और आख़िरी कीमत के साथ जवाब देते हैं।"],
  ["Once you confirm, we make it by hand and ship it to you.", "आपकी हाँ मिलते ही, हम इसे हाथ से बनाकर आपको भेज देते हैं।"],
];

/** Four short steps shown next to every "Request this custom piece" button. */
export function HowCustomWorks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
        <T en="How custom orders work" hi="कस्टम ऑर्डर कैसे होता है" />
      </h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map(([s, hi], i) => (
          <li key={s} className="flex gap-3 text-[13.5px] leading-relaxed">
            <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brown text-[11px] font-semibold tabular-nums text-white">
              {i + 1}
            </span>
            <span>
              <T en={s} hi={hi} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
