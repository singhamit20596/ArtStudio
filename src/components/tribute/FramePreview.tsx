import { Anchor, Award, Plane, Shield, Star, Swords, User } from "lucide-react";
import type { FrameItemId, ServiceId } from "@/config/tribute";

interface FramePreviewProps {
  service: ServiceId;
  rank: string;
  name: string;
  /** Second line on the name plate (unit, years). */
  detail?: string;
  /** Which elements to draw; all of them when left out. */
  items?: readonly FrameItemId[];
  className?: string;
}

const BROWN = "#5a3e2b";
const SAGE = "#87a96b";
const AMBER = "#d5851f";
const TEXT = "#1e140d";

const EMBLEM = { army: Swords, navy: Anchor, "air-force": Plane, other: Shield } as const;

/**
 * An illustrated shadow box in the three brand colours: emblem, crests, badges, photo,
 * medals, rank insignia and the engraved name plate, which updates as the visitor types.
 * Not a photo of the finished piece; the real layout is agreed on WhatsApp.
 */
export function FramePreview({ service, rank, name, detail, items, className }: FramePreviewProps) {
  const has = (id: FrameItemId) => !items || items.includes(id);
  const Emblem = EMBLEM[service];
  const line1 = [rank.trim(), name.trim()].filter(Boolean).join(" ").toUpperCase() || "RANK AND NAME";
  const size = Math.max(9, Math.min(15, 330 / Math.max(line1.length, 1)));

  return (
    <svg viewBox="0 0 480 360" role="img" aria-label={`Preview of a tribute frame. Name plate: ${line1}`} className={className}>
      {/* Frame, bevel and mount */}
      <rect width="480" height="360" fill={BROWN} />
      <rect x="13" y="13" width="454" height="334" fill="none" stroke={AMBER} strokeWidth="2" />
      <rect x="22" y="22" width="436" height="316" fill={SAGE} />

      {/* Service emblem: replays its entrance when the service changes */}
      <g key={service} className="pop-in" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="240" cy="70" r="30" fill={BROWN} stroke={AMBER} strokeWidth="2" />
        <Emblem x={222} y={52} width={36} height={36} color={AMBER} strokeWidth={1.6} />
      </g>

      {has("crests") && (
        <g className="drop-in" style={{ "--i": 1 } as React.CSSProperties}>
          <circle cx="92" cy="92" r="36" fill={BROWN} stroke={AMBER} strokeWidth="2" />
          <Star x={74} y={74} width={36} height={36} color={AMBER} strokeWidth={1.4} />
          <circle cx="388" cy="92" r="36" fill={BROWN} stroke={AMBER} strokeWidth="2" />
          <Shield x={370} y={74} width={36} height={36} color={AMBER} strokeWidth={1.4} />
        </g>
      )}

      {has("badges") && (
        <g className="drop-in" style={{ "--i": 2 } as React.CSSProperties}>
          {[196, 228, 260].map((x) => (
            <Award key={x} x={x} y={110} width={24} height={24} color={BROWN} strokeWidth={1.8} />
          ))}
        </g>
      )}

      {has("photo") && (
        <g className="drop-in" style={{ "--i": 3 } as React.CSSProperties}>
          <circle cx="240" cy="186" r="42" fill={BROWN} stroke={AMBER} strokeWidth="2" />
          <User x={216} y={162} width={48} height={48} color={AMBER} strokeWidth={1.4} />
        </g>
      )}

      {has("medals") &&
        [0, 1, 2, 3].map((i) => (
          <g key={i} className="drop-in" style={{ "--i": 4 + i } as React.CSSProperties}>
            <rect x={340 + i * 22} y={150} width="14" height="26" fill={i % 2 ? AMBER : BROWN} />
            <rect x={344 + i * 22} y={150} width="6" height="26" fill={i % 2 ? BROWN : AMBER} />
            <circle cx={347 + i * 22} cy={188} r="9" fill={AMBER} stroke={BROWN} strokeWidth="1.5" />
          </g>
        ))}

      {has("insignia") && (
        <g className="drop-in" style={{ "--i": 8 } as React.CSSProperties} fill="none" stroke={BROWN} strokeWidth="5" strokeLinejoin="round">
          {[0, 1, 2].map((i) => (
            <polyline key={i} points={`352,${236 + i * 14} 374,${250 + i * 14} 396,${236 + i * 14}`} />
          ))}
        </g>
      )}

      {/* Left column: shoulder rank and a small badge, to balance the medals */}
      {has("insignia") && (
        <g className="drop-in" style={{ "--i": 9 } as React.CSSProperties}>
          <rect x="66" y="160" width="58" height="18" fill={BROWN} />
          <rect x="66" y="160" width="58" height="4" fill={AMBER} />
        </g>
      )}
      {has("badges") && (
        <g className="drop-in" style={{ "--i": 10 } as React.CSSProperties}>
          <rect x="74" y="196" width="42" height="30" fill={BROWN} stroke={AMBER} strokeWidth="1.5" />
          <Star x={86} y={202} width={18} height={18} color={AMBER} strokeWidth={1.6} />
        </g>
      )}

      {/* Engraved name plate */}
      {has("plate") && (
        <g>
          <rect x="132" y="256" width="216" height="56" fill={AMBER} stroke={BROWN} strokeWidth="2" />
          <text x="240" y="281" textAnchor="middle" fill={TEXT} fontSize={size} fontWeight="600" letterSpacing="1.5">
            {line1}
          </text>
          <text x="240" y="300" textAnchor="middle" fill={TEXT} fontSize="10" letterSpacing="1.2">
            {(detail?.trim() || "With gratitude for your service").slice(0, 46)}
          </text>
        </g>
      )}
    </svg>
  );
}
