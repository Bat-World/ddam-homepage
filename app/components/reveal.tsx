"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal container.
 *
 * It observes itself and flips `data-revealed` once it enters the viewport;
 * the actual animation lives in globals.css and applies to any descendant
 * marked `data-reveal`. Keeping the transition in CSS means one observer per
 * block instead of one per line, and children stagger by setting their own
 * `--reveal-delay`.
 *
 * The observer disconnects after firing — these are entrances, not scroll
 * scrubs, and re-animating on the way back up reads as a glitch.
 *
 * Under `prefers-reduced-motion` the CSS never hides anything, so this becomes
 * an inert wrapper. With JS off entirely, the <noscript> rule in the layout
 * unhides everything.
 */
export default function Reveal({
  children,
  className = "",
  /** Fires earlier/later relative to the viewport bottom. */
  rootMargin = "0px 0px -12% 0px",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} data-revealed={revealed} className={className} {...rest}>
      {children}
    </div>
  );
}
