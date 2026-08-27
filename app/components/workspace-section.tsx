import DotArt from "./dot-art";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * The office, as a text-only tour.
 *
 * There is no photography in this system and none was supplied with the copy,
 * so the zones are set as a typographic list against a point field rather than
 * as a photo grid with placeholder boxes. If office photography lands later,
 * each zone is already its own block and takes an image without a rewrite.
 */

const PRINCIPLES = [
  "Tech expression",
  "Focus-friendly environment",
  "Multicultural integration",
  "Future architecture",
];

const ZONES = [
  {
    name: "Mongolian area",
    body: "Cultural heritage as a gateway for global collaboration — a Mongolian ger showcasing local culture.",
  },
  {
    name: "Japan area",
    body: "Japanese culture meeting a cyberpunk event space, with a “Great Wave” feature wall carrying an IT circuit pattern.",
  },
  {
    name: "AI studio",
    body: "The technology and AI lab: high-tech laboratories with advanced computing infrastructure and smart presentation suites for AI engineering.",
  },
  {
    name: "DDAM pub",
    body: "A classic British bar-style social lounge, for informal team syncs, casual relaxation and networking.",
  },
  {
    name: "Work space",
    body: "Open-work zones supporting daily work, teamwork, focus tasks and international meetings and events.",
  },
  {
    name: "Knowledge hub & library",
    body: "Deep work and continuous learning.",
  },
];

export default function WorkspaceSection() {
  return (
    <section id="workspace" className="bg-dark-gray">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        <Reveal className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              Work environment
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-8 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              A future-driven
              <br />
              workspace.
            </h2>
            <p
              data-reveal
              style={stagger(2)}
              className="mt-9 max-w-2xl text-lead leading-[1.65] text-light-gray"
            >
              Our workspace is a future-oriented model for an AI technology
              company: an optimal environment for international collaboration,
              where the interior combines culture and technology, protects
              focus, and keeps the atmosphere young and inventive.
            </p>

            <ul
              data-reveal
              style={stagger(3)}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
            >
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle}
                  className="font-mono text-size2 tracking-[0.1em] text-text-3 uppercase"
                >
                  {principle}
                </li>
              ))}
            </ul>

            <DotArt
              variant="lattice"
              className="dot-art-host mt-14 hidden w-full max-w-[360px] text-mixed lg:block"
            />
          </div>

          <dl className="border-t border-mixed/50">
            {ZONES.map((zone, i) => (
              <div
                key={zone.name}
                data-reveal
                style={stagger(i, 90)}
                className="border-b border-mixed/40 py-7"
              >
                <dt className="text-size7 text-bg-secondary">{zone.name}</dt>
                <dd className="mt-3 max-w-[58ch] leading-[1.7] text-light-gray">
                  {zone.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
