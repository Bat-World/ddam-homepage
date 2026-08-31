import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * People and culture — the light band directly under the ember careers break,
 * where someone who has just read "open roles" wants to know what they'd be
 * joining.
 *
 * One block: the three reasons the company gives for working here, under a
 * statement of the culture they come out of.
 *
 * A three-up grid of the company's values used to stand between the two, and
 * it went because the band was saying the same thing three times over. The
 * standfirst says people "continue to learn, collaborate as one team, and feel
 * a true sense of belonging"; the values grid then named those three as Learn &
 * grow, One team and Belong & connect; and the reasons restated them again —
 * "We achieve more together" sat four cells from "Achieve more together".
 *
 * The paragraph survived because it says all three in the company's own voice
 * in one breath, and because it is the right column of the header pattern:
 * without it the hairline above it rules an empty column. Learn & grow has
 * since been folded into Growth & learning. One team and Belong & connect are
 * in git, as are the two cells cut in the trim to three — see REASONS.
 *
 * Every cell in that grid is the same cell. Nothing is picked out.
 */

/**
 * One cell shape: a monospace index and name, the line it argues, then the
 * detail. The reasons were a full-width row list before this, with the name set in
 * display type *and* a lead two pixels smaller under it — every row carried two
 * competing headlines and needed 160-190px to hold them.
 */
type Cell = { name: string; lead: string; body: string };

/*
 * Why work here — three cells, one row.
 *
 * This ran to six, and six was the wrong number twice over. Growth & learning
 * and Learn & grow were the same card written twice ("develop your knowledge
 * and skills through training" against "continuous learning, knowledge
 * sharing"), and People & collaboration restated the standfirst directly above
 * it, which already says the team collaborates as one and learns from each
 * other. Wellbeing & work life is the one cut rather than merged: it is the
 * only cell here that would sit unchanged on any company's careers page, and
 * the comfortable-office fact it carried is stated in the careers band above.
 *
 * The two that survive untouched are the two that are only true here — work
 * across the Japanese and Mongolian landscape, and AI on real client business
 * problems. The third is the merge of Growth & learning, Learn & grow and the
 * mentorship half of People & collaboration.
 *
 * Three up still fills the row exactly, so the nth-child gutter rules below go
 * on working unchanged.
 */
const REASONS: Cell[] = [
  {
    name: "AI & innovation",
    lead: "Real client systems, not demos.",
    body: "Work on AI, digital marketing and technology-driven projects, solving real-world business challenges through innovative technologies and solutions.",
  },
  {
    name: "Global opportunities",
    lead: "Two markets, one standard.",
    body: "Work across the Japanese and Mongolian technology landscape, collaborate with international projects and clients, and gain valuable global experience.",
  },
  {
    name: "Growth & learning",
    lead: "Always learning. Always creating value.",
    body: "Develop your knowledge and skills through training, professional certifications and structured learning, alongside professionals from diverse backgrounds you can learn from directly. Knowledge sharing and new ideas are how both our people and our business get to the next stage.",
  },
];

/*
 * Column padding, keyed off the column rather than the list.
 *
 * The values grid could say `first:pl-0 last:pr-0` because its three cells are
 * its only row. This grid was two rows deep when the rule was written, where
 * that would flush the first cell and the last and leave the four between them
 * inset — so the gutters key off the column instead: every third cell from the
 * first loses its left padding, every third from the third loses its right.
 * It reduces to the same result at three cells, and survives the list growing
 * back past one row.
 */
const CELL =
  "bg-bg-secondary px-0 py-10 md:px-8 md:[&:nth-child(3n+1)]:pl-0 md:[&:nth-child(3n)]:pr-0";

export default function CultureSection() {
  return (
    <section id="culture" className="surface-lift bg-bg-secondary text-text-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-28">
        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] uppercase"
            >
              People &amp; culture
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-7 font-display text-display-sm leading-[1.05] font-bold tracking-[-0.02em] text-balance uppercase"
            >
              No ceiling we&apos;ve found yet.
            </h2>
          </div>

          <div className="border-t border-text-primary/25 pt-6">
            <p
              data-reveal
              style={stagger(2)}
              className="max-w-2xl text-lead leading-[1.65]"
            >
              People here are given work slightly ahead of what they have done
              before, and experts from the group&apos;s practice review it —
              which is how a team triples in three years without the standard
              slipping. At DDAM we foster a culture where people continue to
              learn, collaborate as one team and feel a true sense of
              belonging, because individual growth and shared success are the
              same thing here.
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ the reasons */}
        <Reveal className="mt-20">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] uppercase"
          >
            Why work at DDAM?
          </p>

          <div className="mt-8 grid gap-px border-t border-text-primary/25 bg-text-primary/20 pt-px md:grid-cols-3">
            {REASONS.map((reason, i) => (
              <article
                key={reason.name}
                data-reveal
                style={stagger(i % 3, 120)}
                className={CELL}
              >
                <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-60">
                  {String(i + 1).padStart(2, "0")} — {reason.name}
                </p>
                <h3 className="mt-6 font-display text-size9 leading-[1.2] font-bold tracking-[-0.01em] text-balance uppercase">
                  {reason.lead}
                </h3>
                <p className="mt-6 max-w-[46ch] leading-[1.7]">{reason.body}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
