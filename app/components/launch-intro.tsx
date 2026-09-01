"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { LogoHalf, LogoSprite } from "./logo-mark";
import styles from "./launch-intro.module.css";

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
 * Spent for this document — set once the reader has left the homepage, or once
 * the sequence has finished, and never cleared.
 *
 * Module scope rather than state, because it has to outlive the component. The
 * root layout survives client-side navigation, so LaunchIntro is never
 * remounted — but it *re-renders* on every route change, and without this a
 * reader who left the homepage and came back would be handed the rocket a
 * second time, with the `done` state that ended the first one long gone.
 *
 * Note what does *not* set it: mounting. The gate below reads this during
 * render, so latching on mount meant any re-render inside the 2600ms — a dev
 * HMR update, a router refresh, anything that ticks the router context —
 * evaluated the gate again, found the flag true, and pulled the overlay out
 * from under a rocket that was still climbing. Latching only on the two events
 * that genuinely end the run leaves the run itself immune to re-renders.
 */
let introConsumed = false;

/**
 * Should this document run the sequence?
 *
 * One reason not to, now: the visitor has asked for less motion. There used to
 * be a second — "this session has already seen it", held in sessionStorage —
 * and it is gone deliberately. The intro is the site's front door and it is
 * meant to play whenever the door is opened, refresh included; a reload that
 * skipped it made the entrance feel broken rather than considerate.
 *
 * What replaces it is narrower and is the thing that was actually wanted: the
 * sequence is per *document*, not per session. A reload opens a new document
 * and plays; a client-side navigation does not and never will (see the gate).
 *
 * Client-only — every caller reads it during a client render or later.
 */
function shouldPlayIntro() {
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hard cap on how long the intro is held. Whatever the page is still doing at
 * this point, it has had long enough — better a janky launch than a visitor
 * sitting in front of a closed door.
 */
const HOLD_LIMIT_MS = 1600;

/** Telemetry readouts, stepped one line at a time by the CSS. */
const COUNTDOWN = ["T-00:03", "T-00:02", "T-00:01", "Liftoff", "Ascent"];

/**
 * The front door, and only the front door.
 *
 * This renders from the root layout, so before this gate it was mounted on
 * every route — which meant a reader who followed "read the message" got the
 * whole 2600ms rocket in front of a president's letter, and anyone sent a
 * `/leadership` or `/news/…` link opened the site on a launch sequence with no
 * homepage behind it. An entrance shown on arrival is a brand moment; the same
 * entrance shown on the third page of a visit is an interruption.
 *
 * Three conditions, and they are not interchangeable:
 *
 *   · `entryPath` — the path this *document* loaded on, captured once. This is
 *     what makes the intro an arrival rather than a route: a reader who lands
 *     on /leadership never gets it, on that page or on any page after it.
 *   · `pathname` — the path right now. Leaving the homepage takes the overlay
 *     off screen rather than letting it keep playing over another route.
 *   · `introConsumed` — spent. Without it, coming back to the homepage would
 *     mount a fresh sequence with the `done` state of the last one long gone.
 *
 * Every hook the sequence owns lives in LaunchSequence rather than here, so on
 * any other route nothing runs at all — no listeners left on window, no classes
 * written to <html> for a sequence that was never going to play.
 */
export default function LaunchIntro() {
  const pathname = usePathname();
  const [entryPath] = useState(pathname);

  // Leaving the homepage spends the intro for the rest of this document, so
  // coming back to it client-side gets the page and not a second launch. An
  // effect rather than a render-time write: this must not fire while the
  // sequence is still on screen, and during the run the pathname does not move.
  useEffect(() => {
    if (pathname !== "/") introConsumed = true;
  }, [pathname]);

  if (entryPath !== "/" || pathname !== "/" || introConsumed) return null;

  return <LaunchSequence />;
}

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
 * One case is skipped outright: reduced motion. There the stylesheet hides the
 * overlay before the first paint — it has to happen in CSS rather than here,
 * because React cannot unmount anything until after that paint — and this
 * component only tidies up after it. Everything else plays.
 */
function LaunchSequence() {
  const [done, setDone] = useState(false);
  const [skipping, setSkipping] = useState(false);
  /**
   * Whether this document plays the sequence at all.
   *
   * Read during the first render rather than in an effect, so that every effect
   * below keys off one reading taken at one moment, instead of each re-deriving
   * it and possibly disagreeing.
   *
   * On the server it resolves to false and is never read, because every effect
   * that consults it is client-only. It changes nothing about what is rendered
   * — the markup is identical either way — so there is no hydration mismatch
   * to answer for.
   */
  const [playing] = useState(
    () => typeof window !== "undefined" && shouldPlayIntro(),
  );
  // useId() contains punctuation (":r0:" / "«r0»") that has no business in a
  // URL fragment, which is how <use href="#..."> resolves it.
  const spriteId = `ddam-mark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Start the sequence once the page can actually paint it. Mounting is the
  // signal that matters — it means hydration is done, which is the work that
  // was eating the animation — and the two frames after it confirm the main
  // thread is handing frames back before the timeline starts running.
  useEffect(() => {
    if (!playing) return;

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
  }, [playing]);

  useEffect(() => {
    if (playing) return;

    /*
     * Reduced motion. The stylesheet has already hidden the overlay before the
     * first paint, so nothing is on screen; what is left is making sure nothing
     * else waits on it.
     *
     * INTRO_DONE releases the hero's reveals, which would otherwise sit out a
     * 1500ms handoff for a door that is never going to open. The latch spends
     * the intro so the gate refuses it from here on.
     *
     * The overlay stays mounted and inert rather than unmounted, because
     * unmounting means setState in an effect and a second render for something
     * `display: none` has already settled. Nothing was ever unpaused — INTRO_GO
     * is added only on the playing path above.
     */
    introConsumed = true;
    document.documentElement.classList.add(INTRO_DONE_CLASS);
  }, [playing]);

  // Any deliberate input cuts the intro. The overlay itself can't catch these:
  // it's pointer-events: none so the page underneath stays live, and a wheel or
  // key never targets it anyway — hence window.
  useEffect(() => {
    // Nothing to cut short on the path that never plays: a skip animates
    // skipOut on an element that is already unmounting, gets no animationend,
    // and would leave these listeners on window for the rest of the session.
    if (!playing || skipping) return;

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
  }, [playing, skipping]);

  // Released as the seam parts — or immediately on a skip, so the hero comes in
  // under the fading overlay rather than after it.
  useEffect(() => {
    if (!done && !skipping) return;

    // Over — so the gate may now refuse it, and a client-side return to the
    // homepage gets nothing rather than a second launch.
    introConsumed = true;

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
