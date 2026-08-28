import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * People and culture — the light band directly under the ember careers break,
 * where someone who has just read "open roles" wants to know what they'd be
 * joining.
 *
 * One block: the five reasons the company gives for working here, under a
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
 * without it the hairline above it rules an empty column. Learn & grow survived
 * as the grid's sixth cell. One team and Belong & connect are in git.
 *
 * Every cell in that grid is the same cell. Nothing is picked out.
 */

/**
 * One cell shape: a monospace index and name, the line it argues, then the
 * detail. The reasons were a five-row list before this, with the name set in
 * display type *and* a lead two pixels smaller under it — every row carried two
 * competing headlines and needed 160-190px to hold them.
 */
type Cell = { name: string; lead: string; body: string };

/*
 * Why work here.
 *
 * Set as five full-width rows this ran 857px on its own — very nearly a screen
 * — while leaving roughly half the measure empty beside it, because the copy
 * was capped at 62ch inside a column that grew with the window. The two were
 * one fault: width the rows could never spend came back as height.
 *
 * Three up spends it, and six items fill two rows exactly — five reasons plus
 * the one value carried over when the values grid came out, which is why the
 * list runs to six rather than leaving a hole in the second row.
 */
const REASONS: Cell[] = [
  {
    name: "AI & innovation",
    lead: "Build the future of technology together.",
    body: "Work on AI, digital marketing and technology-driven projects, solving real-world business challenges through innovative technologies and solutions.",
  },
  {
    name: "Global opportunities",
    lead: "Grow your career in a global environment.",
    body: "Work across the Japanese and Mongolian technology landscape, collaborate with international projects and clients, and gain valuable global experience.",
  },
  {
    name: "Growth & learning",
    lead: "Take your growth to the next level.",
    body: "Continuously develop your knowledge and skills through training, professional certifications, and learning and development opportunities, while building your career for the next stage.",
  },
  {
    name: "People & collaboration",
    lead: "Achieve more together.",
    body: "Collaborate with professionals from diverse backgrounds, experiences and perspectives, learn from one another, and turn new ideas into meaningful value.",
  },
  {
    name: "Wellbeing & work life",
    lead: "Do great work. Live well.",
    body: "Enjoy a comfortable, modern workplace and a supportive work environment, with programmes and initiatives designed to support your wellbeing and overall quality of life.",
  },
  /*
   * The sixth is a value rather than a reason — the one carried over when the
   * values grid came out. It is a plain cell like the other five: it briefly
   * ran on Ink, which made sense while the slot held a statistic and had to
   * read as a different kind of thing, and stopped making sense the moment it
   * held a name, a line and a body like everything beside it. One item in six
   * picked out in another colour has to be answering a question the reader is
   * asking, and there isn't one here.
   */
  {
    name: "Learn & grow",
    lead: "Always learning. Always creating value.",
    body: "We encourage continuous learning, knowledge sharing, and new ideas that help our people and our business grow.",
  },
];

/*
 * Column padding for a grid that runs to more than one row.
 *
 * The values grid could say `first:pl-0 last:pr-0` because its three cells are
 * its only row. Across two rows that would flush the first cell and the last
 * and leave the four between them inset, so the gutters have to key off the
 * column instead — every third cell from the first loses its left padding,
 * every third from the third loses its right.
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
              Grow together. Create value. Belong as one team.
            </h2>
          </div>

          <div className="border-t border-text-primary/25 pt-6">
            <p
              data-reveal
              style={stagger(2)}
              className="max-w-2xl text-lead leading-[1.65]"
            >
              At DDAM we foster a culture where people continue to learn,
              collaborate as one team, and feel a true sense of belonging. We
              believe individual growth, shared success and an inclusive
              workplace are the foundation of long-term value creation.
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
