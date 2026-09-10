import Link from "next/link";

import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * News — the page's one piece of published thinking.
 *
 * Labelled "News" rather than "Field notes", and without the standfirst that
 * used to sit under the label: the row itself says what the piece is, so the
 * section goes straight from its label to the list.
 *
 * This was three headlines and a "Latest updates" kicker. Two of the three
 * pointed at `#news`, the id of the section they were already inside, and so
 * did "All news →": three links offering to take a reader somewhere and then
 * not doing it. On a page whose whole argument is that this company proves
 * things before it claims them, a list of headlines that go nowhere is the
 * single most self-contradicting thing on it.
 *
 * So the list is the one article that exists. It reads thin next to three
 * rows, and it is meant to — one piece someone actually wrote beats three
 * that only look like a publishing cadence. The two stubs are in git and come
 * back the day they have routes; the row markup already takes any number.
 */

const NEWS = [
  {
    date: "2026-06-10",
    kicker: "Insight",
    title:
      "What a proof of concept should actually prove — a field guide for first AI projects",
    href: "/news/what-a-proof-of-concept-should-prove",
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="surface-lift bg-dark-gray">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-32">
        <p
          data-reveal
          className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
        >
          News
        </p>

        <ul className="mt-12 border-t border-mixed/50">
          {NEWS.map((item, i) => (
            <li key={item.title} data-reveal style={stagger(i + 1, 110)}>
              {/* next/link, not a bare anchor: these leave the route, and as a
                  plain <a> the click was a full document load that remounted
                  the launch overlay and replayed the intro over the article.
                  SmoothScroll only claims hrefs beginning with `#`, so nothing
                  is taken from it here. */}
              <Link
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
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
