import type { FlagVariant } from "./flagTexture";

const YELLOW = "#fcdd09";
const RED = "#da121a";
const BLUE = "#004b98";

export default function StaticFlagSvg({
  variant,
  className,
}: {
  variant: FlagVariant;
  className?: string;
}) {
  const stripes = Array.from({ length: 9 }, (_, i) => i);
  const stripeHeight = 100 / 9;

  return (
    <svg
      viewBox="0 0 150 100"
      className={className}
      role="img"
      aria-label={variant === "estelada" ? "Bandera estelada" : "Senyera"}
    >
      <g>
        {stripes.map((i) => (
          <rect
            key={i}
            x="0"
            y={i * stripeHeight}
            width="150"
            height={stripeHeight + 0.5}
            fill={i % 2 === 0 ? YELLOW : RED}
          />
        ))}
        {variant === "estelada" && (
          <>
            <polygon points="0,0 63,50 0,100" fill={BLUE} />
            <g transform="translate(22,50)">
              <polygon fill="#fff" points={starPoints(0, 0, 12, 5)} />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

function starPoints(cx: number, cy: number, outerR: number, points: number): string {
  const innerR = outerR * 0.45;
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    coords.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
  }
  return coords.join(" ");
}
