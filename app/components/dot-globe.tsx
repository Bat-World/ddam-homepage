"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

/**
 * The globe behind the hero — a dotted earth, slowly turning, with the places
 * DDAM works pinned on it.
 *
 * It replaced a rotating point cloud of a toono, and the swap is one of
 * meaning: an abstract cloud reads as decoration, whereas a named earth says
 * the thing this screen is for — a Mongolian consultancy inside a global
 * network. The pins are named for the same reason: three unexplained dots are
 * back to being decoration.
 *
 * Drawn by COBE (WebGL, ~3kB, MIT): the land mass ships as an embedded texture
 * and is sampled into a dot grid on the GPU, so the whole thing costs one
 * canvas and no network request — the same budget the old canvas ran on.
 *
 * Colour is tuned to sit *in* the background rather than on top of it. The
 * unlit sphere is pinned to `--color-bg-primary` and so is the glow, so there
 * is no halo ring cutting a disc out of the page; only the land dots and the
 * markers carry light.
 *
 * COBE v2 has no render loop of its own — `update()` draws exactly one frame —
 * so the rAF loop here is the thing that animates it. Two motions, both eased,
 * because a globe that snaps around under the cursor feels twitchy:
 *   · a constant slow rotation (one revolution ≈ 80s, as the old cloud turned)
 *   · a lean toward the pointer, in longitude and latitude
 *
 * The labels are DOM, not canvas, so they stay real text at real weights.
 * COBE v2 ships its own label mechanism but hangs it off CSS anchor
 * positioning, which no Safari or Firefox release supports yet; `project()`
 * below reproduces its projection instead, and the rAF loop drives the labels
 * from the same phi/theta it hands the globe.
 */

const TURN_RATE = 0.00013; // radians per ms — one revolution ≈ 80s
const LEAN_PHI = 0.3; // radians of pointer-driven yaw at the edge of the canvas
const LEAN_THETA = 0.16; // and of pitch, kept smaller — the poles distort fast
const EASE = 0.06; // per-frame approach to the pointer's target

/** Resting latitude: a little above the equator, so the northern land reads. */
const THETA = 0.3;
/**
 * Starting longitude, in radians.
 *
 * Chosen for one specific opening frame: the view centred on roughly 93°E,
 * which sets Ulaanbaatar just right of the middle with Tokyo beyond it, and
 * brings London onto the left limb at a shallow enough angle that its label is
 * present but recessed — just appearing, and rotating further into view rather
 * than out of it.
 *
 * That is as close as the geometry allows. London is 107° of longitude from
 * Ulaanbaatar and 140° from Tokyo, so a frame with the pair dead centre puts
 * London behind the globe outright, label and pin both.
 *
 * COBE's phi runs the other way to longitude: centre_lon° = 270 − phi·180/π.
 */
const PHI_START = 3.09;

/**
 * The pinned cities, `[latitude, longitude]`. Ulaanbaatar sits a shade larger:
 * it's the home office.
 *
 * Sizes are small on purpose — COBE's default marker is scaled for a diagram,
 * and past about 0.04 the pins stop reading as cities and start reading as a
 * fault in the render.
 *
 * Osaka was pinned here too and has been dropped. At this size it lands within
 * a marker's width of Tokyo, so the two labels collide, and a label that has
 * to dodge its neighbour is the vagueness this was meant to fix.
 */
const PLACES: { location: [number, number]; size: number; label: string }[] = [
  { location: [47.886, 106.906], size: 0.034, label: "Ulaanbaatar" },
  { location: [35.6762, 139.6503], size: 0.026, label: "Tokyo" },
  { location: [51.5072, -0.1276], size: 0.026, label: "London" },
];

/**
 * Radius the markers are drawn at, in COBE's units: its sphere is 0.8 across
 * the viewport, and markers stand off it by `markerElevation`, 0.05 by default.
 */
const MARKER_RADIUS = 0.85;

/**
 * COBE's own marker projection, reproduced. Returns the pin's position as a
 * fraction of the canvas box, plus its depth: +1 dead centre of the near face,
 * 0 at the limb, -1 directly behind the globe.
 */
function project(
  [lat, lon]: readonly [number, number],
  phi: number,
  theta: number,
) {
  const latR = (lat * Math.PI) / 180;
  const lonR = (lon * Math.PI) / 180 - Math.PI;
  const ring = Math.cos(latR) * MARKER_RADIUS;
  const vx = -ring * Math.cos(lonR);
  const vy = Math.sin(latR) * MARKER_RADIUS;
  const vz = ring * Math.sin(lonR);

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const sx = cosP * vx + sinP * vz;
  const sy = sinP * sinT * vx + cosT * vy - cosP * sinT * vz;
  const depth = -sinP * cosT * vx + sinT * vy + cosP * cosT * vz;

  return { x: (sx + 1) / 2, y: (-sy + 1) / 2, depth: depth / MARKER_RADIUS };
}

/**
 * Label opacity from that depth. It reaches full only well inside the near
 * face and is gone before the limb: a name sitting on the edge of the sphere
 * has nothing legible under it, and pops rather than turns away. The ramp is
 * shallow enough that a pin only part-way onto the near side still reads,
 * which is what makes the opening frame's London legible.
 */
/*
 * The globe dissolves downward rather than ending in a hard edge.
 *
 * Its densest, brightest band — the land mass around the equator — otherwise
 * lands directly under the largest type on the page, and dots and letterforms
 * at the same value shimmer against each other. Below that the sphere is a
 * large dark disc doing no work, cut off by the fold.
 *
 * Fading it out through the headline band fixes both, and reads as the globe
 * descending into the page rather than the type being stuck on top of it.
 * Full strength down to the label band, gone before the standfirst rule.
 */
const FADE =
  "linear-gradient(to bottom, #000 0%, #000 40%, rgba(0,0,0,0.45) 64%, rgba(0,0,0,0.12) 80%, transparent 92%)";

function facing(depth: number) {
  const t = (depth - 0.04) / 0.24;
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c); // smoothstep
}

export default function DotGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Pointer lean: the target the cursor implies, and the eased value drawn.
    // Both start at rest, so nothing moves until the cursor arrives.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    let phi = PHI_START;
    let last = 0;
    let frame = 0;
    let warmedAt = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.getBoundingClientRect().width;
    // COBE inserts a `position:relative` wrapper around the canvas at
    // construction (it hangs HTML marker labels off it), which then becomes
    // the canvas's containing block and swallows any positioning set on the
    // canvas itself. Hence the outer element this renders: the caller's
    // placement lives there, and the canvas simply fills it.
    const host = canvas.parentElement;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width,
      height: width, // the element is a square; COBE draws a centred sphere
      phi: PHI_START,
      theta: THETA,
      dark: 1,
      // Soft lighting. A strong diffuse term drops a bright terminator down one
      // side, which reads as a rendered 3D asset; this page wants a drawing.
      diffuse: 0.45,
      mapSamples: 22000,
      mapBrightness: 6.4,
      // Lifts the land on the unlit side just clear of black, so the sphere
      // reads as a globe rather than as a lit crescent. Small on purpose: this
      // raises the ocean grid too, and past ~0.05 the coastlines wash out and
      // the whole thing goes back to being an undifferentiated dot ball.
      mapBaseBrightness: 0.03,
      // Just off `--color-bg-primary` (#111) — the unlit ocean should be felt
      // as a sphere, not seen as a disc laid on the page.
      baseColor: [0.11, 0.11, 0.11],
      // `--color-red`, the one warm accent in the palette.
      markerColor: [0.929, 0.427, 0.251],
      // Pinned to the background, so the limb fades out instead of glowing.
      glowColor: [0.067, 0.067, 0.067],
      markers: PLACES,
    });

    // Read once per resize rather than per frame: `project` returns fractions
    // of the box, and turning those into pixels is the only thing this is for.
    let box = width;

    const render = () => {
      const spin = phi + current.x * LEAN_PHI;
      const lean = THETA + current.y * LEAN_THETA;
      globe.update({ phi: spin, theta: lean });

      PLACES.forEach((place, i) => {
        const el = labelsRef.current[i];
        if (!el) return;
        const p = project(place.location, spin, lean);
        const shown = facing(p.depth);
        // Hidden outright once it has faded, so a label round the back is not
        // a transparent box sitting over the headline.
        el.style.visibility = shown < 0.01 ? "hidden" : "visible";
        el.style.opacity = String(shown);
        el.style.translate = `${p.x * box}px ${p.y * box}px`;
      });
    };

    const tick = (now: number) => {
      if (last) phi += (now - last) * TURN_RATE;
      last = now;

      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;

      render();
      frame = requestAnimationFrame(tick);
    };

    /*
     * COBE decodes its map texture asynchronously and offers no ready signal:
     * until it lands, every draw samples a 1×1 black placeholder. A single
     * draw can therefore land first and leave a blank sphere on the page for
     * good — which is exactly what a reduced-motion visitor would have got.
     *
     * So the still version is drawn repeatedly for a beat and then stopped.
     * It is the same frame each time — nothing moves, which is the whole point
     * of the preference — it just gets painted until the map is there to paint.
     */
    const WARMUP = 2000;
    const warm = (now: number) => {
      if (!warmedAt) warmedAt = now;
      render();
      if (now - warmedAt < WARMUP) frame = requestAnimationFrame(warm);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      warmedAt = 0;
      frame = requestAnimationFrame(reduced.matches ? warm : tick);
    };

    // COBE sizes the backing store at construction, so a resize has to hand it
    // the new dimensions; it applies them on the next `update`.
    const onResize = () => {
      const next = canvas.getBoundingClientRect().width;
      box = next;
      globe.update({ width: next, height: next });
      if (reduced.matches) start();
    };

    // The canvas is pointer-events:none so it never blocks the links over it —
    // the cursor is tracked on the window and mapped into canvas space instead.
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // -1 .. 1 across the canvas, clamped so a cursor far outside it doesn't
      // go on levering the globe over.
      target.x = clamp(
        (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      );
      target.y = clamp(
        (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
      );
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    reduced.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
      // `destroy` releases the GL resources but leaves that wrapper in the
      // tree. Unwinding it here matters under StrictMode's double-mount, which
      // would otherwise nest a second wrapper inside the first on every run.
      const injected = canvas.parentElement;
      if (host && injected && injected !== host) {
        host.append(canvas);
        injected.remove();
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      />

      {/*
        Labels sit above their pin rather than beside it. Beside means the text
        runs off the box on whichever side the pin is currently on, and the
        usual fix — flipping the label to the other side — flips it in full view
        at the middle of the sphere, which is worse than the overflow. Above
        costs half a label's width in either direction and never moves.

        Hidden below md: at phone width the globe is narrower than the labels
        would be, and most of it is behind the headline.
      */}
      {PLACES.map((place, i) => (
        <span
          key={place.label}
          ref={(el) => {
            labelsRef.current[i] = el;
          }}
          className="absolute top-0 left-0 z-10 hidden h-0 w-0 md:block"
          style={{ visibility: "hidden" }}
        >
          <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 whitespace-nowrap">
            <span className="font-mono text-[0.625rem] leading-none tracking-[0.18em] text-bg-secondary uppercase">
              {place.label}
            </span>
            <span className="h-3.5 w-px bg-mixed" />
          </span>
        </span>
      ))}
    </div>
  );
}
