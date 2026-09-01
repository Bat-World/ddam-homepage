import BracketLink from "./bracket-link";
import LeaderPortrait from "./leader-portrait";
import { LEADERS, PRESIDENT, PULL_QUOTE } from "./leadership";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Leadership — the four people who run the company, and the line the president
 * signs her name under.
 *
 * Placed between the timeline and the field notes, and that is an argument
 * rather than a slot. History walks 2018 to now and stops; this is what "now"
 * is, in faces. Everything above it on the page is the company talking about
 * itself in the third person — the standard, the method, the practices — and a
 * buyer vetting a young consultancy eventually wants to know who is actually
 * accountable for any of it. This band is that answer, immediately before the
 * one section that shows the company's own thinking.
 *
 * Surface is bg-primary, between History's light grey and the field notes'
 * dark grey. Three darks running to the footer is already the page's ending
 * (workspace, contact, footer); this makes the same move once, earlier, and the
 * portraits are the reason — the set is shot on a mid-grey sweep, which lifts
 * off #111 as a row of lit panels and sinks into a light band as four slightly
 * darker rectangles.
 *
 * The letter itself is not here. It runs ~700 words, which is two screens of
 * reading dropped into the middle of a page that is already long, and it is
 * the kind of writing someone either wants in full or does not want at all. So
 * the band quotes the one sentence that states the ambition and links to
 * /leadership, the same way the field notes link out to the article rather than
 * inlining it.
 */
export default function LeadershipSection() {
  return (
    <section id="leadership" className="surface-lift bg-bg-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        {/* The two-column header every band on this page opens with: the claim
            on the left, what backs it on the right, under a hairline. */}
        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
            >
              Leadership
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-7 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
            >
              Who answers
              <br />
              for the work.
            </h2>
          </div>

          <div className="border-t border-mixed/60 pt-6">
            {/*
              A blockquote, set at lead size and not in quotation marks — the
              attribution under it does the work marks would, and a pair of
              curly quotes at this size reads as decoration. The cite is the
              only place on the page a person is named beside a claim, so it
              carries the title as well as the name.
            */}
            <blockquote data-reveal style={stagger(2)}>
              <p className="max-w-2xl text-lead leading-[1.65] text-light-gray">
                {PULL_QUOTE}
              </p>
              <footer className="mt-7 font-mono text-size2 leading-[1.7] tracking-[0.12em] text-text-3 uppercase">
                <cite className="not-italic">
                  {PRESIDENT.name} — {PRESIDENT.title}
                </cite>
              </footer>
            </blockquote>

            <div data-reveal style={stagger(3)}>
              <BracketLink
                href="/leadership"
                className="mt-9 -ml-2 text-bg-secondary"
              >
                Read the message
              </BracketLink>
            </div>
          </div>
        </Reveal>

        {/* ----------------------------------------------- the management team */}
        <Reveal className="mt-24">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
          >
            Management team
          </p>

          {/*
            Two up before four, never three: at three columns the fourth
            portrait sits alone on a second row, which reads as a person left
            over rather than as a team. The break to four is held to xl so each
            face keeps enough width to be a portrait rather than a thumbnail.
          */}
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
            {LEADERS.map((leader, i) => (
              <div key={leader.name} data-reveal style={stagger(i, 110)}>
                <LeaderPortrait leader={leader} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
