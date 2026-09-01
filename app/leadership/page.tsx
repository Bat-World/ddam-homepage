import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import BracketLink from "../components/bracket-link";
import LeaderPortrait from "../components/leader-portrait";
import { LEADERS, MESSAGE, PRESIDENT } from "../components/leadership";
import Reveal from "../components/reveal";
import { stagger } from "../components/stagger";

/**
 * The president's message in full, and the management team under it.
 *
 * Why a route rather than a band on the homepage: the letter is ~700 words, and
 * the homepage is a single scroll whose every other band is read in a few
 * seconds. Two screens of continuous prose dropped into the middle of it costs
 * every section below it, and buys nothing — a visitor either wants a
 * president's message in full or does not want it at all, and the ones who do
 * are the ones who followed a link marked "read the message". Same call the
 * field notes make about the article they link to.
 *
 * Structurally this is that article page: same dark ground, same mono kicker
 * over a display heading, same 68-character measure, same Reveal entrance. The
 * one thing it adds is the portrait column beside the prose, which sticks while
 * the letter scrolls — the page's own device, used everywhere from the service
 * orbit to the office reel, at its simplest.
 *
 * The team then gets its own band with the site's seam on it, rather than a
 * hairline inside this one. It is a different kind of content — a list of
 * people, not a piece of writing — and on the homepage it already reads as a
 * block of its own.
 */

const TITLE = "Leadership — the management team of Dentsu Data Artist Mongol";

const DESCRIPTION =
  "A message from Hatsumi Suzuki, President of Dentsu Data Artist Mongol, on the ambition to become the dentsu group's global AI development hub — and the four executives who run the company.";

export const metadata: Metadata = {
  title: "Leadership",
  description: DESCRIPTION,
  alternates: { canonical: "/leadership" },
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESCRIPTION,
    url: "/leadership",
  },
};

/** The measure the letter is set to — the article route's, for the same reason:
 *  it is the only other place on this site with more than a paragraph to read. */
const MEASURE = "max-w-[68ch]";

export default function LeadershipPage() {
  return (
    <main className="flex-1">
      <article className="surface-lift bg-bg-primary">
        <div className="mx-auto max-w-[1600px] px-6 pt-40 pb-32">
          {/* ------------------------------------------------------ masthead */}
          <Reveal>
            {/* next/link, not a bare anchor: this leaves the route. SmoothScroll
                only claims hrefs beginning with `#`, so nothing is taken from
                it here — see anchor-href.ts. */}
            <Link
              data-reveal
              href="/#leadership"
              className="hover-mark hover-mark-flush font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              ← Leadership
            </Link>

            <h1
              data-reveal
              style={stagger(1)}
              className="mt-10 max-w-[20ch] font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              Message from the President
            </h1>

            {/* The only sentence on this page the company did not write. It
                says what the letter is about so a reader can decide to read it,
                and every claim in it is drawn from the letter itself. */}
            <p
              data-reveal
              style={stagger(2)}
              className={`mt-8 ${MEASURE} text-lead leading-[1.65] text-light-gray`}
            >
              On DDAM&apos;s ambition to become the dentsu group&apos;s global AI
              development hub, what Mongolia&apos;s position between markets
              makes possible, and why revenue is only half of what has to grow.
            </p>

            {/* The byline, and the reason the portrait column below carries no
                caption of its own. Named here and again at the sign-off, two
                screens apart, which is how a letter is attributed — rather than
                labelled beside its own signature, which is what a caption on a
                sticky portrait turns into the moment the sign-off scrolls up
                next to it. */}
            <p
              data-reveal
              style={stagger(3)}
              className="mt-8 font-mono text-size2 leading-[1.7] tracking-[0.12em] text-text-3 uppercase"
            >
              {PRESIDENT.name} — {PRESIDENT.title}
            </p>
          </Reveal>

          {/* -------------------------------------------------- the letter */}
          <div className="mt-20 grid gap-14 border-t border-mixed/50 pt-16 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-20">
            {/*
              Sticky rather than scrolling away: the letter is long enough that
              the face behind it would be off screen for most of the read, and
              a signed message whose signatory is visible the whole way through
              reads as addressed to you rather than published at you.

              `self-start` is what makes the stick work — a grid item stretches
              to its row by default, and a full-height box has nothing left to
              travel within.
            */}
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <div
                data-reveal
                className="portrait-frame relative aspect-[3/4] max-w-[320px]"
              >
                {/* This one is the page's opening image rather than something
                    scrolled to, so it is fetched eagerly. Its alt is empty for
                    the reason set out in leader-portrait.tsx: the name and
                    title sit directly under it, in text. */}
                <Image
                  src={PRESIDENT.image}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1024px) 300px, 88vw"
                  priority
                  className="portrait-photo size-full object-cover object-top"
                />
              </div>
            </Reveal>

            <div>
              <Reveal className={`${MEASURE} space-y-6`}>
                {MESSAGE.map((paragraph, i) => (
                  <p
                    key={paragraph}
                    data-reveal
                    /* Capped low: the whole letter is one Reveal, so an
                       uncapped walk down eight paragraphs would leave the last
                       one waiting most of a second after the first. */
                    style={stagger(i, 70, 350)}
                    /* The opening paragraph sets the frame for the other seven
                       and is the one most likely to be all anyone reads, so it
                       is set a step up. Everything after it is body copy. */
                    className={
                      i === 0
                        ? "text-lead leading-[1.7] text-bg-secondary"
                        : "leading-[1.8] text-light-gray"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              {/* The sign-off. A hairline and the name in display type — the
                  same close a letter has on paper, and the answer to "who is
                  saying this" for anyone who scrolled past the portrait on a
                  narrow screen, where the column above is not beside the text. */}
              <Reveal className={`mt-12 ${MEASURE} border-t border-mixed/50 pt-8`}>
                <p
                  data-reveal
                  className="font-display text-size10 leading-[1.2] font-medium tracking-[-0.01em] text-brand-white uppercase"
                >
                  {PRESIDENT.name}
                </p>
                <p
                  data-reveal
                  style={stagger(1)}
                  className="mt-2 font-sans text-size5 leading-[1.4] text-light-gray"
                >
                  {PRESIDENT.native}
                </p>
                <p
                  data-reveal
                  style={stagger(2)}
                  className="mt-4 font-mono text-size2 leading-[1.6] tracking-[0.12em] text-text-3 uppercase"
                >
                  {PRESIDENT.title} · Dentsu Data Artist Mongol LLC
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      {/* ------------------------------------------------- the management team */}
      <section
        id="management-team"
        className="surface-lift bg-dark-gray"
        aria-labelledby="management-team-heading"
      >
        <div className="mx-auto max-w-[1600px] px-6 py-32">
          <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <p
                data-reveal
                className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
              >
                Management team
              </p>
              <h2
                id="management-team-heading"
                data-reveal
                style={stagger(1)}
                className="mt-7 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
              >
                Four names
                <br />
                on the work.
              </h2>
            </div>

            <div className="border-t border-mixed/60 pt-6">
              <p
                data-reveal
                style={stagger(2)}
                className="max-w-2xl text-lead leading-[1.65] text-light-gray"
              >
                One delivery team runs all four practices, and these are the
                people accountable for it — across AI and engineering, BPO,
                corporate planning, and the relationship with Tokyo.
              </p>
            </div>
          </Reveal>

          {/* The grid needs a Reveal of its own, not just `data-reveal` on the
              cells: the entrance is driven by `[data-revealed="false"]` on an
              ancestor, so a marked element with no Reveal above it is simply
              never hidden and never animates. */}
          <Reveal className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
            {LEADERS.map((leader, i) => (
              <div key={leader.name} data-reveal style={stagger(i, 110)}>
                <LeaderPortrait leader={leader} />
              </div>
            ))}
          </Reveal>

          <Reveal>
            <div data-reveal>
              <BracketLink
                href="/#contact"
                className="mt-20 -ml-2 text-bg-secondary"
              >
                Start a conversation
              </BracketLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
