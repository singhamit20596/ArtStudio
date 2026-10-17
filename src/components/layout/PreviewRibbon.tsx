import { isPreview } from "@/lib/preview";

/** Only in the design preview build: says what is real and what is a placeholder. */
export function PreviewRibbon() {
  if (!isPreview) return null;
  return (
    <div className="bg-preview text-ink">
      <p className="container-x py-2 text-center text-[11.5px] leading-snug">
        <strong className="font-semibold">Phase 2 preview.</strong> Photos are from Instagram; prices, stock and delivery times are placeholders.
      </p>
    </div>
  );
}
