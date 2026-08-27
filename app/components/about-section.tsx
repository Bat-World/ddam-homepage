import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * About: one claim, then the three things that evidence it — what the team can
 * build, where it sits, and what stands behind it.
 *
 * This absorbed the separate "Global reach" band, which was making the same
 * argument a second time. Both opened on a headline saying the company is local
 * and globally backed, and between them the same four facts were stated twice:
 * the parent company, the group, the head office and the practice list. Two
 * bands, one point, and a reader who has to notice they are not new facts.
 *
 * What each surviving block is for, so nothing creeps back in:
 *   · CORE    — capability, in technical terms. The only place on the page that
 *               says *how* the work is built rather than what is sold.
 *   · OFFICES — the geography behind "global backbone".
 *   · GROUP   — the corporate line behind it.
 *
 * Deleted with the merge, and where each fact lives now:
 *   · Company        -> the footer's copyright line, which is its proper home
 *   · Headquarters   -> the Ulaanbaatar row below
 *   · Parent company -> the Dentsu Digital row below
 *   · Network        -> the dentsu group row below
 *   · Practices      -> ServiceOrbit, which gives all four in full
 *
 * Separate Reveals rather than one, so each block starts its entrance when it
 * reaches the fold instead of all of them firing off the section top.
 */

const CORE = [
  {
    name: "AI & data",
    body: "Machine learning on a robust data analytics foundation.",
  },
  {
    name: "Cloud native",
    body: "Scalable backend for global bridge operations.",
  },
  {
    name: "Agile PoC",
    body: "Rapid prototyping without platform lock.",
  },
];

const OFFICES = [
  ["Ulaanbaatar", "Head office · delivery team"],
  ["Tokyo", "Dentsu Digital · parent company"],
  ["Global", "dentsu network · 100+ markets"],
];

/*
 * Plain rows, not links. These were anchors pointing at `#network` — the id of
 * the section they were already inside — so all three arrows offered to take
 * the reader somewhere and then did nothing. A row that states a fact is
 * honest; a link that goes nowhere is not. They can become outbound links the
 * day someone confirms the destinations.
 */
const GROUP = [
  ["Dentsu Digital Inc.", "Parent company"],
  ["dentsu group", "Global network"],
  ["Data Artist Inc.", "AI practice"],
];

/** The two fact lists are the same object, so they are built by the same code. */
function FactList({
  label,
  rows,
}: {
  label: string;
  rows: readonly (readonly [string, string])[] | string[][];
}) {
  return (
    <div>
      <p
        data-reveal
        className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
      >
        {label}
      </p>
      <dl className="mt-8 border-t border-mixed/60">
        {rows.map(([term, note], i) => (
          <div
            key={term}
            data-reveal
            style={stagger(i + 1, 90)}
            className="flex flex-wrap items-baseline justify-between gap-4 border-b border-mixed/40 py-6"
          >
            <dt className="text-size7 text-bg-secondary">{term}</dt>
            {/* `basis-full` until sm: left to `flex-wrap`, a short term keeps
                its caption inline while a long one pushes it to the next line,
                so the same list reads two different ways down its own length. */}
            <dd className="basis-full font-mono text-size2 tracking-[0.1em] text-text-3 uppercase sm:basis-auto">
              {note}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="surface-lift bg-bg-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        <Reveal>
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            About us
          </p>

          {/*
            The headline stands alone — no supporting paragraph, and so no
            two-column grid to hold one. Everything below it is the evidence,
            which is what lets the claim stay a claim.
          */}
          <h2
            data-reveal
            style={stagger(1)}
            className="mt-8 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
          >
            A local team with
            <br />a global backbone.
          </h2>
        </Reveal>

        {/* ----------------------------------------------- the technical core */}
        <Reveal className="mt-24">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            Technical core & expertise
          </p>
          <div className="mt-8 grid border-t border-mixed/60 md:grid-cols-3">
            {CORE.map((entry, i) => (
              <div
                key={entry.name}
                data-reveal
                style={stagger(i, 110)}
                className="border-b border-mixed/40 py-7 md:border-b-0 md:border-l md:border-mixed/40 md:px-7 md:first:border-l-0 md:first:pl-0"
              >
                <h3 className="font-display text-size8 leading-[1.25] font-medium text-brand-white uppercase">
                  {entry.name}
                </h3>
                <p className="mt-4 max-w-[32ch] leading-[1.65] text-light-gray">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/*
          The two fact lists run side by side rather than stacked. They are the
          same shape — a name against a mono caption — so pairing them reads as
          one statement about where the company sits, and it keeps the tail of
          the section from becoming three identical rulings in a column.
        */}
        <div className="mt-24 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <FactList label="Global reach" rows={OFFICES} />
          </Reveal>
          <Reveal>
            <FactList label="Group network" rows={GROUP} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
