/**
 * Every news item on the site. The homepage band shows the first few; /news
 * shows them all. Array order is display order.
 *
 * Nothing here was written for the list. PRODUCT.md holds the news section to
 * what is on record, so each item points back at something the site already
 * publishes:
 *
 *   · the field guide     -> its own route under /news
 *   · the message         -> /leadership, the president's signed text
 *   · the company items   -> HistorySection's milestones, restated as headlines.
 *     They carry the month the timeline records and no day, because the record
 *     has no day. They have no page of their own, so they are not links.
 *     Copied rather than imported: HistorySection is a client module, and plain
 *     data exported from one cannot be read back out in a server component.
 *
 * The message has no date on record, so it carries none rather than borrowing
 * one. It sits second by choice, not by date.
 */

export type NewsItem = {
  /** `YYYY-MM-DD`, `YYYY-MM` where only the month is on record, or null. */
  date: string | null;
  kicker: string;
  title: string;
  /** Where the item leads. Omitted for announcements with no page behind them. */
  href?: string;
};

export const NEWS: NewsItem[] = [
  {
    date: "2026-06-10",
    kicker: "Insight",
    title:
      "What a proof of concept should actually prove — a field guide for first AI projects",
    href: "/news/what-a-proof-of-concept-should-prove",
  },
  {
    date: null,
    kicker: "Message",
    title: "A message from Hatsumi Imai, President and Executive Officer",
    href: "/leadership",
  },
  {
    date: "2026-04",
    kicker: "Company",
    title:
      "Management moves to an Executive Officers system as the company reaches approximately 150 people",
  },
  {
    date: "2025-09",
    kicker: "Company",
    title: "DDAM establishes a Global Division",
  },
  {
    date: "2024-01",
    kicker: "Company",
    title: "DDAM establishes a Digital Marketing Division",
  },
];

/** `2026-06-10` -> `2026.06.10`, the dotted form the rest of the site prints. */
export function formatNewsDate(date: string) {
  return date.replace(/-/g, ".");
}
