/**
 * Racing decoration (styles in globals.css): a carbon-fibre weave, a chequered flag along the
 * top and speed lines streaking past. Decorative only; motion stops with reduced motion.
 */
export function RacingDecor({ flagClassName }: { flagClassName?: string }) {
  return (
    <>
      <div className="carbon-weave" aria-hidden="true" />
      <div className="speed-lines" aria-hidden="true" />
      <div className={`chequered-flag ${flagClassName ?? ""}`} aria-hidden="true" />
    </>
  );
}

/** Five race start lights under the Car Gifts heading: they light up one by one, then go out. */
export function StartLights() {
  return (
    <div className="start-lights" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="start-light">
          <i />
          <i />
        </span>
      ))}
    </div>
  );
}
