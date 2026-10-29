/**
 * Diwali decoration (styles in globals.css): a marigold garland along the top and gold sparkles
 * drifting up. Decorative only; motion stops when the visitor prefers reduced motion.
 */
export function DiwaliDecor({ garlandClassName }: { garlandClassName?: string }) {
  return (
    <>
      <div className="diwali-sparkles" aria-hidden="true" />
      <div className={`marigold-garland ${garlandClassName ?? ""}`} aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  );
}

/** Five clay diyas with flickering flames, under the Diwali page heading. The gradients are defined once and shared. */
export function DiyaRow() {
  return (
    <div className="diya-row" aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="diya-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd36b" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="diya-fire" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff6a00" />
            <stop offset="55%" stopColor="#ffc93c" />
            <stop offset="100%" stopColor="#fff7d6" />
          </linearGradient>
          <linearGradient id="diya-clay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9692a" />
            <stop offset="100%" stopColor="#8c2f12" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 64 60" className="diya" style={{ "--d": `${i * -0.37}s` } as React.CSSProperties}>
          <circle className="diya-glow" cx="32" cy="22" r="22" fill="url(#diya-glow)" />
          <path className="diya-flame" d="M32 5 C39 15 39 24 32 29 C25 24 25 15 32 5 Z" fill="url(#diya-fire)" />
          <path d="M5 31 Q32 27 59 31 Q55 52 32 54 Q9 52 5 31 Z" fill="url(#diya-clay)" />
          <path d="M5 31 Q32 36 59 31" fill="none" stroke="#f2c14e" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="42" r="1.8" fill="#f2c14e" />
          <circle cx="32" cy="45" r="1.8" fill="#f2c14e" />
          <circle cx="44" cy="42" r="1.8" fill="#f2c14e" />
        </svg>
      ))}
    </div>
  );
}
