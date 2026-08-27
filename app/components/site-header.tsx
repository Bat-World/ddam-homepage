"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import LogoMark from "./logo-mark";

/**
 * Site header, with three scroll-driven states.
 *
 *   · past a quarter viewport → collapses into a centred capsule
 *   · scrolling down past one full viewport → slides out of the way
 *   · scrolling back up → slides in again, anywhere on the page
 *
 * The name shows at rest and gives way to the mark as the bar closes; the
 * sequencing that keeps that clean is described at the anchor itself.
 *
 * The capsule closes on `flex-grow`, not on `width`. `width: fit-content` is
 * not an interpolable value, so a `w-full` -> `w-fit` transition snaps to the
 * end on the first frame while the padding, background and blur next to it ease
 * over half a second — which is what made the collapse look broken. Instead the
 * bar keeps a full-width rail and three flex-grow factors cross over inside it:
 * the two edge spacers grow 0 -> 1 while the capsule itself goes 1 -> 0, so the
 * capsule gives up its free space continuously and ends up hugging its content,
 * centred. flex-grow is a number, and numbers interpolate.
 *
 * State lives as `data-scrolled` / `data-hidden` on the <header> so descendants
 * pick it up through `group-data-*` and all the geometry stays in the markup.
 */

const NAV = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "News", href: "#news" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

/** Scroll distance that has to accumulate before the bar hides or returns. */
const THRESHOLD = 50;

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const viewport = window.innerHeight;

      setScrolled(y > viewport / 4);

      // Only start hiding once past the hero — the bar disappearing while
      // you're still reading the opening screen is disorienting.
      if (y > viewport) {
        const delta = y - lastY.current;
        if (delta > THRESHOLD) setHidden(true);
        else if (delta < -THRESHOLD) setHidden(false);
        if (Math.abs(delta) > THRESHOLD) lastY.current = y;
      } else {
        setHidden(false);
        lastY.current = y;
      }
    };

    onScroll(); // a restored scroll position starts mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The overlay covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // The overlay is `md:hidden`, so crossing into desktop hides it visually while
  // React still thinks it's open — leaving the scroll lock on and the page
  // frozen with nothing left on screen to close. Close it on the breakpoint.
  // Only the `change` event is needed: the trigger is `md:hidden` too, so the
  // menu can never have been opened at desktop width in the first place.
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 48rem)");
    desktop.addEventListener("change", closeMenu);
    return () => desktop.removeEventListener("change", closeMenu);
  }, [menuOpen, closeMenu]);

  /*
   * Modal keyboard contract: Escape closes, Tab cycles within the panel, focus
   * enters on Close (first in DOM order) and returns to the Menu trigger on
   * close — so a keyboard visitor can't tab out of an overlay that still
   * covers the page, or lose their place when it dismisses.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    // Captured now: by cleanup time the ref may already point elsewhere.
    const trigger = triggerRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      data-scrolled={scrolled}
      data-hidden={hidden && !menuOpen}
      className="group fixed inset-x-0 top-0 z-50 px-6 pt-6 transition-[translate,padding] duration-500 ease-brand data-[hidden=true]:-translate-y-full data-[scrolled=true]:pt-3"
    >
      {/* The rail is always the full width; only the share of it the capsule
          takes changes. */}
      <div className="flex w-full items-center">
        <span
          aria-hidden="true"
          className="w-0 grow-0 transition-[flex-grow] duration-500 ease-brand group-data-[scrolled=true]:grow"
        />

        <div className="flex grow items-center rounded-pill transition-all duration-500 ease-brand group-data-[scrolled=true]:grow-0 group-data-[scrolled=true]:bg-dark-gray/85 group-data-[scrolled=true]:px-6 group-data-[scrolled=true]:py-3 group-data-[scrolled=true]:backdrop-blur-md">
          {/*
            Wordmark at rest, mark once the bar closes — swapped as a sequence,
            not a slide. The two used to travel through a shared 40px window in
            opposite directions, which meant the middle of every transition
            showed the bottom half of the name stacked on the top half of the
            mark, in a box that was simultaneously narrowing to 20px and so
            cropping the name to two letters. Read as a broken glyph, not a swap.

            Here nothing is ever half-visible: the outgoing layer fades out, the
            box then resizes, and only then does the incoming layer fade in. The
            delays are mirrored between the two states, so it sequences the same
            way opening as closing. Both layers are absolutely positioned in the
            same box, so neither reserves space for the other.
          */}
          <a
            href="#top"
            aria-label="Dentsu Data Artist Mongol — home"
            className="relative block h-10 w-[190px] shrink-0 overflow-hidden transition-[width,height] delay-150 duration-300 ease-brand group-data-[scrolled=true]:h-7 group-data-[scrolled=true]:w-6"
          >
            <span className="absolute inset-0 flex items-center font-display text-size3 leading-[1.2] tracking-[0.16em] text-brand-white uppercase transition-opacity delay-[400ms] duration-150 group-data-[scrolled=true]:opacity-0 group-data-[scrolled=true]:delay-0 group-data-[scrolled=true]:duration-150">
              <span>
                Dentsu Data
                <br />
                <span className="font-bold">Artist Mongol</span>
              </span>
            </span>

            {/* Sized once, at the height it's actually seen — it only ever
                appears in the closed state. */}
            <span className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 group-data-[scrolled=true]:opacity-100 group-data-[scrolled=true]:delay-300 group-data-[scrolled=true]:duration-200">
              <LogoMark className="h-7 w-auto text-brand-white" />
            </span>
          </a>

          {/* What used to be `justify-between`. Its 2rem floor is the gap the
            closed capsule keeps between the mark and the links. */}
          <span
            aria-hidden="true"
            className="w-8 grow transition-[flex-grow] duration-500 ease-brand group-data-[scrolled=true]:grow-0"
          />

          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover-mark font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase transition-colors duration-300 hover:text-brand-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-haspopup="dialog"
            className="hover-mark font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase md:hidden"
          >
            Menu
          </button>
        </div>

        <span
          aria-hidden="true"
          className="w-0 grow-0 transition-[flex-grow] duration-500 ease-brand group-data-[scrolled=true]:grow"
        />
      </div>

      {menuOpen && (
        <div
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-bg-primary px-6 py-6 md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeMenu}
              className="hover-mark font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase"
            >
              Close
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="hover-mark font-display text-display-sm tracking-tight text-brand-white uppercase"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
