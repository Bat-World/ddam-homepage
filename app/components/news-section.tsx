import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Latest updates. Static placeholder entries for now — swap NEWS for whatever
 * the CMS/feed returns; the row markup only needs date, kicker and title.
 */

const NEWS = [
  {
    date: "2026-07-22",
    kicker: "Press release",
    title:
      "Dentsu Data Artist Mongol expands its data engineering practice for enterprise clients",
    href: "#news",
  },
  {
    date: "2026-06-10",
    kicker: "Insight",
    title:
      "What a proof of concept should actually prove — a field guide for first AI projects",
    href: "#news",
  },
  {
    date: "2026-05-28",
    kicker: "Event",
    title:
      "Inside the dentsu network: shared methods, local delivery, measurable outcomes",
    href: "#news",
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="surface-lift bg-dark-gray">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            Latest updates
          </p>
          <a
            data-reveal
            href="#news"
            className="hover-mark hover-mark-flush font-mono text-size2 tracking-[0.16em] text-bg-secondary uppercase"
          >
            All news →
          </a>
        </div>

        <ul className="mt-12 border-t border-mixed/50">
          {NEWS.map((item, i) => (
            <li key={item.title} data-reveal style={stagger(i + 1, 110)}>
              <a
                href={item.href}
                className="group grid gap-4 border-b border-mixed/40 py-9 transition-[background-color,padding] duration-500 hover:bg-bg-primary/60 hover:pl-4 md:grid-cols-[160px_180px_1fr] md:items-baseline md:gap-8"
              >
                <time
                  dateTime={item.date}
                  className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase"
                >
                  {item.date.replace(/-/g, ".")}
                </time>
                <span className="font-mono text-size2 tracking-[0.12em] text-red uppercase">
                  {item.kicker}
                </span>
                <span className="text-size7 leading-[1.4] text-bg-secondary transition-colors group-hover:text-brand-white">
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
