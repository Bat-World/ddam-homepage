import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * About: the subsidiary advantage, the scale of the specialist bench, and the
 * corporate data table required for compliance — kept as a definition list so
 * it stays readable as a stacked column on narrow screens.
 *
 * Three separate Reveals rather than one, so each block starts its entrance
 * when it reaches the fold instead of all three firing off the section top.
 */

const STATS = [
  { value: "160+", label: "Specialists across AI, data and marketing" },
  { value: "01", label: "Dentsu Digital subsidiary in Mongolia" },
  { value: "04", label: "Practices under one delivery team" },
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
              <br />
              a global backbone.
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
          <dl className="grid gap-px overflow-hidden rounded-md border border-mixed/40 bg-mixed/40 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                data-reveal
                style={stagger(i, 120)}
                className="bg-bg-primary px-8 py-12"
              >
                <dt className="font-display text-display-sm leading-none text-brand-white">
                  {stat.value}
                </dt>
                <dd className="mt-5 max-w-[24ch] font-mono text-size2 leading-[1.7] tracking-[0.05em] text-text-3 uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
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
