"use client";

import { useEffect, useRef } from "react";

/**
 * The light half of the page opening as the dark hero leaves.
 *
 * The hero is not pinned. It was, briefly, and it was wrong: with the hero held
 * still, the panel's rising edge cuts across a stationary headline and slices it
 * in half on the way past. The hero scrolls away like anything else; all this
 * adds is the horizontal reveal.
 *
 * The panel opens left to right as it climbs, its right edge exposing the dark
 * behind it until the sweep closes. That's one number — how far the panel's top
 * edge has travelled up the viewport — written to a custom property and turned
 * into a clip by the stylesheet. It stays out of React state for the same reason
 * the orbit's markers do: re-rendering a whole section at 60fps to move one edge
 * is waste.
 *
 * With no JS, or under reduced motion, `--rise` is never set and the panel's
 * clip resolves to nothing — the section simply arrives full width.
 */

/**
 * Fraction of the climb the sweep is given. Well short of 1: the panel should
 * be whole for the last part of its travel, or it reads as still arriving when
 * it's already most of the way up the screen.
 */
const SWEEP_AT = 0.55;

export default function RisePanel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let running = false;
    let last = "";

    const render = () => {
      const { top } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* 0 when the panel's top edge is at the bottom of the screen, 1 when it
         reaches the top. Goes past 1 and negative off either end; the clamp
         below is what matters. */
      const climbed = vh > 0 ? (vh - top) / vh : 1;
      const sweep = Math.min(1, Math.max(0, climbed / SWEEP_AT));
      const value = sweep.toFixed(4);
      /* Only on a change. Once the sweep has landed it sits at 1 for the rest
         of the section's time on screen, and rewriting the property every frame
         would re-clip a full-viewport element for nothing. */
      if (value !== last) {
        last = value;
        el.style.setProperty("--rise", value);
      }
      frame = requestAnimationFrame(render);
    };

    /* Only while it's near the screen — the same gate the orbit uses, and for
       the same reason: a per-frame rect read isn't free. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) frame = requestAnimationFrame(render);
        else cancelAnimationFrame(frame);
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="rise-panel">
      {children}
    </div>
  );
}
