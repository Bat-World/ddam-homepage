import DotArt from "./dot-art";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Global reach + group network. One band, two halves: the reach statement with
 * a point-field standing in for the network graph, and the list of group
 * companies that backs the claim up.
 */

const OFFICES = [
  ["Ulaanbaatar", "Head office · delivery team"],
  ["Tokyo", "Dentsu Digital · parent company"],
  ["Global", "dentsu network · 100+ markets"],
];

const GROUP = [
  { name: "Dentsu Digital Inc.", note: "Parent company", href: "#network" },
  { name: "dentsu group", note: "Global network", href: "#network" },
  { name: "Data Artist Inc.", note: "AI practice", href: "#network" },
];

export default function NetworkSection() {
  return (
    <section className="bg-bg-primary">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              Global reach
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-8 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              One market.
              <br />
              One network behind it.
            </h2>

            <dl className="mt-12 border-t border-mixed/50">
              {OFFICES.map(([place, note], i) => (
                <div
                  key={place}
                  data-reveal
                  style={stagger(i + 2)}
                  className="flex flex-wrap items-baseline justify-between gap-4 border-b border-mixed/40 py-6"
                >
                  <dt className="text-size7 text-bg-secondary">{place}</dt>
                  <dd className="font-mono text-size2 tracking-[0.1em] text-text-3 uppercase">
                    {note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-14">
            <div
              data-reveal
              style={stagger(2)}
              className="dot-art-host mx-auto w-full max-w-[420px]"
            >
              <DotArt variant="burst" className="w-full text-mixed" />
            </div>

            <div>
              <p
                data-reveal
                style={stagger(3)}
                className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
              >
                Group network
              </p>
              <ul className="mt-6 border-t border-mixed/50">
                {GROUP.map((company, i) => (
                  <li key={company.name} data-reveal style={stagger(i + 4)}>
                    <a
                      href={company.href}
                      className="flex flex-wrap items-baseline justify-between gap-4 border-b border-mixed/40 py-6 transition-[padding,opacity] duration-500 hover:pl-3 hover:opacity-70"
                    >
                      <span className="text-size7 text-bg-secondary">
                        {company.name}
                      </span>
                      <span className="font-mono text-size2 tracking-[0.1em] text-text-3 uppercase">
                        {company.note} →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
