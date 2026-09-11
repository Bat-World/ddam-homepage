import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/** Closing conversion block: one statement, one action, the details beneath. */

const EMAIL = "ddam@group.data-artist.com";
const PHONE = "(+976) 77 11 33 26";
const ADDRESS =
  "Altan Joloo Tower 6F, Seoul street, 5th khoroolol, 3rd khoroo, Sukhbaatar district, Ulaanbaatar Mongolia, 14252.";

const DETAILS = [
  ["Email", EMAIL],
  ["Phone", PHONE],
  ["Visit us", ADDRESS],
];

export default function ContactSection() {
  return (
    <section id="contact" className="surface-lift bg-bg-primary">
      <Reveal className="mx-auto max-w-[1600px] px-6 py-32">
        <p
          data-reveal
          className="font-mono text-size2 tracking-[0.16em] text-text-3 uppercase"
        >
          Contact
        </p>

        <h2
          data-reveal
          style={stagger(1)}
          className="mt-8 font-display text-display-sm leading-[1.05] font-medium tracking-[-0.02em] text-brand-white uppercase"
        >
          Tell us the decision
          <br />
          you need to get right.
        </h2>

        <div data-reveal style={stagger(2)}>
          <BracketLink
            href={`mailto:${EMAIL}`}
            className="mt-12 -ml-2 text-bg-secondary"
          >
            Start a conversation
          </BracketLink>
        </div>

        <dl className="mt-20 grid gap-px overflow-hidden border-t border-mixed/50 md:grid-cols-3">
          {DETAILS.map(([term, value], i) => (
            <div
              key={term}
              data-reveal
              style={stagger(i + 3)}
              className="py-8 md:pr-8"
            >
              <dt className="font-mono text-size2 tracking-[0.12em] text-text-3 uppercase">
                {term}
              </dt>
              <dd className="mt-3 text-size6 text-bg-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
