const STEPS = [
  "Tap the button to message us on WhatsApp.",
  "Share your photos, names, colours and the date you need it by.",
  "We reply with the design details and the final price.",
  "Once you confirm, we make it by hand and ship it to you.",
];

/** Four short steps shown next to every "Request this custom piece" button. */
export function HowCustomWorks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">How custom orders work</h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex gap-3 text-[13.5px] leading-relaxed">
            <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream text-[11px] font-semibold tabular-nums text-gold-ink">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
