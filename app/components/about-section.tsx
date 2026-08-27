import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * About: the subsidiary advantage, the bench in numbers, the technical core,
 * and the corporate data table required for compliance — kept as a definition
 * list so it stays readable as a stacked column on narrow screens.
 *
 * Separate Reveals rather than one, so each block starts its entrance when it
 * reaches the fold instead of all of them firing off the section top.
 *
 * Every figure below is the operations team's own, and they are stated exactly
 * as given — no rounding up, no "+" on a number that didn't carry one. If a
 * figure moves, it moves here and nowhere else on the page.
 */

const METRICS = [
  { value: "150", label: "Staff members" },
  { value: "32%", label: "Seniority level" },
  { value: "68%", label: "Junior level" },
  { value: "70%", label: "Japanese proficiency" },
  { value: "90%", label: "English proficiency" },
  { value: "+", label: "Other languages on the bench" },
];

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

const PROFILE = [
  ["Company", "Dentsu Data Artist Mongol LLC"],
  ["Headquarters", "Ulaanbaatar, Mongolia"],
  ["Parent company", "Dentsu Digital Inc."],
  ["Network", "dentsu group"],
  ["Practices", "AI · Data · PoC & R&D · Digital marketing"],
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-bg-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        <Reveal>
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            About us
          </p>

          <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-20">
            <h2
              data-reveal
              style={stagger(1)}
              className="font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              A local team with
              <br />a global backbone.
            </h2>

            <div className="border-t border-mixed/60 pt-6">
              <p
                data-reveal
                style={stagger(2)}
                className="max-w-2xl text-lead leading-[1.65] text-light-gray"
              >
                As a subsidiary of Dentsu Digital, we bring methods proven
                across the dentsu network into the Mongolian market — and adapt
                them to the data, languages and regulations that actually apply
                here. The result is enterprise-grade practice without the
                distance.
              </p>
              <div data-reveal style={stagger(3)}>
                <BracketLink
                  href="#contact"
                  className="mt-9 -ml-2 text-bg-secondary"
                >
                  Meet the team
                </BracketLink>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------- the bench */}
        <Reveal className="mt-24">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            Growth, talent and language
          </p>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-mixed/40 bg-mixed/40 sm:grid-cols-3">
            {METRICS.map((metric, i) => (
              <div
                key={metric.label}
                data-reveal
                style={stagger(i, 100)}
                className="bg-bg-primary px-8 py-12"
              >
                <dt className="font-display text-display-sm leading-none text-brand-white">
                  {metric.value}
                </dt>
                <dd className="mt-5 max-w-[24ch] font-mono text-size2 leading-[1.7] tracking-[0.05em] text-text-3 uppercase">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ----------------------------------------------- the technical core */}
        <Reveal className="mt-20">
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

        {/* -------------------------------------------------- corporate data */}
        <Reveal className="mt-24 max-w-4xl border-t border-mixed/60">
          {PROFILE.map(([term, value], i) => (
            <dl
              key={term}
              data-reveal
              style={stagger(i, 70)}
              className="grid gap-2 border-b border-mixed/40 py-6 sm:grid-cols-[220px_1fr] sm:gap-8"
            >
              <dt className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase">
                {term}
              </dt>
              <dd className="text-size6 text-bg-secondary">{value}</dd>
            </dl>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
