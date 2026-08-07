"use client";

import { useEffect, useRef } from "react";

/**
 * Slowly rotating sphere of points behind the hero, reactive to the pointer.
 *
 * Points are placed with the Fibonacci lattice (golden-angle spiral) rather
 * than a lat/long grid — a lat/long grid crowds at the poles and the clumping
 * is very visible once the thing turns.
 *
 * Drawn on a canvas because ~1400 nodes as DOM/SVG elements would cost a
 * layout pass per frame. Depth drives radius and alpha, which is what makes an
 * unshaded point cloud read as a solid volume.
 *
 * Two pointer effects, both eased rather than applied raw — a cursor that
 * snaps the whole cloud around feels twitchy:
 *   · the sphere leans toward the pointer (parallax tilt)
 *   · points near the cursor are pushed outward, and settle back when it leaves
 */

const COUNT = 1400;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const TURN_RATE = 0.00013; // radians per ms — one revolution ≈ 80s
const TILT = 0.42; // radians, resting x-axis lean
const LEAN = 0.3; // how far the pointer can lean the sphere, radians
const PUSH_RADIUS = 0.22; // fraction of canvas width
const PUSH_STRENGTH = 26; // px at the cursor's centre
const EASE = 0.08; // per-frame approach to the pointer's target

type Point = { x: number; y: number; z: number };

function sphere(): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < COUNT; i++) {
    // y walks the poles linearly; the ring radius follows from it.
    const y = 1 - (i / (COUNT - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * GOLDEN_ANGLE;
    pts.push({ x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring });
  }
  return pts;
}

export default function DotSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = sphere();
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
