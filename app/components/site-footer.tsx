import LogoMark from "./logo-mark";
import Reveal from "./reveal";
import { stagger } from "./stagger";

const COLUMNS = [
  {
    heading: "Services",
    links: [
      ["AI solution development", "#services"],
      ["Data engineering & analytics", "#services"],
      ["Proof of concept & R&D", "#services"],
      ["Digital marketing", "#services"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About us", "#about"],
      ["History", "#history"],
      ["News", "#news"],
      ["Careers", "#careers"],
      ["Culture", "#culture"],
      ["Work environment", "#workspace"],
      ["Contact", "#contact"],
    ],
  },
  {
    heading: "Legal",
    links: [
      ["Privacy policy", "#privacy"],
      ["Cookie policy", "#cookies"],
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="surface-lift border-t border-mixed/50 bg-brand-black">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
          <div data-reveal>
            <LogoMark className="w-9 text-brand-white" />
            <p className="mt-7 font-display text-size3 leading-[1.5] tracking-[0.16em] text-brand-white uppercase">
              Dentsu Data
              <br />
              <span className="font-bold">Artist Mongol</span>
            </p>
            <p className="mt-5 max-w-xs font-mono text-size1 leading-[1.7] tracking-[0.05em] text-text-3 uppercase">
              AI, data and marketing consultancy. Ulaanbaatar, Mongolia.
            </p>
          </div>

          {COLUMNS.map((column, i) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              data-reveal
              style={stagger(i + 1)}
            >
              <p className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase">
                {column.heading}
              </p>
              <ul className="mt-6 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="hover-mark hover-mark-flush text-size3 text-bg-secondary transition-opacity hover:opacity-70"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-mixed/40 pt-8 font-mono text-size1 tracking-[0.12em] text-text-3 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Dentsu Data Artist Mongol LLC. All
            rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-mixed/60" />
            Made by Bat-Erdene.D
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
