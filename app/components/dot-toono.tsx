"use client";

import { useEffect, useRef } from "react";

/**
 * The toono behind the hero — the wooden crown at the top of a ger — as a
 * slowly turning cloud of points, reactive to the pointer.
 *
 * It replaced a plain sphere, and the reasons are worth keeping. A sphere of
 * evenly scattered points looks identical from every angle, so rotating it
 * shows nothing and it reads flat however many points you spend on it. The
 * toono has structure — a hoop, bars, a knot, a fan of roof poles — and
 * structure is what turning reveals.
 *
 * It also means something here. It's the roof crown of the ger standing in
 * DDAM's own office, it's the smoke hole and the only light source of a
 * dwelling, and it is a hub with everything converging on it — which is the
 * shape of the work: many inputs, one centre.
 *
 * Drawn on a canvas because ~1500 nodes as DOM/SVG elements would cost a
 * layout pass per frame. Depth drives radius and alpha, which is what makes an
 * unshaded point cloud read as a solid object rather than a sticker.
 *
 * Two pointer effects, both eased rather than applied raw — a cursor that
 * snaps the whole cloud around feels twitchy:
 *   · the crown leans toward the pointer (parallax tilt)
 *   · points near the cursor are pushed outward, and settle back when it leaves
 */

const TURN_RATE = 0.00013; // radians per ms — one revolution ≈ 80s

/*
 * Resting lean, in radians — close to a quarter turn, so the crown is seen very
 * nearly face-on.
 *
 * This is the view that matters: a toono is the thing you look straight up at
 * from inside the ger, and that is the only angle at which it reads as a wheel
 * rather than as a disc. Anywhere near the shallow lean a sphere can afford,
 * the circle foreshortens into a thin ellipse and the whole thing looks like a
 * flying saucer. Short of a true quarter turn, though — dead-on, every point
 * shares a depth and the shading that gives the cloud its body goes flat.
 */
const TILT = 1.22;
/* Kept small for the same reason: the pointer may tip the crown, but not past
   face-on, or it turns inside out. */
const LEAN = 0.16;
const PUSH_RADIUS = 0.22; // fraction of canvas width
const PUSH_STRENGTH = 26; // px at the cursor's centre
const EASE = 0.08; // per-frame approach to the pointer's target

/* ---------------------------------------------------------------- geometry */

/*
 * Built from a photograph of a real crown, and the proportions are the whole
 * point. A toono is sparse inside and dense outside: a heavy timber hoop, a few
 * straight bars across it, a knot at the middle — and then the uni, forty-odd
 * roof poles fanning out and down from the hoop and running off past the frame.
 *
 * Getting that backwards is what makes it a dartboard. An earlier cut of this
 * had sixteen ribs crowded inside the ring and stubs outside, which is a wheel,
 * or a radar sweep, or a target — anything but the thing you look up at.
 */

/** Radius of the timber hoop, as a fraction of the drawing radius. Small, so
    there is room outside it for the fan that does the real work. */
const HOOP = 0.5;
/** How far past the hoop the roof poles run. Past 1 on purpose — they leave the
    frame rather than stopping in mid-air, which is what they do in a ger. */
const UNI_REACH = 1.14;
/** Roof poles. */
const UNI = 52;
/** Straight bars across the hoop — four, as a cross, as in the photograph. */
const BARS = 4;

/*
 * Heights, in drawing radii. Negative is up: canvas y runs downward, so the
 * crown has to sit above the rim of the roof for this to read as looking up
 * from inside rather than down onto a bowl.
 *
 * The near-face-on lean maps y almost entirely onto depth, which is what makes
 * this the load-bearing part of the geometry rather than a detail: the poles
 * descending toward the viewer is what gives the fan its weight and leaves the
 * centre of the crown quiet — behind the headline, where quiet is wanted.
 */
const CROWN_Y = -0.1;
const CENTRE_Y = -0.2;
const EAVE_Y = 0.42;

type Point = { x: number; y: number; z: number };

/** A hoop of `count` points at radius `r` and height `y`. */
function ring(r: number, y: number, count: number, offset = 0): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const theta = offset + (i / count) * Math.PI * 2;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

function toono(): Point[] {
  const pts: Point[] = [];

  /* The hoop, doubled a hair apart. A single circle of points is a hairline;
     two read as a piece of timber, which is what it is. */
  pts.push(...ring(HOOP, CROWN_Y, 210));
  pts.push(...ring(HOOP * 0.94, CROWN_Y, 198, Math.PI / 210));

  /* The uni. Each pole leaves the hoop and descends to the eave, so the fan
     comes toward the viewer as it spreads — the geometry of standing under it. */
  const PER_UNI = 18;
  for (let i = 0; i < UNI; i++) {
    /* Offset by half a pole, so no pole lies along a bar. Where they line up
       the two draw one unbroken spoke from the knot to the edge of the frame,
       and the hoop stops looking like a thing the poles are seated into. */
    const theta = ((i + 0.5) / UNI) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    for (let j = 0; j < PER_UNI; j++) {
      const t = j / (PER_UNI - 1);
      const r = HOOP + (UNI_REACH - HOOP) * t;
      pts.push({ x: cos * r, y: CROWN_Y + (EAVE_Y - CROWN_Y) * t, z: sin * r });
    }
  }

  /* The bars across the hoop, and the knot they meet at — four overlapping
     loops, the ulzii the crown is finished with. Sparse by design: everything
     inside the hoop sits directly behind the headline.
     The loops sit a little further out than they are wide, so they cross each
     other and leave the middle open — four rings piled on one point is a blot,
     not a knot. */
  const KNOT_R = 0.1;
  const KNOT_AT = 0.132;
  for (let b = 0; b < BARS; b++) {
    const theta = (b / BARS) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    for (let j = 0; j <= 15; j++) {
      const inner = KNOT_AT + KNOT_R;
      const r = inner + (HOOP - inner) * (j / 15);
      const t = (r - inner) / (HOOP - inner);
      pts.push({
        x: cos * r,
        y: CENTRE_Y + (CROWN_Y - CENTRE_Y) * t,
        z: sin * r,
      });
    }

    // One loop of the knot, centred a radius out along this bar's direction.
    for (let k = 0; k < 34; k++) {
      const a = (k / 34) * Math.PI * 2;
      pts.push({
        x: cos * KNOT_AT + Math.cos(a) * KNOT_R,
        y: CENTRE_Y,
        z: sin * KNOT_AT + Math.sin(a) * KNOT_R,
      });
    }
  }

  return pts;
}

export default function DotToono({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = toono();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let angle = 0;
    let last = 0;

    // CSS pixels, read once per resize — the canvas backing store is scaled by
    // DPR on top of this so the dots stay crisp on retina.
    let size = 0;

    // Pointer position in canvas space, and the eased value actually drawn.
    // Both start off-canvas so nothing reacts until the cursor arrives.
    const target = { x: 0, y: 0, active: 0 };
    const current = { x: 0, y: 0, active: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      size = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      // Resizing the backing store resets every context property, so the
      // transform and fill have to be re-applied here, not once at setup.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#dadada";
    };

    const draw = () => {
      const half = size / 2;
      const radius = half * 0.86;
      const pushRadius = size * PUSH_RADIUS;

      // Lean toward the cursor, scaled by how far it is from centre.
      const leanX = ((current.y - half) / half) * LEAN * current.active;
      const leanY = ((current.x - half) / half) * LEAN * current.active;

      const spin = angle + leanY;
      const lean = TILT + leanX;
      const sinA = Math.sin(spin);
      const cosA = Math.cos(spin);
      const sinT = Math.sin(lean);
      const cosT = Math.cos(lean);

      ctx.clearRect(0, 0, size, size);

      for (const p of points) {
        // spin about Y, then lean about X
        const x = p.x * cosA + p.z * sinA;
        const zSpun = p.z * cosA - p.x * sinA;
        const y = p.y * cosT - zSpun * sinT;
        const z = zSpun * cosT + p.y * sinT;

        // z runs -1 (far) .. 1 (near)
        const depth = (z + 1) / 2;
        const scale = 0.82 + depth * 0.32; // mild perspective
        let px = half + x * radius * scale;
        let py = half + y * radius * scale;

        // Push out of the cursor's way. Falloff is squared so the edge of the
        // affected zone is soft and the displacement has no visible boundary.
        if (current.active > 0.01) {
          const dx = px - current.x;
          const dy = py - current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < pushRadius && dist > 0.001) {
            const falloff = 1 - dist / pushRadius;
            const shove = falloff * falloff * PUSH_STRENGTH * current.active;
            px += (dx / dist) * shove;
            py += (dy / dist) * shove;
          }
        }

        ctx.globalAlpha = 0.1 + depth * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 0.6 + depth * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (last) angle += (now - last) * TURN_RATE;
      last = now;

      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      current.active += (target.active - current.active) * EASE;

      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (reduced.matches) draw();
      else frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      if (reduced.matches) draw();
    };

    // The canvas itself is pointer-events:none so it never blocks the links
    // over it — the cursor is tracked on the window and mapped into canvas
    // space instead.
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const margin = rect.width * 0.25;
      const inside =
        x > -margin &&
        x < rect.width + margin &&
        y > -margin &&
        y < rect.height + margin;

      target.x = x;
      target.y = y;
      target.active = inside ? 1 : 0;
      // First contact shouldn't drag the cloud across the canvas from 0,0.
      if (inside && current.active === 0) {
        current.x = x;
        current.y = y;
      }
    };

    const onPointerLeave = () => {
      target.active = 0;
    };

    resize();
    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    reduced.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
