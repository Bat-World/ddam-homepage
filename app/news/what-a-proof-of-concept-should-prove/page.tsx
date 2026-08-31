import type { Metadata } from "next";
import Link from "next/link";

import Reveal from "../../components/reveal";
import { stagger } from "../../components/stagger";

/**
 * First real article route. The News list linked three headline stubs at
 * `#news` — the id of the section the links were already inside — so the one
 * piece of writing on the page that could carry expertise went nowhere.
 *
 * ── What this file is, right now ──────────────────────────────────────────────
 *
 * A structure, not a piece. Every section below has its heading, its argument
 * in one line, and a word budget; the bodies are `null` and the page renders a
 * visible draft note in their place. This is deliberate: a PoC field guide is
 * the page's proof that the company knows how to run PoCs, and a generated body
 * would collapse the first time a client asked a follow-up question in a
 * meeting. The headings are the commitment; the sentences under them are the
 * evidence, and they have to come from someone who has run these.
 *
 * To publish a section: write `body` as an array of paragraphs and delete its
 * `intent`. When every section has a body, the draft banner at the top of the
 * page disappears on its own — see `isDraft` below. Until then the route is
 * live and linked, and it says plainly that it is unfinished, which is the
 * honest state rather than a hidden one.
 *
 * ── Chrome ───────────────────────────────────────────────────────────────────
 *
 * No new design language. The page is the same dark ground, the same mono
 * kicker over a display heading, the same hairline rules and the same Reveal
 * entrance the homepage sections use. The only thing it adds is a reading
 * measure — body copy is capped near 68 characters, which nothing on the
 * homepage needed because nothing there runs to more than a paragraph.
 */

const TITLE =
  "What a proof of concept should actually prove — a field guide for first AI projects";

const DESCRIPTION =
  "A field guide to scoping a first AI proof of concept against a decision, defining what finished means before it starts, and reaching an honest go or no-go.";

export const metadata: Metadata = {
  title: "What a proof of concept should actually prove",
  description: DESCRIPTION,
  alternates: { canonical: "/news/what-a-proof-of-concept-should-prove" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: "/news/what-a-proof-of-concept-should-prove",
    publishedTime: "2026-06-10",
  },
};

const PUBLISHED = "2026-06-10";
const KICKER = "Insight";

type Section = {
  heading: string;
  /** What this section has to establish. Delete once `body` is written. */
  intent?: string;
  /** Target length, so the six sections land inside the 600–900 word brief. */
  words: number;
  /** One string per paragraph. */
  body?: string[];
};

/*
 * The spine.
 *
 * Ordered as an argument rather than as a table of contents: it clears away
 * what a PoC is mistaken for, narrows to the single thing it is for, then walks
 * the three practical questions in the order they actually get asked — how do
 * we scope it, how do we know it's finished, and what do we do with the answer.
 *
 * The sixth section is not in the original brief and earns its place: a guide
 * that only describes how to reach a go/no-go, and never says what a no is
 * worth, is quietly arguing that no is a failure. On this company's own terms
 * it isn't — "a clear go or no-go at the end of it" is stated as the
 * deliverable, and a cheap, early, well-evidenced no is the most valuable thing
 * a first project can produce.
 */
const SECTIONS: Section[] = [
  {
    heading: "What a proof of concept is not",
    intent:
      "Clear the three things clients usually arrive expecting — a discounted first phase of the real build, a demo to show the board, or a technology evaluation. Name what each one costs when it is run under the PoC label.",
    words: 120,
  },
  {
    heading: "The single question a proof of concept should answer",
    intent:
      "A PoC has room for exactly one question, and it is not \"does the model work\". State the shape of the right question — whether a specific decision would change if this system existed — and why one question rather than three is the constraint that makes the rest of the project possible.",
    words: 150,
  },
  {
    heading: "Scoping against a decision, not a dataset",
    intent:
      "The practical method: start from a decision the business already makes on a known cadence, work backwards to the data that decision would need, and let that set the scope. Contrast with the common alternative — starting from whichever data is available and looking for something to do with it.",
    words: 180,
  },
  {
    heading: "What \"done\" looks like, agreed before it starts",
    intent:
      "Done has to be written down in advance or it is negotiated afterwards, which is the same as never. Cover the three things worth fixing up front: the threshold the result is measured against, who is authorised to read the result, and the date the answer is due regardless of what state it is in.",
    words: 150,
  },
  {
    heading: "What an honest go or no-go requires",
    intent:
      "What has to be on the table for the decision to be real: what the production version would cost, what it would take to run once built, what the PoC could not test, and the confidence interval around the result. A recommendation without those four is an opinion.",
    words: 150,
  },
  {
    heading: "When the answer is no",
    intent:
      "Close on the value of a well-evidenced no — what the organisation now knows, why finding it in weeks rather than quarters is the return, and what usually gets reused from a PoC that stops.",
    words: 120,
  },
];

const isDraft = SECTIONS.some((section) => !section.body?.length);

/** The measure body copy is set to. Nothing else on the site runs long enough
    to need one, so it lives here rather than in globals.css. */
const MEASURE = "max-w-[68ch]";

export default function ProofOfConceptArticle() {
  return (
    <main className="flex-1">
      <article className="surface-lift bg-bg-primary">
        <div className="mx-auto max-w-[1600px] px-6 pt-40 pb-32">
          {/* ------------------------------------------------------ masthead */}
          <Reveal>
            {/* next/link, not a bare anchor: this is the one link on the page
                that leaves the route, and SmoothScroll only claims hrefs that
                start with `#`, so nothing here is being taken away from it. */}
            <Link
              data-reveal
              href="/#news"
              className="hover-mark hover-mark-flush font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              ← Latest updates
            </Link>

            <div
              data-reveal
              style={stagger(1)}
              className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3"
            >
              <time
                dateTime={PUBLISHED}
                className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase"
              >
                {PUBLISHED.replace(/-/g, ".")}
              </time>
              <span className="font-mono text-size2 tracking-[0.12em] text-red uppercase">
                {KICKER}
              </span>
            </div>

            <h1
              data-reveal
              style={stagger(2)}
              className="mt-8 max-w-[22ch] font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              What a proof of concept should actually prove
            </h1>

            <p
              data-reveal
              style={stagger(3)}
              className={`mt-8 ${MEASURE} text-lead leading-[1.65] text-light-gray`}
            >
              A field guide for first AI projects: how to scope one against a
              decision the business already makes, what to agree before it
              starts, and what an honest go or no-go actually costs to produce.
            </p>

            {/* Says what the page is rather than letting the reader work it
                out from six empty sections. Same hairline-and-mono register as
                every other caption on the site — it is a note, not a banner. */}
            {isDraft && (
              <p
                data-reveal
                style={stagger(4)}
                className={`mt-12 ${MEASURE} border-t border-mixed/60 pt-6 font-mono text-size2 leading-[1.7] tracking-[0.1em] text-text-3 uppercase`}
              >
                Draft — structure published, sections in writing.
              </p>
            )}
          </Reveal>

          {/* ------------------------------------------------------ the body */}
          <div className="mt-20 border-t border-mixed/50">
            {SECTIONS.map((section, i) => (
              <Reveal key={section.heading}>
                <section
                  data-reveal
                  className="border-b border-mixed/40 py-12 md:py-14"
                >
                  <p className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  <h2 className="mt-6 max-w-[28ch] font-display text-size10 leading-[1.2] font-medium tracking-[-0.01em] text-brand-white uppercase">
                    {section.heading}
                  </h2>

                  {section.body?.length ? (
                    <div className={`mt-7 ${MEASURE} space-y-5`}>
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="leading-[1.75] text-light-gray"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    /* The brief for the section, shown in place of the section.
                       Set in mono at caption size so it can never be misread as
                       the article itself. */
                    <div className={`mt-7 ${MEASURE}`}>
                      <p className="font-mono text-size2 leading-[1.8] tracking-[0.04em] text-text-3">
                        {section.intent}
                      </p>
                      <p className="mt-4 font-mono text-size2 tracking-[0.12em] text-mixed uppercase">
                        ≈ {section.words} words
                      </p>
                    </div>
                  )}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p
              data-reveal
              className={`mt-16 ${MEASURE} font-mono text-size2 leading-[1.7] tracking-[0.1em] text-text-3 uppercase`}
            >
              Target length {SECTIONS.reduce((total, s) => total + s.words, 0)}{" "}
              words.
            </p>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
