"use client";

import { useEffect, useId, useRef, useState } from "react";
import DotArt, { type DotArtVariant } from "./dot-art";
import { LOGO_HEIGHT, LOGO_PATHS, LOGO_WIDTH } from "./logo-mark";

/**
 * The four core practices, as one scroll-driven orbit.
 *
 * The section is a tall track — one viewport per practice — with a sticky stage
 * pinned inside it. Two dotted ellipses hang in the stage — a circle inside a
 * wide one, meeting at the top and bottom — with four copies of the company
 * mark drifting along the inner one, nose to the direction of travel; the copy
 * sits inside it and crossfades from one practice to the next as the track
 * scrolls past.
 *
 * Three things drive it, and they're deliberately split:
 *   · scroll progress          -> which practice is showing (one state value)
 *   · scroll progress + time   -> where the triangles sit (imperative, per frame)
 *   · everything about the crossfade -> CSS, keyed off `data-active`
 *
 * The marks never touch React state. Re-rendering four <g> elements at
 * 60fps to move them is pure waste, so the RAF loop writes their `transform`
 * attribute directly and React renders them once, at their starting angles.
 */

type Service = {
  title: [string, string];
  art: DotArtVariant;
  body: string;
};

const SERVICES: Service[] = [
  {
    title: ["AI Solution", "Development"],
    art: "lattice",
    body: "From use-case discovery to a model in production. Forecasting, personalisation, document intelligence and conversational systems — scoped against a decision your business already makes.",
  },
  {
    title: ["Data Engineering", "& Analytics"],
    art: "wave",
    body: "Pipelines, warehouses and governance that hold up under load. We make the data trustworthy first, then build the dashboards and measurement that leadership can act on.",
  },
  {
    title: ["Proof of Concept", "& R&D"],
    art: "burst",
    body: "Short, funded experiments that answer one question: is this worth building? A working prototype, an honest cost model, and a clear go or no-go at the end of it.",
  },
  {
    title: ["Digital", "Marketing"],
    art: "ribbon",
    body: "Performance, brand and CRM run on the same data spine as everything else — so audience, creative and spend are optimised against outcomes rather than platform metrics.",
  },
];

/* The tail of the track that holds on the last practice. Without it the fourth
   card arrives exactly as the stage unpins, so it flashes past unread. */
const HOLD = 0.12;

/**
 * Ring geometry, in CSS pixels, derived from the stage it has to sit in.
 *
 * The SVG's viewBox is the stage's own pixel box — one unit is one pixel — so
 * nothing is scaled to fit and the ellipses can't be squashed or cropped by the
 * viewport's aspect ratio. That's the whole reason this is measured rather than
 * a fixed coordinate system: a fixed box either letterboxes or crops, and both
 * change the shape of the rings as the window changes shape.
 *
 * Both rings share `ry`, deliberately: they meet at exactly the same top and
 * bottom point and open out from each other around the equator. Any tilt would
 * break that contact, so the pair sits square.
 */
function geometry(w: number, h: number) {
  /* Off the *smaller* axis, so the inner ring is a true circle at any ratio
     and always clears the viewport's top and bottom edges. */
  const ry = Math.min(h * 0.44, w * 0.42);
  return {
    ry,
    /* Round, unless the outer would otherwise sit on top of it on a narrow
       screen — then it opens just enough to stay a separate ring. */
    innerRx: ry,
    outerRx: Math.min(Math.max(ry * 1.2, w * 0.46), w * 0.48),
  };
}

/** Turns the triangles travel over one full pass of the section, from scroll. */
const SWEEP = 0.5;

/** Turns per minute of ambient drift, with the page held still. */
const DRIFT = 0.7;

/** Starting angle of each triangle, in turns. */
const SEEDS = [0.06, 0.31, 0.58, 0.83];

/**
 * Half the mark's height on the ring, in pixels. Larger than the plain triangle
 * this replaced needed: the mark has negative space between its wings and its
 * body, and below roughly this size that space closes up and it reads as a
 * blob rather than as the logo.
 */
const MARKER_SIZE = 15;

/*
 * The mark is drawn in its own 742x900 box with the origin at the top left, and
 * the transform below expects something centred on the origin and about two
 * units tall — the same footprint the plain triangle it replaces had. This
 * normalises one to the other, so `MARKER_SIZE` keeps meaning pixels.
 *
 * Read right to left, as SVG applies it: move the mark's centre onto the
 * origin, then shrink it to two units tall.
 */
const MARK_FIT = `scale(${(2 / LOGO_HEIGHT).toFixed(6)}) translate(${-LOGO_WIDTH / 2} ${-LOGO_HEIGHT / 2})`;

/**
 * Where a mark sits at `turn` around the inner ring, as an SVG transform.
 *
 * The rotation is the tangent's angle plus a quarter turn, because the mark is
 * drawn nose-up rather than along +x — so it flies along its path instead of
 * skating sideways.
 */
function markerTransform(rx: number, ry: number, turn: number) {
  const a = turn * Math.PI * 2;
  const x = Math.cos(a) * rx;
  const y = Math.sin(a) * ry;
  const heading =
    (Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) * 180) / Math.PI + 90;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${heading.toFixed(2)}) scale(${MARKER_SIZE})`;
}

export default function ServiceOrbit() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<(SVGGElement | null)[]>([]);
  // useId() carries punctuation that has no business in a URL fragment, which
  // is how <use href="#..."> resolves it.
  const markId = `ddam-orbit-mark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [active, setActive] = useState(0);

  /* The stage's pixel box. Null until it's been measured — the rings can't be
     drawn to a box we don't know yet, and guessing one only to correct it on
     mount would land a differently-shaped pair of ellipses for a frame. */
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  // The RAF loop needs the same numbers without waiting on a render.
  const geomRef = useRef(geometry(0, 0));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = (w: number, h: number) => {
      geomRef.current = geometry(w, h);
      setBox((prev) => (prev?.w === w && prev?.h === h ? prev : { w, h }));
    };

    /* Measured here and now, not left to the observer's first delivery: that
       arrives on a frame, and a tab opened in the background doesn't get one —
       the rings would simply be missing until the visitor looked at it. */
    const rect = stage.getBoundingClientRect();
    measure(rect.width, rect.height);

    const observer = new ResizeObserver(([entry]) => {
      measure(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let running = false;

    const render = (time: number) => {
      const rect = track.getBoundingClientRect();
      /* Distance travelled through the pin: 0 the moment the stage sticks, 1
         when the track's bottom edge reaches the bottom of the screen. */
      const travel = rect.height - window.innerHeight;
      const scrolled =
        travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      // The copy runs out before the track does; the tail is the hold.
      const progress = Math.min(1, scrolled / (1 - HOLD));

      /* floor(), not round(): each practice owns an equal slice of the track,
         and the first has to still be showing while the stage settles in. */
      setActive(
        Math.min(SERVICES.length - 1, Math.floor(progress * SERVICES.length)),
      );

      // Reduced motion still follows the scroll — that's the visitor's own
      // input. What it drops is the drift that happens on a still page.
      const minutes = reduced.matches ? 0 : time / 60000;

      const { innerRx, ry } = geomRef.current;
      SEEDS.forEach((seed, i) => {
        const node = markersRef.current[i];
        if (!node) return;
        const turn = seed + scrolled * SWEEP + minutes * DRIFT;
        node.setAttribute("transform", markerTransform(innerRx, ry, turn));
      });

      frame = requestAnimationFrame(render);
    };

    /* The loop only runs while the section is near the viewport. Off screen
       there is nothing to see drifting, and a per-frame rect read isn't free. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) frame = requestAnimationFrame(render);
        else cancelAnimationFrame(frame);
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(track);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const ring = box && geometry(box.w, box.h);

  return (
    <section
      id="services"
      data-anchor="flush"
      className="bg-bg-secondary text-text-primary"
    >
      <div
        ref={trackRef}
        className="orbit-track relative"
        style={{ height: `${SERVICES.length * 100 + 30}svh` }}
      >
        <div
          ref={stageRef}
          className="orbit-stage sticky top-0 flex h-svh items-center justify-center overflow-hidden"
        >
          {/* The viewBox is the stage's own pixel box, so nothing is scaled to
              fit and the rings keep their shape at every window size. */}
          {box && ring && (
            <svg
              viewBox={`0 0 ${box.w} ${box.h}`}
              className="orbit-rings absolute inset-0 h-full w-full"
              aria-hidden="true"
              focusable="false"
            >
              {/* One copy of the path data, referenced by all four markers. */}
              <defs>
                <g id={markId}>
                  {LOGO_PATHS.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              </defs>

              <g transform={`translate(${box.w / 2} ${box.h / 2})`}>
                {/*
                  A dotted stroke, not a dashed one: zero-length dashes under a
                  round cap render as circles the width of the stroke, which is
                  the same dot vocabulary the artwork is built from.
                */}
                <ellipse
                  rx={ring.outerRx}
                  ry={ring.ry}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeDasharray="0 9"
                  opacity="0.45"
                />
                <ellipse
                  rx={ring.innerRx}
                  ry={ring.ry}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeDasharray="0 9"
                  opacity="0.45"
                />
                {/* Marks ride the inner ring only — the outer is scenery. */}
                {SEEDS.map((seed, i) => (
                  <g
                    key={i}
                    ref={(node) => {
                      markersRef.current[i] = node;
                    }}
                    transform={markerTransform(ring.innerRx, ring.ry, seed)}
                  >
                    <use
                      href={`#${markId}`}
                      fill="currentColor"
                      transform={MARK_FIT}
                    />
                  </g>
                ))}
              </g>
            </svg>
          )}

          {/*
            The cards stack in one grid cell rather than being absolutely
            positioned, so the stage still takes the height of the tallest card
            and stays optically centred on it.
          */}
          <div className="orbit-stack relative grid px-6 text-center">
            {SERVICES.map((service, i) => (
              <article
                key={service.title.join(" ")}
                data-active={i === active}
                data-side={i < active ? "past" : i > active ? "ahead" : "here"}
                className="orbit-card dot-art-host col-start-1 row-start-1 flex max-w-[34rem] flex-col items-center justify-center"
              >
                <DotArt
                  variant={service.art}
                  className="h-[150px] w-auto opacity-75 md:h-[190px]"
                />

                <h3 className="mt-6 font-display text-size10 leading-[1.1] font-bold tracking-[-0.01em] text-balance uppercase md:text-[2.25rem]">
                  {service.title[0]}
                  <br />
                  {service.title[1]}
                </h3>

                {/*
                  Sentence case, not uppercase: this is the page's primary
                  persuasive copy at ~30 words, and uppercase flattens the word
                  shapes that make it scannable.
                */}
                <p className="mt-6 max-w-[40ch] font-mono text-size2 leading-[1.7] tracking-[0.05em]">
                  {service.body}
                </p>

                <p className="mt-8 font-mono text-size2 tracking-[0.12em] uppercase opacity-60">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(SERVICES.length).padStart(2, "0")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
