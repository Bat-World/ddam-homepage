import BracketLink from "./bracket-link";
import { NEWS } from "./news";
import NewsList from "./news-list";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * News — the newest few items, with the full list a route away at /news.
 *
 * A preview rather than the archive: every row past three pushes Careers
 * further down for a visitor who came for the company, not the back catalogue.
 * "See all news" sits at both ends of the band — beside the label for a reader
 * scanning the page, and under the list for one who has just read it.
 *
 * Every item is on record; news.ts says where each one comes from, and why the
 * company announcements are rows rather than links.
 */

/** How many of the items the homepage shows. */
const PREVIEW = 3;

export default function NewsSection() {
  return (
    <section id="news" className="surface-lift bg-dark-gray">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-32">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            News
          </p>
          <div data-reveal style={stagger(1)}>
            <BracketLink href="/news" className="-mr-2 text-bg-secondary">
              See all news
            </BracketLink>
          </div>
        </div>

        <NewsList
          items={NEWS.slice(0, PREVIEW)}
          delayFrom={2}
          className="mt-12"
        />

        <div data-reveal style={stagger(PREVIEW + 2, 110)}>
          <BracketLink href="/news" className="mt-12 -ml-2 text-bg-secondary">
            See all news
          </BracketLink>
        </div>
      </Reveal>
    </section>
  );
}
