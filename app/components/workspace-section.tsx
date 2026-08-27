"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import aiStudio from "@/public/office/ai-studio.webp";
import japanArea from "@/public/office/japan-area.webp";
import knowledgeHub from "@/public/office/knowledge-hub.webp";
import workSpace from "@/public/office/work-space.webp";

import Reveal from "./reveal";

/**
 * The office, as one scroll-driven reel.
 *
 * Same skeleton as the service orbit, and deliberately so: a tall track with a
 * sticky stage pinned inside it, scroll progress driving which zone is showing.
 * A visitor who has learned how this page moves once should not have to learn
 * it again.
 *
 * The stage is a column of photographs beside a column of copy. The photographs
 * ride a reel that travels continuously with the scroll, so the neighbours sit
 * above and below the one at centre and slide through it rather than cutting;
 * the copy crossfades in steps, on the zone nearest the middle.
 *
 * The split is the orbit's:
 *   · scroll progress, rounded  -> which caption is showing (one state value)
 *   · scroll progress, exact    -> where the reel sits (a custom property,
 *                                  written per frame, never through React)
 *   · everything else           -> CSS, keyed off `data-active`
 *
 * Colour is the reel's one signal. Every photograph is desaturated except the
 * one at centre, which comes up to full colour as it arrives. A grid of
 * saturated interiors fights itself and the rest of the page — one at a time,
 * with grey ghosts above and below it, doesn't, and the return of colour is
 * what marks the zone you're actually being shown. To hold the whole reel
 * monochrome instead, drop the `[data-active="true"]` filter rule.
 */

type Zone = {
  name: string;
  body: string;
  image: StaticImageData;
  /** Describes the room, not the label beside it — the caption is already text. */
  alt: string;
};

/*
 * Four zones, because there are four photographs.
 *
 * The Mongolian area and the DDAM pub are real rooms with copy already written
 * for them, but no picture in the supplied set — and in a reel whose whole
 * mechanism is one photograph at a time, a zone with nothing to show is a hole
 * in the run, not a shorter list. They come back the moment their photography
 * does: the copy is in git and `mongolian-area.webp` is still in public/office.
 */
const ZONES: Zone[] = [
  {
    name: "Work space",
    body: "Open-work zones supporting daily work, teamwork, focus tasks and international meetings and events.",
    image: workSpace,
    alt: "An open-plan floor of white bench desks under circular acoustic ceiling discs and linear lighting.",
  },
  {
    name: "Japan area",
    body: "Japanese culture meeting a cyberpunk event space, with a “Great Wave” feature wall carrying an IT circuit pattern.",
    image: japanArea,
    alt: "An event space with blue neon tracing a circuit pattern across the ceiling, a projection screen, and graphic murals either side.",
  },
  {
    name: "AI studio",
    body: "The technology and AI lab: high-tech laboratories with advanced computing infrastructure and smart presentation suites for AI engineering.",
    image: aiStudio,
    alt: "A black meeting room lit by linear track lighting, with a long pale table and an illuminated chrome figure on the far wall.",
  },
  {
    name: "Knowledge hub & library",
    body: "Deep work and continuous learning.",
    image: knowledgeHub,
    alt: "A library wall of arched alcoves holding books and patterned panels, with a red telephone box at one end.",
  },
];

/**
 * Viewport heights of track per zone. A little under the orbit's 100, because a
 * zone is a photograph and a line of copy rather than a paragraph to read. It
 * was lower still at six zones, where the orbit's pace would have made this one
 * band out-scroll every other section on the page; at four there's room to let
 * each photograph hold.
 */
const ZONE_TRAVEL = 80;

/* The tail that holds on the last zone, as a fraction of the track. Without it
   the sixth photograph lands exactly as the stage unpins and flicks past. */
const HOLD = 0.12;

export default function WorkspaceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let running = false;
    let last = "";

    const render = () => {
      const rect = track.getBoundingClientRect();
      /* Distance travelled through the pin: 0 the moment the stage sticks, 1
         when the track's bottom edge reaches the bottom of the screen. */
      const travel = rect.height - window.innerHeight;
      const scrolled =
        travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      // The zones run out before the track does; the tail is the hold.
      const progress = Math.min(1, scrolled / (1 - HOLD));

      /* Position on the reel, in zones. Spanning count - 1 rather than count is
         what makes the last photograph land dead centre at the end of the run
         instead of half a frame past it. */
      const position = progress * (ZONES.length - 1);

      const value = position.toFixed(4);
      /* Only on a change — the reel holds still for the whole tail, and
         rewriting the property every frame would re-composite it for nothing. */
      if (value !== last) {
        last = value;
        reelRef.current?.style.setProperty("--reel", value);
        /* round(), not floor(): the caption belongs to whichever photograph is
           nearest the middle of the frame, which is where the visitor is
           looking. floor() would hand it over as the next one starts to enter. */
        setActive(Math.round(position));
      }

      frame = requestAnimationFrame(render);
    };

    /* Only while the section is near the viewport — a per-frame rect read
       isn't free, and there is nothing to move off screen. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) frame = requestAnimationFrame(render);
        else cancelAnimationFrame(frame);
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(track);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="workspace" className="surface-lift bg-dark-gray">
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${ZONES.length * ZONE_TRAVEL + 25}svh` }}
      >
        {/*
          Everything the section has to say lives inside the pin — the standing
          header as well as the reel. Left outside it, the header is a screen of
          its own that the visitor scrolls past once and never sees again, and
          it opens a gap between itself and the stage below that reads as the
          section having started twice. Inside, the band is exactly one screen
          tall for its whole run and the scroll only ever advances the reel.
        */}
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 pt-28 pb-12">
            {/*
              The section label, and nothing else. The headline and the
              paragraph that used to stand here said what the rooms say better,
              and they cost the reel the height it needed to show them — a
              standing block of copy inside a pin is paid for once per screen
              and then again on every frame of the run.
            */}
            <Reveal className="shrink-0">
              <p
                data-reveal
                className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
              >
                Work environment
              </p>
            </Reveal>

            {/* The reel takes whatever the header leaves, so the stage fits the
                screen it's given rather than assuming a tall one. */}
            <div className="mt-8 grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-2 lg:gap-20">
              {/*
                The captions stack in one grid cell rather than being absolutely
                positioned, so the column still takes the height of the longest
                one and the block doesn't resize as they hand off.
              */}
              <div className="relative grid">
                {ZONES.map((zone, i) => (
                  <div
                    key={zone.name}
                    data-active={i === active}
                    data-side={
                      i < active ? "past" : i > active ? "ahead" : "here"
                    }
                    className="zone-copy col-start-1 row-start-1 self-center"
                  >
                    <p className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(ZONES.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 font-display text-display-sm leading-[1.1] font-medium tracking-[-0.02em] text-balance text-brand-white uppercase">
                      {zone.name}
                    </h3>
                    <p className="mt-5 max-w-[42ch] leading-[1.65] text-light-gray">
                      {zone.body}
                    </p>
                  </div>
                ))}
              </div>

              {/*
              The reel. Its frame is masked top and bottom, so the neighbouring
              photographs dissolve at the edges instead of being cut off — which
              is what makes the column read as continuous rather than as a
              window with three pictures in it.
            */}
              <div className="zone-reel-frame">
                <div ref={reelRef} className="zone-reel">
                  {ZONES.map((zone, i) => (
                    <figure
                      key={zone.name}
                      data-active={i === active}
                      className="zone-frame"
                    >
                      <Image
                        src={zone.image}
                        alt={zone.alt}
                        placeholder="blur"
                        sizes="(min-width: 1024px) 45vw, 92vw"
                        className="zone-photo size-full object-cover"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
