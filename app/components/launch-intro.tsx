"use client";

import { useEffect, useId, useState } from "react";
import { LogoHalf, LogoSprite } from "./logo-mark";
import styles from "./launch-intro.module.css";

export const INTRO_SEEN_KEY = "ddam:intro-seen";

/**
 * Put on <html> the moment the intro is over — finished, skipped, or never
 * played. globals.css holds the hero's reveals until it appears, so they don't
 * animate behind a closed door.
 */
export const INTRO_DONE_CLASS = "intro-done";

/**
 * Put on <html> to release the intro from its held first frame. The stylesheet
 * starts every animation in the overlay paused, because a CSS animation runs on
 * the document timeline whether or not frames are being painted: on a cold load
 * the main thread is blocked long enough that the sequence would be most of the
 * way through before its first painted frame.
 */
export const INTRO_GO_CLASS = "intro-go";

/**
 * Hard cap on how long the intro is held. Whatever the page is still doing at
 * this point, it has had long enough — better a janky launch than a visitor
 * sitting in front of a closed door.
 */
const HOLD_LIMIT_MS = 1600;

/** Telemetry readouts, stepped one line at a time by the CSS. */
const COUNTDOWN = ["T-00:03", "T-00:02", "T-00:01", "Liftoff", "Ascent"];

/**
 * Full-screen launch animation: the mark ignites, climbs away under constant
 * acceleration, splits down its midline, and the two halves peel apart as the
 * page opens along the same seam.
 *
 * This renders in the server HTML, so the closed doors are up from the first
 * painted frame. React's job is to release the sequence once the page is in a
 * state to paint it (see INTRO_GO_CLASS), to drop the overlay out of the DOM
 * once the animation reports it's finished, to release the hero's reveals at
 * the same moment, and to let the visitor cut it short.
 *
 * When the intro should be skipped (already played this session, or reduced
 * motion), the stylesheet hides the overlay outright — that has to happen in
 * CSS rather than here, because React can't unmount it until after the first
 * paint, which would flash the overlay.
 */
export default function LaunchIntro() {
  const [done, setDone] = useState(false);
  const [skipping, setSkipping] = useState(false);
  // useId() contains punctuation (":r0:" / "«r0»") that has no business in a
  // URL fragment, which is how <use href="#..."> resolves it.
  const spriteId = `ddam-mark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Start the sequence once the page can actually paint it. Mounting is the
  // signal that matters — it means hydration is done, which is the work that
  // was eating the animation — and the two frames after it confirm the main
  // thread is handing frames back before the timeline starts running.
  useEffect(() => {
    const start = () => document.documentElement.classList.add(INTRO_GO_CLASS);

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(start);
    });

    // The fonts land in the HUD; swapping them mid-launch is a visible reflow.
    // Raced against the cap rather than awaited, so a slow or failed font
    // request can't hold the door shut.
    const cap = setTimeout(start, HOLD_LIMIT_MS);
    document.fonts?.ready.then(start).catch(() => {});

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    // Mark it played, so a reload doesn't sit through the intro again.
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // private mode / storage disabled — the intro just replays, which is fine
    }
  }, []);

  // Any deliberate input cuts the intro. The overlay itself can't catch these:
  // it's pointer-events: none so the page underneath stays live, and a wheel or
  // key never targets it anyway — hence window.
  useEffect(() => {
    if (skipping) return;
    // Nothing to cut short when the stylesheet has hidden the overlay outright.
    // Worth checking rather than skipping harmlessly: a skip on a display:none
    // element gets no animationend, so it would never unmount and the listeners
    // would sit on window for the rest of the session.
    if (
      document.documentElement.classList.contains("intro-seen") ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const skip = () => setSkipping(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };

    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", onKey);
    };
  }, [skipping]);

  // Released as the seam parts — or immediately on a skip, so the hero comes in
  // under the fading overlay rather than after it.
  useEffect(() => {
    if (!done && !skipping) return;
    // INTRO_GO too: a skip during the held frame animates skipOut, which would
    // stay paused and so never report its end — leaving the overlay mounted
    // over a live page.
    document.documentElement.classList.add(INTRO_DONE_CLASS, INTRO_GO_CLASS);
  }, [done, skipping]);

  if (done) return null;

  return (
    <div
      className={`${styles.overlay} ${skipping ? styles.skip : ""}`}
      // The noscript stylesheet in the layout drops the overlay on this: with
      // no JS nothing ever unpauses it, so it would sit closed over the page.
      data-launch-intro=""
      aria-hidden="true"
      // On a skip this element is the one animating, so it reports the end.
      onAnimationEnd={(e) => {
        if (skipping && e.target === e.currentTarget) setDone(true);
      }}
    >
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

      {/* everything in shot: the push-in and the shakes move this whole box */}
      <div className={styles.camera}>
        <div className={styles.sky}>
          <span className={`${styles.starLayer} ${styles.starsFar}`} />
          <span className={`${styles.starLayer} ${styles.starsMid}`} />
          <span className={`${styles.starLayer} ${styles.starsNear}`} />
        </div>
        <div className={styles.vignette} />

        {/* stays on the ground while the vehicle leaves */}
        <div className={styles.pad}>
          <span className={styles.padFlash} />
          <span className={`${styles.padDust} ${styles.padDustLeft}`} />
          <span className={`${styles.padDust} ${styles.padDustRight}`} />
        </div>

        <div className={styles.rocket}>
          <div className={styles.airframe}>
            <span className={styles.flare} />
            <span className={styles.plume} />
            <span className={styles.trail} />
            {/* separation charge — behind the halves, so they read against it */}
            <span className={styles.flash} />
            <div className={`${styles.half} ${styles.halfLeft}`}>
              <LogoHalf spriteId={spriteId} />
            </div>
            <div className={`${styles.half} ${styles.halfRight}`}>
              <LogoHalf spriteId={spriteId} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.hud}>
        <div className={styles.hudBlock}>
          <span className={styles.hudLabel}>ddam // launch sequence</span>
          <span className={styles.count}>
            <span className={styles.countStrip}>
              {COUNTDOWN.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </span>
        </div>
        <div className={`${styles.hudBlock} ${styles.hudRight}`}>
          <span className={styles.hudLabel}>altitude</span>
          <span className={styles.gauge} />
        </div>
      </div>
    </div>
  );
}
