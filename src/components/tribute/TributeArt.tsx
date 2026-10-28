import { User } from "lucide-react";
import { FramePreview } from "./FramePreview";

const BROWN = "#5a3e2b";
const SAGE = "#87a96b";
const AMBER = "#d5851f";
const TEXT = "#1e140d";

interface ArtProps {
  /** Product slug: box-frame, newspaper-tribute or resin-frame. */
  kind: string;
  rank?: string;
  name?: string;
  /** Background colour chosen when personalising. */
  background?: string;
  className?: string;
}

const plate = (rank?: string, name?: string) => [rank?.trim(), name?.trim()].filter(Boolean).join(" ").toUpperCase() || "RANK AND NAME";

/**
 * Drawn stand-ins for each tribute, used until real photos arrive and as the live preview
 * while personalising. Not photos of finished pieces.
 */
export function TributeArt({ kind, rank, name, background, className }: ArtProps) {
  if (kind === "newspaper-tribute") return <NewspaperArt rank={rank} name={name} background={background} className={className} />;
  if (kind === "resin-frame") return <ResinArt rank={rank} name={name} background={background} className={className} />;
  return <FramePreview service="army" rank={rank ?? ""} name={name ?? ""} mount={background} className={className} />;
}

function NewspaperArt({ rank, name, background = SAGE, className }: Omit<ArtProps, "kind">) {
  const headline = plate(rank, name);
  const size = Math.max(11, Math.min(20, 300 / Math.max(headline.length, 1)));
  return (
    <svg viewBox="0 0 360 450" role="img" aria-label={`Sketch of a newspaper tribute. Headline: ${headline}`} className={className}>
      <rect width="360" height="450" fill={BROWN} />
      <rect x="12" y="12" width="336" height="426" fill="none" stroke={AMBER} strokeWidth="2" />
      <rect x="22" y="22" width="316" height="406" fill={background} style={{ transition: "fill 0.5s" }} />
      <text x="180" y="58" textAnchor="middle" fill={TEXT} fontSize="22" fontWeight="700" letterSpacing="3">
        A LIFE OF SERVICE
      </text>
      <rect x="40" y="68" width="280" height="2" fill={TEXT} />
      <rect x="40" y="73" width="280" height="1" fill={TEXT} />
      <text x="180" y="104" textAnchor="middle" fill={TEXT} fontSize={size} fontWeight="700" letterSpacing="1">
        {headline}
      </text>
      <text x="180" y="124" textAnchor="middle" fill={TEXT} fontSize="10" letterSpacing="1.5">
        RETIRES AFTER A DISTINGUISHED CAREER
      </text>
      <g className="drop-in" style={{ "--i": 1 } as React.CSSProperties}>
        <rect x="40" y="138" width="170" height="150" fill={BROWN} stroke={AMBER} strokeWidth="2" />
        <User x={95} y={183} width={60} height={60} color={AMBER} strokeWidth={1.3} />
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={`a${i}`} x="222" y={142 + i * 16} width={i % 3 === 2 ? 70 : 98} height="5" fill={TEXT} opacity="0.55" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`c${i}`} opacity="0.55" fill={TEXT}>
          <rect x="40" y={304 + i * 16} width={i === 6 ? 60 : 82} height="5" />
          <rect x="138" y={304 + i * 16} width={i === 5 ? 50 : 82} height="5" />
          <rect x="236" y={304 + i * 16} width={i === 4 ? 40 : 84} height="5" />
        </g>
      ))}
      <rect x="40" y="410" width="280" height="1" fill={TEXT} />
    </svg>
  );
}

function ResinArt({ rank, name, background = SAGE, className }: Omit<ArtProps, "kind">) {
  return (
    <svg viewBox="0 0 360 450" role="img" aria-label={`Sketch of a resin tribute for ${plate(rank, name)}`} className={className}>
      <rect width="360" height="450" fill={AMBER} />
      {/* Clear resin block with a soft edge */}
      <rect x="50" y="40" width="260" height="300" rx="26" fill={background} opacity="0.9" style={{ transition: "fill 0.5s" }} />
      <rect x="50" y="40" width="260" height="300" rx="26" fill="none" stroke={BROWN} strokeWidth="3" />
      <rect x="64" y="54" width="232" height="272" rx="18" fill="none" stroke={AMBER} strokeWidth="1.5" opacity="0.8" />
      <g className="drop-in" style={{ "--i": 1 } as React.CSSProperties}>
        <circle cx="180" cy="170" r="66" fill={BROWN} stroke={AMBER} strokeWidth="3" />
        <User x={140} y={130} width={80} height={80} color={AMBER} strokeWidth={1.2} />
      </g>
      {[
        [96, 92],
        [262, 104],
        [94, 270],
        [266, 262],
        [120, 300],
        [242, 296],
      ].map(([x, y], i) => (
        <g key={i} className="drop-in" style={{ "--i": 2 + i } as React.CSSProperties}>
          <circle cx={x} cy={y} r="9" fill={AMBER} />
          <circle cx={x} cy={y} r="3.5" fill={BROWN} />
        </g>
      ))}
      {/* Base and name plaque */}
      <rect x="40" y="350" width="280" height="30" fill={BROWN} />
      <rect x="95" y="390" width="170" height="34" fill={BROWN} stroke={TEXT} strokeWidth="1" />
      <text x="180" y="412" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="600" letterSpacing="1.5">
        {plate(rank, name).slice(0, 26)}
      </text>
    </svg>
  );
}

/** Small wireframes of the designs that have no photo yet, for the design step. */
export function TemplateThumb({ id, className }: { id: string; className?: string }) {
  const box = (x: number, y: number, w: number, h: number, fill = BROWN, key?: string) => <rect key={key} x={x} y={y} width={w} height={h} fill={fill} />;
  const dot = (cx: number, cy: number, key: string) => <circle key={key} cx={cx} cy={cy} r="5" fill={AMBER} />;
  const layouts: Record<string, React.ReactNode> = {
    "front-page": [box(14, 10, 102, 6, BROWN), box(14, 20, 102, 4, AMBER), box(14, 28, 60, 44), [32, 40, 48, 56, 64].map((y) => box(80, y, 36, 3, BROWN, `l${y}`))],
    "photo-story": [box(14, 10, 102, 6, BROWN), [0, 1, 2].flatMap((c) => [0, 1].map((r) => box(14 + c * 35, 22 + r * 26, 30, 22, BROWN, `p${c}${r}`)))],
    broadsheet: [box(14, 8, 102, 8, BROWN), box(40, 22, 50, 34), [62, 68].map((y) => box(14, y, 102, 3, BROWN, `l${y}`))],
    rectangle: [<rect key="r" x="16" y="10" width="98" height="56" rx="8" fill="none" stroke={BROWN} strokeWidth="3" />, <circle key="c" cx="48" cy="38" r="16" fill={BROWN} />, dot(84, 30, "a"), dot(96, 46, "b")],
    arch: [<path key="a" d="M30 70 V34 a35 30 0 0 1 70 0 V70 Z" fill="none" stroke={BROWN} strokeWidth="3" />, <circle key="c" cx="65" cy="38" r="15" fill={BROWN} />, dot(48, 62, "a"), dot(82, 62, "b")],
    round: [<circle key="o" cx="65" cy="40" r="32" fill="none" stroke={BROWN} strokeWidth="3" />, <circle key="c" cx="65" cy="40" r="16" fill={BROWN} />, dot(42, 24, "a"), dot(88, 56, "b")],
  };
  return (
    <svg viewBox="0 0 130 80" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="126" height="76" fill={SAGE} stroke={BROWN} strokeWidth="2" />
      {layouts[id]}
    </svg>
  );
}
