import Link from "next/link";

import { formatNewsDate, type NewsItem } from "./news";
import { stagger } from "./stagger";

/**
 * The news rows, shared by the homepage band and the /news page so the two can
 * never drift apart in how an item is set.
 *
 * Must sit inside a <Reveal>: every row carries `data-reveal` and its own
 * stagger, counted from `delayFrom` so a caller with content above the list can
 * let that arrive first.
 *
 * A row with an `href` is a link; one without is a plain row with no hover. The
 * difference is deliberate — a row that lifts under the pointer promises a
 * destination, and an announcement with no page behind it has none.
 */

const ROW =
  "grid gap-4 border-b border-mixed/40 py-9 md:grid-cols-[160px_180px_1fr] md:items-baseline md:gap-8";

export default function NewsList({
  items,
  delayFrom = 0,
  className = "",
}: {
  items: NewsItem[];
  delayFrom?: number;
  className?: string;
}) {
  return (
    <ul className={`border-t border-mixed/50 ${className}`}>
      {items.map((item, i) => {
        const cells = (
          <>
            {item.date ? (
              <time
                dateTime={item.date}
                className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase"
              >
                {formatNewsDate(item.date)}
              </time>
            ) : (
              // Holds the date column on desktop; collapses on mobile, where an
              // empty first line would read as a missing date.
              <span aria-hidden="true" className="hidden md:block" />
            )}
            <span className="font-mono text-size2 tracking-[0.12em] text-red uppercase">
              {item.kicker}
            </span>
            <span
              className={`text-size7 leading-[1.4] text-bg-secondary ${item.href ? "transition-colors group-hover:text-brand-white" : ""}`}
            >
              {item.title}
            </span>
          </>
        );

        return (
          <li key={item.title} data-reveal style={stagger(i + delayFrom, 110)}>
            {item.href ? (
              // next/link, not a bare anchor: these leave the route, and as a
              // plain <a> the click was a full document load that remounted the
              // launch overlay and replayed the intro over the destination.
              <Link
                href={item.href}
                className={`group ${ROW} transition-[background-color,padding] duration-500 hover:bg-bg-primary/60 hover:pl-4`}
              >
                {cells}
              </Link>
            ) : (
              <div className={ROW}>{cells}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
