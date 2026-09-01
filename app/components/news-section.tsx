import Link from "next/link";

import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Field notes — the page's one piece of published thinking.
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
          Field notes
        </p>

        <p
          data-reveal
          style={stagger(1)}
          className="mt-8 max-w-2xl text-lead leading-[1.65] text-light-gray"
        >
          We would rather publish the method than the claim. This is how we run
          a first AI project — how the question gets scoped, what has to be
          agreed before it starts, and what we tell a client when the answer is
          no.
        </p>

        <ul className="mt-12 border-t border-mixed/50">
          {NEWS.map((item, i) => (
            <li key={item.title} data-reveal style={stagger(i + 2, 110)}>
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
