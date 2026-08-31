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

/*
 * Every variant lays its dots out on a rectangle, and left alone each one ends
 * at the edge of that rectangle with a knife-straight cut — the lattice read as
 * a swatch, the burst as a dandelion with its top sliced off, the ribbon as a
 * block of hatching. A mark needs its own silhouette, not a crop.
 *
 * So the renderer fades every dot out by its distance from a shared focus. It
 * lives here rather than in the four generators because it is one decision, not
 * four, and because it is what makes the set read as a family: four different
 * structures, each dissolving into the page the same way — the same thing the
 * hero globe does at its lower edge.
 *
 * The focus sits above the geometric centre because all four variants weight
 * their mass low.
 */
const FOCUS_X = W / 2;
const FOCUS_Y = 214;
/** Distance from the focus, in viewBox units, where the fade starts and ends. */
const FADE_FROM = 92;
const FADE_TO = 172;

function falloff(x: number, y: number) {
  const d = Math.hypot(x - FOCUS_X, y - FOCUS_Y);
  if (d <= FADE_FROM) return 1;
  if (d >= FADE_TO) return 0;
  const t = 1 - (d - FADE_FROM) / (FADE_TO - FADE_FROM);
  return t * t * (3 - 2 * t); // smoothstep
}

/**
 * Square lattice cut through by diagonal channels; hover shears it row by row.
 *
 * The channels are two families of one-dot gaps running at opposite diagonals,
 * both on the same period, which leaves regular diamond cells.
 *
 * It is cut to a disc rather than left as the square its grid is generated on.
 * A square of dots reads as a swatch — a sample of a pattern that continues
 * past the crop — where the other three marks all have a silhouette of their
 * own. The cut is set where the renderer's falloff has already taken the dots
 * most of the way down, so the rim dissolves instead of stair-stepping.
 *
 * They used to be cut by two interfering modulo frequencies at different
 * periods, one of them evaluated on a half-integer. That produced cells of
 * every different size, and because JavaScript's `%` returns a negative result
 * for a negative left operand, the second family silently switched off across
 * half the grid. The result read as damage rather than as pattern. A lattice
 * has to be regular or it is not a lattice.
 */
function lattice(): Band[] {
  const n = 29;
  const step = 9.6;
  /** Channel spacing, in cells. */
  const P = 7;
  /** Radius of the disc the grid is cut to, in viewBox units. */
  const CUT = 138;
  const origin = ((n - 1) * step) / 2;
  const bands: Band[] = [];
  for (let row = 0; row < n; row++) {
    const dots: Dot[] = [];
    for (let col = 0; col < n; col++) {
      const down = (col + row) % P;
      const up = (((col - row) % P) + P) % P;
      if (down === 0 || up === 0) continue;
      const x = FOCUS_X - origin + col * step;
      const y = FOCUS_Y - origin + row * step;
      if (Math.hypot(x - FOCUS_X, y - FOCUS_Y) > CUT) continue;
      dots.push({ x, y, r: 1.7, o: 0.95 });
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
        r: 1.7,
        o: 0.62 + 0.38 * damp,
      });
    }
    bands.push({ dots, dx: 0, dy: -damp * 22, delay: row * 22 });
  }
  return bands;
}

/**
 * Rays converging on a point; hover blows them outward along their own axis.
 *
 * Circular, and concentric with the renderer's falloff. It used to be scaled
 * 1.35 wide by 0.62 tall, which the circular falloff then cut at a constant
 * radius — so the horizontal rays were trimmed short while the vertical ones
 * ran on, and the star came out squashed and lopsided around a flat oval hole.
 * Anything radial in here has to share the falloff's centre and its aspect.
 *
 * Spacing goes as the square of the step: dense at the core, opening out to
 * nothing at the rim, so the rays dissolve instead of ending.
 */
function burst(): Band[] {
  const rays = 32;
  const steps = 20;
  const bands: Band[] = [];
  for (let ray = 0; ray < rays; ray++) {
    const a = (ray / rays) * Math.PI * 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const dots: Dot[] = [];
    for (let step = 1; step <= steps; step++) {
      // Rays start clear of the origin — converging all of them on the exact
      // centre fills it in as a solid blob and loses the focal point.
      const d = 24 + step * step * 0.36;
      dots.push({
        x: FOCUS_X + cos * d,
        y: FOCUS_Y + sin * d,
        r: 1.7,
        o: 0.5 + 0.5 * (1 - step / steps),
      });
    }
    bands.push({
      dots,
      dx: cos * 16,
      dy: sin * 16,
      delay: Math.abs(ray - rays / 2) * 12,
    });
  }
  return bands;
}

/**
 * A ribbon seen edge-on, twisting once across its width; hover pulls the near
 * columns forward.
 *
 * Columns are laid out evenly across the box and the fold is expressed in what
 * each column *does* — where its centre sits and how tall it stands — rather
 * than in where it is placed.
 *
 * That distinction is the whole fix. The old version derived x from `sin(t)`
 * with t running past a full turn, so the sweep doubled back: several columns
 * landed on the same x carrying different heights and centres, drew over each
 * other, and the band came out as ragged vertical strokes of random length
 * with no fold in it at all. Even spacing means one column per position, and
 * the phase covers exactly one turn.
 *
 * `facing` is the foreshortening: 1 where the ribbon is broadside, near 0 where
 * it turns edge-on. It drives height and opacity together, which is what makes
 * a flat column of dots read as a surface in perspective.
 *
 * Dot *count* follows the column's height rather than being fixed, so spacing
 * stays constant down the whole band. With a fixed count the short columns at
 * the two pinches packed the same dots into a third of the height and rendered
 * as solid vertical bars, which read as a fault in the middle of the mark.
 */
function ribbon(): Band[] {
  const cols = 30;
  /** Distance between dots down a column, in viewBox units. */
  const PITCH = 5.6;
  const bands: Band[] = [];
  for (let col = 0; col < cols; col++) {
    const u = col / (cols - 1);
    const phase = u * Math.PI * 2;
    const facing = 0.24 + 0.76 * Math.abs(Math.cos(phase));
    // Shallow on purpose. At the amplitude this started on, the two waists
    // landed on the crest and the trough — one high, one low — and the
    // silhouette read as a letter M rather than as a band being turned. Keeping
    // the centreline nearly level lets the width carry the twist on its own,
    // and leaves just enough tilt that the mark isn't a symmetrical bowtie.
    const centre = FOCUS_Y + Math.sin(phase) * 14;
    const halfHeight = 96 * facing;
    const rows = Math.max(4, Math.round((halfHeight * 2) / PITCH));
    const dots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      dots.push({
        x: 40 + u * 220,
        y: centre - halfHeight + (row / (rows - 1)) * halfHeight * 2,
        r: 1.6,
        o: 0.4 + 0.55 * facing,
      });
    }
    bands.push({ dots, dx: 0, dy: -facing * 18, delay: col * 14 });
  }
  return bands;
}

const VARIANTS = { lattice, wave, burst, ribbon };

/*
 * ── Why the dots are paths and not circles ───────────────────────────────────
 *
 * Each variant draws 500–1200 dots. As one <circle> apiece that is 3,027
 * elements across the four artworks the orbit holds at once — 82% of the
 * document's nodes and 195KB of its 333KB of HTML, for decoration.
 *
 * Measured on the built site: invalidating a custom property on the orbit stage
 * cost 43–52ms of style and layout with the circles in the tree and 0.8ms with
 * them removed. The orbit hands off between cards four times as it scrolls, so
 * that is four dropped frames on a desktop and considerably worse on a phone,
 * in the section the page is built around.
 *
 * A dot is a filled subpath, so every dot at the same opacity can share one
 * <path>: the `d` below is the standard two-arc circle, drawn from the dot's
 * own centre. Opacity is what forces a split, so it is quantised — the dots are
 * 1.4–1.8px against a flat ground and a 5% step between them is not resolvable,
 * where the node it saves is.
 *
 * The <g> per band stays exactly as it was. It carries the entrance animation's
 * custom properties, and grouping happens inside it, so nothing about the
 * motion changes.
 */
const OPACITY_STEP = 0.05;

/*
 * One dot, as a subpath, written as small as it goes:
 *   · coordinates are relative to where the previous dot's arcs finished, so
 *     the numbers are short hops rather than absolute positions
 *   · one decimal — the viewBox is 300x400 drawn at 100-220px, where 0.1 of a
 *     unit is around a twentieth of a pixel
 *   · the second arc omits its `a`, which SVG reads as a repeat of the last
 *     command
 *   · `-` is its own separator, so the space before a negative number goes
 *
 * The arcs leave the pen at the dot's left edge (x - r, y), which is what the
 * next dot measures its hop from.
 */
function dotSubpath(dot: Dot, from: { x: number; y: number } | null) {
  const { x, y, r } = dot;
  const n = (v: number) => {
    const s = v.toFixed(1).replace(/\.0$/, "");
    return s.startsWith("0.") ? s.slice(1) : s.replace("-0.", "-.");
  };
  const gap = (v: number) => (v < 0 ? n(v) : ` ${n(v)}`);

  // Absolute for the first dot in a bucket, a relative hop for every one after.
  const move = from
    ? `m${n(x - r - from.x)}${gap(y - from.y)}`
    : `M${n(x)}${gap(y)}m${n(-r)} 0`;

  return `${move}a${n(r)}${gap(r)} 0 1 0${gap(r * 2)} 0${gap(r)}${gap(r)} 0 1 0${gap(-r * 2)} 0`;
}

/** A band's dots, bucketed by quantised opacity into one `d` string each. */
function bandPaths(dots: Dot[]) {
  const buckets = new Map<
    string,
    { parts: string[]; pen: { x: number; y: number } }
  >();

  for (const dot of dots) {
    const o = dot.o * falloff(dot.x, dot.y);
    // Below this it is a smudge that costs a node; drop it.
    if (o < 0.04) continue;

    const key = Math.min(1, Math.round(o / OPACITY_STEP) * OPACITY_STEP).toFixed(
      2,
    );
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.parts.push(dotSubpath(dot, bucket.pen));
    } else {
      buckets.set(key, { parts: [dotSubpath(dot, null)], pen: { x: 0, y: 0 } });
    }
    // Where the arcs left the pen, for the next dot in this bucket to hop from.
    const pen = buckets.get(key)!.pen;
    pen.x = dot.x - dot.r;
    pen.y = dot.y;
  }

  return [...buckets].map(([opacity, bucket]) => ({
    opacity,
    d: bucket.parts.join(""),
  }));
}

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
          {bandPaths(band.dots).map((p) => (
            <path key={p.opacity} d={p.d} opacity={p.opacity} />
          ))}
        </g>
      ))}
    </svg>
  );
}
