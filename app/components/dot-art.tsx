/**
 * Generative dot-field artwork for the capability cards.
 *
 * Each variant is a pure function of its index — no randomness — so the server
 * and client render byte-identical SVG and the whole thing costs one static
 * payload with no image request.
 *
 * Dots are emitted in <g> bands (rows, rays or columns depending on the
 * variant) and each band carries its own `--dx/--dy/--dot-delay`. Hovering the
 * card translates every band by its own offset, staggered by its own delay, so
 * the field ripples rather than moving as one block — all in CSS, no JS.
 *
 * Everything draws in `currentColor`, so a card sets the artwork colour by
 * setting its text colour.
 */

type Dot = { x: number; y: number; r: number; o: number };
/** One animated band: its dots, its hover displacement, and its delay. */
type Band = { dots: Dot[]; dx: number; dy: number; delay: number };

const W = 300;
const H = 400;

/** Square lattice cut through by diagonal voids; hover shears it row by row. */
function lattice(): Band[] {
  const n = 24;
  const bands: Band[] = [];
  for (let row = 0; row < n; row++) {
    const dots: Dot[] = [];
    for (let col = 0; col < n; col++) {
      // Diagonal bands of missing dots, at two frequencies so the voids
      // interfere and the gaps read as drawn rather than periodic.
      const band = (col + row * 0.75) % 8;
      const cross = (col * 0.5 - row) % 11;
      if (band < 1.3 || (cross > 0 && cross < 1.1)) continue;
      dots.push({
        x: 34 + col * (232 / (n - 1)),
        y: 90 + row * (232 / (n - 1)),
        r: 1.5,
        o: 0.9,
      });
    }
    bands.push({
      dots,
      dx: Math.sin(row * 0.55) * 9,
      dy: 0,
      delay: row * 18,
    });
  }
  return bands;
}

/** Stacked wave fronts; hover deepens the swell. */
function wave(): Band[] {
  const rows = 26;
  const cols = 46;
  const bands: Band[] = [];
  for (let row = 0; row < rows; row++) {
    const damp = Math.exp(-row / 15);
    const dots: Dot[] = [];
    for (let col = 0; col < cols; col++) {
      const x = 26 + col * (248 / (cols - 1));
      const phase = (x / 248) * Math.PI * 2 * 1.6 + row * 0.07;
      dots.push({
        x,
        y: 96 + row * 9 + Math.sin(phase) * 30 * damp,
        r: 1.3,
        o: 0.55 + 0.45 * damp,
      });
    }
    bands.push({ dots, dx: 0, dy: -damp * 22, delay: row * 22 });
  }
  return bands;
}

/** Rays converging on a point; hover blows them outward along their own axis. */
function burst(): Band[] {
  const rays = 28;
  const steps = 22;
  const bands: Band[] = [];
  for (let ray = 0; ray < rays; ray++) {
    const a = (ray / rays) * Math.PI * 2;
    const dots: Dot[] = [];
    for (let step = 1; step <= steps; step++) {
      // Rays start clear of the origin — converging all of them on the exact
      // centre fills it in as a solid blob and loses the focal point.
      const d = 34 + step * step * 0.42;
      const x = W / 2 + Math.cos(a) * d * 1.35;
      const y = H / 2 + 20 + Math.sin(a) * d * 0.62;
      if (x < 12 || x > W - 12 || y < 70 || y > H - 12) continue;
      dots.push({ x, y, r: 1.3, o: 0.35 + 0.6 * (1 - step / steps) });
    }
    bands.push({
      dots,
      dx: Math.cos(a) * 16,
      dy: Math.sin(a) * 9,
      delay: Math.abs(ray - rays / 2) * 12,
    });
  }
  return bands;
}

/** A folded ribbon; hover pulls the near columns forward. */
function ribbon(): Band[] {
  const cols = 34;
  const rows = 40;
  const bands: Band[] = [];
  for (let col = 0; col < cols; col++) {
    const t = col * 0.23;
    const sweep = Math.sin(t);
    // Columns bunch up where the ribbon turns away, which is what sells the
    // fold — the derivative of the sweep drives both spacing and opacity.
    const facing = Math.abs(Math.cos(t));
    // The column's centre and height both travel, which is what gives the
    // stack a silhouette instead of reading as a flat set of vertical rules.
    const centre = 240 + Math.sin(t * 0.85) * 44;
    const halfHeight = 88 + facing * 44;
    const dots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      dots.push({
        x: W / 2 + sweep * 108,
        y: centre - halfHeight + (row / (rows - 1)) * halfHeight * 2,
        r: 1.2,
        o: 0.25 + 0.65 * facing,
      });
    }
    bands.push({ dots, dx: sweep * 10, dy: -facing * 16, delay: col * 14 });
  }
  return bands;
}

const VARIANTS = { lattice, wave, burst, ribbon };

export type DotArtVariant = keyof typeof VARIANTS;

export default function DotArt({
  variant,
  className,
}: {
  variant: DotArtVariant;
  className?: string;
}) {
  const bands = VARIANTS[variant]();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`dot-art ${className ?? ""}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {bands.map((band, i) => (
        <g
          key={i}
          style={
            {
              "--dx": `${band.dx.toFixed(2)}px`,
              "--dy": `${band.dy.toFixed(2)}px`,
              "--dot-delay": `${band.delay}ms`,
            } as React.CSSProperties
          }
        >
          {band.dots.map((d, j) => (
            <circle
              key={j}
              cx={d.x.toFixed(2)}
              cy={d.y.toFixed(2)}
              r={d.r}
              opacity={d.o.toFixed(2)}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
