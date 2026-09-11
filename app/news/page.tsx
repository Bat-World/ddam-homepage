import type { Metadata } from "next";
import Link from "next/link";

import { NEWS } from "../components/news";
import NewsList from "../components/news-list";
import Reveal from "../components/reveal";
import { stagger } from "../components/stagger";

/**
 * Every news item, on its own route — where the homepage band's "See all news"
 * leads.
 *
 * Same ground as the homepage band (dark grey, not the article's near-black) so
 * the list reads as the band opened out rather than as a different place, and
 * so the rows' hover tint, which is set against that grey, still shows.
 */

export const metadata: Metadata = {
  title: "News",
  description:
    "News from Dentsu Data Artist Mongol: insight, a message from leadership, and company announcements.",
  alternates: { canonical: "/news" },
};

export default function NewsIndex() {
  return (
    <main className="flex-1">
      <section className="surface-lift bg-dark-gray">
        <div className="mx-auto max-w-[1600px] px-6 pt-40 pb-32">
          <Reveal>
            <Link
              data-reveal
              href="/#news"
              className="hover-mark hover-mark-flush font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              ← Home
            </Link>

            <h1
              data-reveal
              style={stagger(1)}
              className="mt-10 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              News
            </h1>

            <NewsList items={NEWS} delayFrom={2} className="mt-16" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
