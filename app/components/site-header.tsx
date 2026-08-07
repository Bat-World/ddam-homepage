"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./logo-mark";

/**
 * Site header, with three scroll-driven states.
 *
 *   · past a quarter viewport → collapses into a centred capsule
 *   · scrolling down past one full viewport → slides out of the way
 *   · scrolling back up → slides in again, anywhere on the page
 *
 * The wordmark and the icon are stacked inside one overflow-hidden box and the
 * pair slides vertically between them, rather than one fading out as the other
 * fades in — a crossfade reads as a swap, a slide reads as one object moving.
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

  return (
    <header
      data-scrolled={scrolled}
      data-hidden={hidden && !menuOpen}
      className="group fixed inset-x-0 top-0 z-50 px-6 pt-6 transition-[transform,padding] duration-500 ease-brand data-[hidden=true]:-translate-y-full data-[scrolled=true]:pt-3"
    >
      <div className="mx-auto flex w-full items-center justify-between gap-10 rounded-pill transition-all duration-500 ease-brand group-data-[scrolled=true]:w-fit group-data-[scrolled=true]:gap-8 group-data-[scrolled=true]:bg-dark-gray/85 group-data-[scrolled=true]:px-6 group-data-[scrolled=true]:py-3 group-data-[scrolled=true]:backdrop-blur-md">
        <a
          href="#top"
          aria-label="Dentsu Data Artist Mongol — home"
          className="relative block h-10 w-[190px] overflow-hidden transition-[width] duration-500 ease-brand group-data-[scrolled=true]:w-5"
        >
          <span className="absolute inset-0 flex items-center font-display text-size3 leading-[1.2] tracking-[0.16em] text-brand-white uppercase transition-transform duration-500 ease-brand group-data-[scrolled=true]:-translate-y-full">
            <span>
              Dentsu Data
              <br />
              <span className="font-bold">Artist Mongol</span>
            </span>
          </span>
          <span className="absolute inset-0 flex translate-y-full items-center transition-transform duration-500 ease-brand group-data-[scrolled=true]:translate-y-0">
            <LogoMark className="w-4 text-brand-white" />
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase transition-colors duration-300 hover:text-brand-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase md:hidden"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg-primary px-6 py-6 md:hidden">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase"
            >
              Close
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-display-sm tracking-tight text-brand-white uppercase"
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
