"use client";

import { useEffect, useId, useState } from "react";
import { LogoHalf, LogoSprite } from "./logo-mark";
import styles from "./launch-intro.module.css";

export const INTRO_SEEN_KEY = "ddam:intro-seen";

/**
 * Full-screen launch animation: the mark ignites, climbs away under constant
 * acceleration, splits down its midline, and the two halves peel apart as the
 * page opens along the same seam.
 *
 * This renders in the server HTML, so the CSS animation starts on the first
 * painted frame — it does not wait for hydration. React's only job here is to
 * drop the overlay out of the DOM once the animation reports it's finished.
 *
 * When the intro should be skipped (already played this session, or reduced
 * motion), the stylesheet hides the overlay outright — that has to happen in
 * CSS rather than here, because React can't unmount it until after the first
 * paint, which would flash the overlay.
 */
export default function LaunchIntro() {
  const [done, setDone] = useState(false);
  // useId() contains punctuation (":r0:" / "«r0»") that has no business in a
  // URL fragment, which is how <use href="#..."> resolves it.
  const spriteId = `ddam-mark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    // Mark it played, so a reload doesn't sit through the intro again.
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // private mode / storage disabled — the intro just replays, which is fine
    }
  }, []);

  if (done) return null;

  return (
    <div className={styles.overlay} aria-hidden="true">
      {/* the mark's path data, shipped once and referenced by both halves */}
      <LogoSprite id={spriteId} />

      <div className={`${styles.panel} ${styles.panelLeft}`} />
      <div
        className={`${styles.panel} ${styles.panelRight}`}
        // The right panel is the last thing to move, so its end = intro end.
        // Ignore the ::after glow, which finishes earlier but reports the
        // same target.
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !e.pseudoElement) setDone(true);
        }}
      />
      <div className={styles.seam} />

      <div className={styles.rocket}>
        <div className={styles.airframe}>
          <span className={styles.flare} />
          <span className={styles.trail} />
          <div className={`${styles.half} ${styles.halfLeft}`}>
            <LogoHalf spriteId={spriteId} />
          </div>
          <div className={`${styles.half} ${styles.halfRight}`}>
            <LogoHalf spriteId={spriteId} />
          </div>
        </div>
      </div>
    </div>
  );
}
