import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * People and culture — the light band directly under the ember careers break,
 * where someone who has just read "open roles" wants to know what they'd be
 * joining.
 *
 * Two blocks: the three values the company holds, then the five reasons it
 * gives for working here. They're kept in one band rather than two because
 * they're one argument, and splitting them would put a full-bleed seam through
 * the middle of it.
 */

const VALUES = [
  {
    name: "Learn & grow",
    lead: "Always learning. Always creating value.",
    body: "We encourage continuous learning, knowledge sharing, and new ideas that help our people and our business grow.",
  },
  {
    name: "One team",
    lead: "We achieve more together.",
    body: "We respect different perspectives, listen to one another, and work together to create meaningful value.",
  },
  {
    name: "Belong & connect",
    lead: "Everyone has a voice. Everyone belongs.",
    body: "We foster an inclusive and open culture where people can be themselves, share ideas, stay connected, and actively contribute to our workplace.",
  },
];

const REASONS = [
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
];

export default function CultureSection() {
  return (
    <section id="culture" className="bg-bg-secondary text-text-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
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

        {/* ------------------------------------------------------- the values */}
        <Reveal className="mt-24 grid gap-px bg-text-primary/20 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <article
              key={value.name}
              data-reveal
              style={stagger(i, 120)}
              className="bg-bg-secondary pt-10 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-60">
                {String(i + 1).padStart(2, "0")} — {value.name}
              </p>
              <h3 className="mt-6 font-display text-size9 leading-[1.2] font-bold tracking-[-0.01em] text-balance uppercase">
                {value.lead}
              </h3>
              <p className="mt-6 max-w-[46ch] leading-[1.7]">{value.body}</p>
            </article>
          ))}
        </Reveal>

        {/*
          Why work here. A list rather than a fifth and sixth card column — five
          items don't divide into the page's grid, and forcing them into three
          plus two leaves an orphan row that reads as a mistake.
        */}
        <Reveal className="mt-24">
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] uppercase"
          >
            Why work at DDAM?
          </p>
          <ol className="mt-8 border-t border-text-primary/25">
            {REASONS.map((reason, i) => (
              <li
                key={reason.name}
                data-reveal
                style={stagger(i, 90)}
                className="grid gap-3 border-b border-text-primary/15 py-8 md:grid-cols-[260px_1fr] md:gap-10"
              >
                <div>
                  <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-size8 leading-[1.25] font-bold uppercase">
                    {reason.name}
                  </h3>
                </div>
                <div>
                  <p className="text-size7 leading-[1.45]">{reason.lead}</p>
                  <p className="mt-3 max-w-[62ch] leading-[1.7] opacity-75">
                    {reason.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
