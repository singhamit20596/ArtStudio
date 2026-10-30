import clsx from "clsx";

/**
 * Retirement Gifts decoration (styles in the .theme-service block at the end of globals.css): a band of
 * medal-ribbon stripes along the top, a few gold stars that glint, and a row of hanging medals under the
 * heading. Generic ribbons, stars and medals only: no national flag, national emblem, Ashoka Chakra or
 * service crest or insignia (their use is restricted by law). Decorative only, hidden from screen readers;
 * the motion stops when the visitor prefers reduced motion.
 */

/** The class that gives a page, section or product page the Retirement Gifts colours. */
export const serviceTheme = "theme-service";

/** Where the stars sit (% of the section) and how big they are (px); kept near the sides, clear of the text. */
const STARS = [
  { x: 5, y: 22, size: 12 },
  { x: 11, y: 48, size: 8 },
  { x: 4, y: 74, size: 10 },
  { x: 17, y: 12, size: 7 },
  { x: 94, y: 20, size: 11 },
  { x: 88, y: 44, size: 8 },
  { x: 96, y: 70, size: 12 },
  { x: 82, y: 13, size: 7 },
];

/** Background band and a few stars, behind a dark (navy) section. `ribbonClassName` moves the band below a transparent header. */
export function ServiceDecor({ ribbonClassName }: { ribbonClassName?: string }) {
  return (
    <>
      <div className="service-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span key={i} style={{ "--x": `${s.x}%`, "--y": `${s.y}%`, width: s.size, height: s.size, "--d": `${i * -0.7}s` } as React.CSSProperties} />
        ))}
      </div>
      <div className={clsx("service-ribbon", ribbonClassName)} aria-hidden="true" />
    </>
  );
}

/** Ribbon stripes for each medal, left to right: made-up patterns in the theme colours, not real awards. */
const RIBBONS = [
  ["#7a1e2c", "#d9b45a", "#24427a", "#d9b45a", "#7a1e2c"],
  ["#24427a", "#6f9be0", "#24427a", "#6f9be0", "#24427a"],
  ["#7a1e2c", "#7a1e2c", "#efe4c8", "#7a1e2c", "#7a1e2c"],
  ["#d9b45a", "#24427a", "#24427a", "#24427a", "#d9b45a"],
  ["#6f9be0", "#7a1e2c", "#d9b45a", "#7a1e2c", "#6f9be0"],
];

/** A five-pointed star, centred on (cx, cy), for the medal faces. */
function starPath(cx: number, cy: number, outer: number, inner: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

const MEDAL_STAR = starPath(20, 64, 8, 3.4);

/** Five medals on striped ribbons, hanging under the Retirement Gifts heading; they sway gently. */
export function MedalRow() {
  return (
    <div className="medal-row" aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="medal-gold" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#fff1bf" />
            <stop offset="45%" stopColor="#e2bd62" />
            <stop offset="100%" stopColor="#9c7424" />
          </radialGradient>
          <linearGradient id="medal-clasp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3d98c" />
            <stop offset="100%" stopColor="#a47c2a" />
          </linearGradient>
        </defs>
      </svg>
      {RIBBONS.map((stripes, i) => (
        <svg key={i} viewBox="0 0 40 84" className="medal" style={{ "--d": `${i * -0.9}s` } as React.CSSProperties}>
          {stripes.map((colour, s) => (
            <rect key={s} x={6 + s * 5.6} y="0" width="5.7" height="35" fill={colour} />
          ))}
          <rect x="6" y="0" width="28" height="35" fill="none" stroke="rgb(0 0 0 / 0.25)" strokeWidth="0.8" />
          <rect x="4.5" y="33.5" width="31" height="4.5" rx="1" fill="url(#medal-clasp)" />
          <circle cx="20" cy="43" r="3.2" fill="none" stroke="#c9a043" strokeWidth="1.6" />
          <circle cx="20" cy="64" r="17" fill="url(#medal-gold)" stroke="#8a6620" strokeWidth="1" />
          <circle cx="20" cy="64" r="13" fill="none" stroke="#fff3c9" strokeOpacity="0.55" strokeWidth="0.9" />
          <path d={MEDAL_STAR} fill="#a87d27" stroke="#fff1bf" strokeOpacity="0.5" strokeWidth="0.5" />
          <ellipse className="medal-glint" cx="14" cy="57" rx="4" ry="2.2" fill="#ffffff" opacity="0.45" transform="rotate(-35 14 57)" />
        </svg>
      ))}
    </div>
  );
}
