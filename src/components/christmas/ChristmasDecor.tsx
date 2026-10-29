/** Falling snow and a string of fairy lights for Christmas sections (styles in globals.css). Decorative only. */
export function ChristmasDecor({ lightsClassName }: { lightsClassName?: string }) {
  return (
    <>
      <div className="snowfall" aria-hidden="true" />
      <div className={`fairy-lights ${lightsClassName ?? ""}`} aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  );
}
