import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * The digital marketing practice in detail: the four BPO operations the team
 * runs for advertisers, and the four-year arc from launch to today.
 *
 * It sits directly under the service orbit, which introduces digital marketing
 * in one paragraph — this is the band that backs that paragraph up, so it
 * stays adjacent rather than filed under About.
 */

const OPERATIONS = [
  {
    name: "Client acquisition",
    body: "Front-end support for competitive pitches — proposals and simulations.",
  },
  {
    name: "Campaign management",
    body: "Running campaigns through their flight: efficiency work and real-time adjustment.",
  },
  {
    name: "Submission materials",
    body: "Ad placements in media, plus creative and material management. A core operation, and one that demands extremely high accuracy.",
  },
  {
    name: "Reporting",
    body: "Campaign performance reporting for advertisers — the phase operations launched on.",
  },
];

const MILESTONES = [
  { year: "2023", body: "Organisational launch planning" },
  { year: "2024", body: "Operational launch · organisational expansion" },
  { year: "2025", body: "AI and automation implementation" },
  { year: "2026", body: "Productivity improvement — 80% report automation" },
];

export default function BpoSection() {
  return (
    <section id="bpo" className="bg-bg-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              Digital marketing · BPO
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-7 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              The operation
              <br />
              behind the campaign.
            </h2>
          </div>

          <div className="border-t border-mixed/60 pt-6">
            <p
              data-reveal
              style={stagger(2)}
              className="max-w-2xl text-lead leading-[1.65] text-light-gray"
            >
              Operations began with reporting as the first phase, with the aim
              of building a structure capable of handling large-scale demand,
              securing the resources it needs, and improving productivity
              through DDAM&apos;s AI and engineering expertise.
            </p>
          </div>
        </Reveal>

        {/* --------------------------------------------------- the operations */}
        <Reveal className="mt-20 grid gap-px border border-mixed/40 bg-mixed/40 sm:grid-cols-2 lg:grid-cols-4">
          {OPERATIONS.map((op, i) => (
            <article
              key={op.name}
              data-reveal
              style={stagger(i, 110)}
              className="flex flex-col bg-bg-primary px-8 py-10"
            >
              <p className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(OPERATIONS.length).padStart(2, "0")}
              </p>
              <h3 className="mt-7 font-display text-size8 leading-[1.25] font-medium text-brand-white uppercase">
                {op.name}
              </h3>
              <p className="mt-5 max-w-[34ch] leading-[1.65] text-light-gray">
                {op.body}
              </p>
            </article>
          ))}
        </Reveal>

        {/*
          Launch to now. Horizontal at lg — the year row reads as a track with
          the entries hanging off it, which is the shape of the deck's own
          timeline — and it stacks into a plain list below that, where four
          columns would leave three words per line.
        */}
        <Reveal className="mt-20">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            Progress from launch to the present
          </p>
          <ol className="mt-8 grid border-t border-mixed/60 lg:grid-cols-4">
            {MILESTONES.map((milestone, i) => (
              <li
                key={milestone.year}
                data-reveal
                style={stagger(i, 110)}
                className="border-b border-mixed/40 py-7 lg:border-b-0 lg:border-l lg:border-mixed/40 lg:px-7 lg:first:border-l-0 lg:first:pl-0"
              >
                <p className="font-display text-size10 leading-none text-brand-white">
                  {milestone.year}
                </p>
                <p className="mt-4 max-w-[30ch] font-mono text-size2 leading-[1.7] tracking-[0.05em] text-text-3 uppercase">
                  {milestone.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
