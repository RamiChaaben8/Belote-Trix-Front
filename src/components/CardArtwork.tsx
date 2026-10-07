import type { CardData, Rank, Suit } from "@/types";

const SUIT_GLYPH: Record<Suit, string> = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

const PIP_LAYOUTS: Record<Exclude<Rank, "J" | "Q" | "K" | "A">, [number, number][]> = {
  "7": [[30, 43], [70, 43], [30, 67], [70, 67], [30, 91], [70, 91], [50, 67]],
  "8": [[30, 38], [70, 38], [30, 57], [70, 57], [30, 76], [70, 76], [30, 95], [70, 95]],
  "9": [[30, 35], [70, 35], [30, 55], [70, 55], [50, 65], [30, 85], [70, 85], [30, 105], [70, 105]],
  "10": [[28, 34], [72, 34], [28, 52], [72, 52], [28, 70], [72, 70], [28, 88], [72, 88], [28, 106], [72, 106]],
};

function CardText({
  children,
  x,
  y,
  color,
  size,
  weight = 800,
  anchor = "middle",
}: {
  children: string;
  x: number;
  y: number;
  color: string;
  size: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      fill={color}
    >
      {children}
    </text>
  );
}

function Pip({ suit, x, y }: { suit: Suit; x: number; y: number }) {
  return (
    <CardText x={x} y={y} color={suit === "H" || suit === "D" ? "#c1121f" : "#111827"} size={16}>
      {SUIT_GLYPH[suit]}
    </CardText>
  );
}

export function CardFrontArtwork({
  card,
  hideBottomRank = false,
}: {
  card: CardData;
  hideBottomRank?: boolean;
}) {
  const color = card.suit === "H" || card.suit === "D" ? "#c1121f" : "#111827";
  const isFace = card.rank === "J" || card.rank === "Q" || card.rank === "K";
  const isAce = card.rank === "A";
  const pips = card.rank in PIP_LAYOUTS ? PIP_LAYOUTS[card.rank as keyof typeof PIP_LAYOUTS] : [];

  return (
    <svg className="card-artwork" viewBox="0 0 100 145" role="img" aria-label={`${card.rank}${SUIT_GLYPH[card.suit]}`}>
      <rect x="1.5" y="1.5" width="97" height="142" rx="6" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />

      <g aria-label="top-left rank and suit">
        <CardText x={12} y={18} color={color} size={18} anchor="start">{card.rank}</CardText>
        <CardText x={14} y={35} color={color} size={17} anchor="start">{SUIT_GLYPH[card.suit]}</CardText>
      </g>

      {!hideBottomRank && (
        <g transform="rotate(180 86 127)" aria-label="bottom-right rank and suit">
          <CardText x={86} y={118} color={color} size={18} anchor="start">{card.rank}</CardText>
          <CardText x={88} y={135} color={color} size={17} anchor="start">{SUIT_GLYPH[card.suit]}</CardText>
        </g>
      )}

      {isAce && (
        <CardText x={50} y={78} color={color} size={54}>
          {SUIT_GLYPH[card.suit]}
        </CardText>
      )}

      {isFace && (
        <g aria-label={`${card.rank} face card`}>
          <CardText x={50} y={62} color={color} size={36}>{card.rank}</CardText>
          <CardText x={50} y={92} color={color} size={30}>{SUIT_GLYPH[card.suit]}</CardText>
        </g>
      )}

      {!isAce && !isFace && (
        <g aria-label={`${card.rank} suit pips`}>
          {pips.map(([x, y], index) => <Pip key={index} suit={card.suit} x={x} y={y} />)}
        </g>
      )}
    </svg>
  );
}

export function CardBackArtwork() {
  return (
    <svg className="card-artwork" viewBox="0 0 100 145" role="img" aria-label="Belote Trix card back">
      <rect x="1.5" y="1.5" width="97" height="142" rx="6" fill="#123b70" stroke="#d4af37" strokeWidth="2.5" />
      <rect x="7" y="7" width="86" height="131" rx="3" fill="none" stroke="#f0d77a" strokeWidth="1.2" />
      <rect x="11" y="11" width="78" height="123" rx="2" fill="none" stroke="#82a9d8" strokeWidth="0.8" />
      <CardText x={50} y={68} color="#ffffff" size={8} weight={900}>BELOTE</CardText>
      <CardText x={50} y={79} color="#f0d77a" size={9} weight={900}>TRIX</CardText>
      <CardText x={50} y={101} color="#ffffff" size={20}>♠ ♥</CardText>
    </svg>
  );
}
