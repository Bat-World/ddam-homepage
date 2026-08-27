"use client";

import { useEffect, useRef, useState } from "react";

import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Company history — the light break between the two dark bands of About and
 * News, so the page doesn't run five dark sections together in its lower half.
 *
 * Oldest first: 2018 at the top of the rail, today at the bottom. Scrolling
 * down runs forward through time, so the section is read the way it was lived
 * and the spine fills from the founding towards the present. The alternative —
 * newest first, to follow on from the current numbers in the section above —
 * puts the visitor's forward motion into reverse, and asks them to hold a
 * timeline upside down while they read it.
 *
 * Dates are printed as the operations team records them (`2026.04`), not
 * localised — this is a corporate register, and the dotted form is the one that
 * appears in the group's own materials.
 *
 * ── The mechanism ────────────────────────────────────────────────────────────
 *
 * Third use of the skeleton the service orbit and the work-environment reel
 * already share, and deliberately so: a tall track with a sticky stage pinned
 * inside it, scroll progress driving what the stage shows. A visitor who has
 * learned how this page moves twice should not have to learn it again.
 *
 * The split is the same one, and it is the whole reason this is cheap:
 *   · scroll progress, exact    -> where the rail sits (a custom property,
 *                                  written per frame, never through React)
 *   · scroll progress, rounded  -> which year is highlighted, and therefore
 *                                  which entry's copy and month are showing
 *                                  (one state value)
 *   · everything else           -> CSS, keyed off `data-active`
 *
 * So the rail glides continuously while the highlight, the month and the words
 * hand off in steps. The spine is the thing being scrubbed; the words are the
 * thing being read, and words that slide with the scroll can't be read at all.
 *
 * The stage shows the whole run at once rather than one year at a time — every
 * year on the spine, the one at centre at full size and full ink, its
 * neighbours scaled down and faded back. A visitor can see where they are in
 * the eight years without having scrolled through them, which is the thing a
 * one-at-a-time reel can't tell them.
 */

type Milestone = {
  /** `YYYY.MM`, or bare `YYYY` where the month isn't on record. */
  date: string;
  body: string;
};

const HISTORY: Milestone[] = [
  {
    date: "2026.04",
    body: "The company has tripled in size over three years, to approximately 150 employees. Management structure transitioned to an Executive Officers system.",
  },
  { date: "2025.09", body: "Global Division established." },
  { date: "2024.01", body: "Digital Marketing Division established." },
  {
    date: "2023.04",
    body: "Data Artist was integrated into Dentsu Digital Inc., and DDAM became a subsidiary of Dentsu Digital.",
  },
  {
    date: "2019",
    body: "Started providing AI services in areas beyond marketing — HR, education and others.",
  },
  {
    date: "2018.06",
    body: "Joined the dentsu group. Dentsu Data Artist Mongol established as an R&D development centre in Mongolia.",
  },
];

/**
 * `2026.04` -> year 2026, month 4. A bare `2019` yields a null month, which is
 * a year the calendar shows with no tick raised rather than a year it guesses a
 * month for — the record says "2019", and inventing January to give the graph
 * something to light would be the graph editing the history.
 */
function parseDate(date: string) {
  const [year, month] = date.split(".");
  return { year: Number(year), month: month ? Number(month) : null };
}

/**
 * One frame per calendar year, oldest first — starting at 2018, ending at now.
 *
 * Every year gets a frame, including the quiet ones. 2020, 2021 and 2022 carry
 * no milestone, and the tempting fix is to skip them so every stop has
 * something to say. That would make the rail lie: the section's headline is
 * "eight years", and a spine that steps from 2019 straight to 2023 shows four
 * of those years as one notch. The quiet years are the evidence for the claim,
 * so they sit on the spine like any other.
 *
 * What carries them is `entry`: a quiet year holds whichever milestone was last
 * shown, so the copy lane is never empty. Held in scroll order, which here is
 * also time order — scrolling down from 2019 into 2020 keeps 2019's words on
 * screen, because those are the words the visitor was just reading.
 *
 * The month is deliberately *not* stored here. It belongs to the entry being
 * read, not to the year under the highlight, so that the strip holds on 2019's
 * whole-year mark through the quiet years rather than going flat under text
 * that is still describing 2019.
 */
const FRAMES = (() => {
  const years = HISTORY.map((entry) => parseDate(entry.date).year);
  const newest = Math.max(...years);
  const oldest = Math.min(...years);

  /* HISTORY is written newest-first, so the oldest entry is the last one — and
     it is the one the first frame lands on. */
  let held = HISTORY.length - 1;

  return Array.from({ length: newest - oldest + 1 }, (_, i) => {
    const year = oldest + i;
    const index = HISTORY.findIndex(
      (entry) => parseDate(entry.date).year === year,
    );
    if (index !== -1) held = index;

    return { year, entry: held };
  });
})();

/**
 * Headcount, as a curve rather than a table — because a table is what the record
 * doesn't give us.
 *
 * Two figures are on record, both from this section's own copy: the company is
 * at "approximately 150 employees" as of 2026.04, and it "tripled in size over
 * three years" to get there. That fixes one value and one rate, which is exactly
 * enough to draw a compound curve back to the founding: 150 at 2026, 50 at 2023,
 * and ~8 at 2018 — a plausible opening size for an R&D centre, arrived at from
 * the company's own stated growth rather than from a number someone made up.
 *
 * Every value it produces is therefore an estimate, and the UI says so: the
 * figure is always prefixed "~", and the block is aria-hidden, because the
 * authoritative statement is the one written out in the 2026 entry beside it.
 *
 * If real per-year figures ever land, delete the curve and make this a lookup on
 * the year — nothing else in the component needs to change.
 */
const PRESENT_STAFF = 150;
const GREW_BY = 3;
const OVER_YEARS = 3;

/** Continuous in the scroll position, so the figure climbs rather than steps. */
function staffAt(position: number) {
  const yearsBack = FRAMES.length - 1 - position;
  return PRESENT_STAFF * GREW_BY ** (-yearsBack / OVER_YEARS);
}

/**
 * Month initials, in the register the rest of the page uses for micro-labels.
 * Ambiguous by design — J/F/M/A/M/J/J/A/S/O/N/D is a calendar's shorthand and
 * reads as one at this size, where "Jan Feb Mar" would need three times the
 * width and start competing with the numeral above it.
 */
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/**
 * Viewport heights of track per year. Far under the work-environment reel's
 * 80, for three reasons: a stop here is a numeral coming up to size rather than
 * a photograph to look at, there are nine of them against that reel's four, and
 * the rail shows its own progress — the spine fills as it goes and the years
 * ahead sit above the highlight — so it doesn't need the run a reel needs to
 * feel navigable. Nine years now cost the page a little over two screens of
 * scroll, where the header spread and the longer track together cost four.
 */
const YEAR_TRAVEL = 25;

/* The tail that holds on the last year, as a fraction of the track. Without it
   2026 lands exactly as the stage unpins and flicks past. */
const HOLD = 0.1;

export default function HistorySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let running = false;
    let last = "";
    let lastStaff = -1;

    const render = () => {
      const rect = track.getBoundingClientRect();
      /* Distance travelled through the pin: 0 the moment the stage sticks, 1
         when the track's bottom edge reaches the bottom of the screen. */
      const travel = rect.height - window.innerHeight;
      const scrolled =
        travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      // The years run out before the track does; the tail is the hold.
      const progress = Math.min(1, scrolled / (1 - HOLD));

      /* Position on the rail, in years. Spanning length - 1 rather than length
         is what makes the last year land exactly at the end of the run instead
         of half a step past it. */
      const position = progress * (FRAMES.length - 1);

      const value = position.toFixed(4);
      /* Only on a change — the rail holds still for the whole tail, and
         rewriting the properties every frame would re-composite it for nothing. */
      if (value !== last) {
        last = value;

        const rail = reelRef.current;
        const railFrame = frameRef.current;

        if (rail && railFrame) {
          /*
           * Where the rail has to sit, in pixels.
           *
           * The year being read wants to be at the middle of the frame, and for
           * most of the run it gets to be. At the two ends it can't: centring
           * 2018 means eight years' worth of nothing above it, and centring
           * 2026 the same below — which is exactly the blank the pinned stage
           * was supposed to remove. So the shift is clamped to the range that
           * keeps the rail covering the frame, and the highlight rides to the
           * top for the first years and to the bottom for the last ones.
           *
           * Measured rather than read from the custom properties: the step and
           * the lead-in are set in rem and change at the 1024px breakpoint, and
           * a component that re-derives them from the box it actually rendered
           * can't fall out of step with the stylesheet.
           */
          const first = rail.firstElementChild as HTMLElement | null;
          const step = first?.offsetHeight ?? 0;
          const leadIn = first?.offsetTop ?? 0;
          const railH = rail.offsetHeight;
          const frameH = railFrame.clientHeight;

          const centred = leadIn + position * step + step / 2 - frameH / 2;
          const shift = Math.min(
            Math.max(centred, 0),
            Math.max(0, railH - frameH),
          );

          rail.style.setProperty("--reel", value);
          rail.style.setProperty("--rail-shift", `${shift.toFixed(2)}px`);
        }

        /*
         * The headcount is written straight into the text node, deliberately
         * bypassing React.
         *
         * It has to change many times a second to read as counting rather than
         * stepping — that is the whole point of it — and routing that through
         * state would re-render six copy blocks and nine rail rows on every
         * frame of the run. It belongs in the same lane as `--reel`: continuous,
         * per-frame, and none of React's business. Guarded on the rounded value
         * so the DOM is touched only when the digits actually differ.
         */
        const staff = Math.round(staffAt(position));
        if (staff !== lastStaff) {
          lastStaff = staff;
          if (staffRef.current) staffRef.current.textContent = String(staff);
        }

        /* round(), not floor(): the year nearest the middle is the one being
           read, which is where the visitor is looking. floor() would hand the
           copy over as the next year starts to arrive. */
        setFrame(Math.round(position));
      }

      raf = requestAnimationFrame(render);
    };

    /* Only while the section is near the viewport — a per-frame rect read isn't
       free, and there is nothing to move off screen. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(render);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(track);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const active = FRAMES[frame]?.entry ?? 0;
  /* null where the record gives a bare year — the strip lights the whole row. */
  const activeMonth = parseDate(HISTORY[active].date).month;

  return (
    <section id="history" className="surface-lift bg-bg-4 text-text-primary">
      <div
        ref={trackRef}
        className="year-track relative"
        style={{ height: `${FRAMES.length * YEAR_TRAVEL + 25}svh` }}
      >
        {/*
          Everything the section has to say lives inside the pin — the standing
          header as well as the rail. This is the work-environment reel's
          arrangement, and it is here for the reason that file gives: left
          outside, the header is a screen of its own that the visitor scrolls
          past once and never sees again, and it opens a gap between itself and
          the stage below that reads as the section having started twice.
          Inside, the band is exactly one screen tall for its whole run and the
          scroll only ever advances the rail.

          The paragraph that used to stand beside the headline is gone. It said
          what the timeline says, one entry at a time and with dates on it — and
          a standing block of copy inside a pin is paid for once per screen and
          then again on every frame of the run.
        */}
        {/*
          Narrower than the 1600px every other band uses, and centred rather
          than run to the page's left edge.
 
          That looks like a break in the page's rhythm and isn't, because this
          band is pinned: it fills the screen alone for its whole run, so no
          other section's left edge is ever on screen beside it to be out of
          step with. What *is* on screen is a rail and a column of copy that
          together want about 800px — given 1600 they sat in the left half with
          half the screen empty beside them, which reads as a layout that lost
          its right-hand column rather than as a composition.
        */}
        <div className="year-stage sticky top-0 h-svh overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-[54rem] flex-col px-6 pt-24 pb-10 lg:pt-28 lg:pb-12">
            <Reveal className="shrink-0">
              <p
                data-reveal
                className="font-mono text-size2 tracking-[0.16em] uppercase"
              >
                History
              </p>
              <h2
                data-reveal
                style={stagger(1)}
                className="mt-4 font-display text-display-sm lg:mt-5 leading-[1.05] font-bold tracking-[-0.02em] uppercase"
              >
                Eight years,
                <br />
                three times the size.
              </h2>
            </Reveal>

            {/* The rail takes whatever the header leaves, so the stage fits the
                screen it's given rather than assuming a tall one. */}
            <div className="mt-6 grid min-h-0 flex-1 items-center gap-6 lg:mt-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
              {/*
                The rail. Time on the left, what happened on the right — a
                timeline reads "2026, and then this", not the other way round.
              */}
              <div
                ref={frameRef}
                className="year-rail-frame"
                style={
                  {
                    /* Steps, not years: the spine fill spans the gaps between
                       nodes, and there is one fewer of those than there are
                       years. */
                    "--rail-span": FRAMES.length - 1,
                  } as React.CSSProperties
                }
              >
                <div ref={reelRef} className="year-rail">
                  {FRAMES.map((yearFrame, i) => (
                    <div
                      key={yearFrame.year}
                      data-active={i === frame}
                      className="rail-row"
                    >
                      {/*
                        aria-hidden throughout: every date is already spoken in
                        the copy beside it, and a screen reader walking nine
                        year numerals would be reading the decoration rather
                        than the history.
                      */}
                      <span aria-hidden className="rail-node" />
                      <p aria-hidden className="rail-year">
                        {yearFrame.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/*
                  One strip for the whole run, so the lit month sinks and rises
                  rather than cutting. It reads off the entry rather than the
                  rail year — see FRAMES.
                */}
                <div aria-hidden className="month-strip">
                  {MONTHS.map((initial, month) => (
                    <div key={month} className="month-cell">
                      <span
                        className="month-tick"
                        data-lit={
                          activeMonth === month + 1
                            ? "true"
                            : activeMonth === null
                              ? "year"
                              : "false"
                        }
                      />
                      <span className="month-label">{initial}</span>
                    </div>
                  ))}
                </div>

                {/*
                  aria-hidden as a whole: this figure is interpolated, and the
                  number a screen reader should hear is the one written out in
                  the 2026 entry. A count that ticks several times a second
                  would also be read as a stream of interruptions.
                */}
                <div aria-hidden className="mt-6 lg:mt-9">
                  <p className="font-mono text-size2 tracking-[0.16em] uppercase opacity-60">
                    Staff
                  </p>
                  <p className="staff-count mt-3">
                    <span className="staff-approx">~</span>
                    <span ref={staffRef}>{Math.round(staffAt(0))}</span>
                  </p>
                </div>

                {/*
                  The entries stack in one grid cell rather than being absolutely
                  positioned, so the column still takes the height of the longest
                  one and the block doesn't resize as they hand off.
                */}
                <div className="era-stack relative mt-6 grid lg:mt-8">
                  {HISTORY.map((entry, i) => (
                    <div
                      key={entry.date}
                      data-active={i === active}
                      data-side={
                        i < active ? "past" : i > active ? "ahead" : "here"
                      }
                      className="zone-copy era-copy col-start-1 row-start-1 self-start"
                    >
                      <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-70">
                        {entry.date}
                      </p>
                      <p className="mt-5 max-w-[46ch] text-lead leading-[1.6]">
                        {entry.body}
                      </p>
                    </div>
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
