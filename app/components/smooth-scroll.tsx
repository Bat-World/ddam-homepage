"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide scroll smoothing — the free equivalent of the reference's GSAP
 * ScrollSmoother. Wheel and trackpad input drives an eased virtual scroll
 * rather than jumping the document, which is most of what makes that site feel
 * weighted rather than snappy.
 *
 * Renders nothing; it only owns the RAF loop and the anchor handler.
 *
 * Two things have to cooperate with it:
 *   · `scroll-behavior: smooth` in CSS fights Lenis for control, so it's
 *     switched off for as long as Lenis is running (and restored on teardown,
 *     which matters in dev where this remounts on every edit).
 *   · in-page anchors are handled here instead of natively, so they ease with
 *     the same curve and clear the fixed header.
 */

/** Matches the [id] scroll-margin in globals.css — clears the fixed header. */
const HEADER_OFFSET = -96;

export default function SmoothScroll() {
  useEffect(() => {
    // Someone who asked for less motion did not ask for scroll inertia.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.1,
      // Exponential ease-out: fast pickup, long settle — the "weighted" part.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      // Let modified clicks (new tab, download, …) behave normally.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;

      const anchor = (e.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: HEADER_OFFSET });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
