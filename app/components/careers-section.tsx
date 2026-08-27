import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/** Recruitment band — the one full-colour break in the lower half of the page. */
export default function CareersSection() {
  return (
    <section id="careers" className="surface-lift bg-red text-brand-black">
      <Reveal className="mx-auto grid max-w-[1600px] gap-12 px-6 py-28 md:grid-cols-2 md:items-end md:gap-20">
        <div>
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] uppercase"
          >
            Careers
          </p>
          <h2
            data-reveal
            style={stagger(1)}
            className="mt-7 font-display text-display-sm leading-[1.05] font-bold tracking-[-0.02em] uppercase"
          >
            Build the work
            <br />
            you want to sign.
          </h2>
        </div>

        <div>
          <p
            data-reveal
            style={stagger(2)}
            className="max-w-xl text-lead leading-[1.65]"
          >
            Engineers, analysts, strategists and designers — working on real
            client systems from the most comfortable office in Ulaanbaatar, with
            the training and mobility of the dentsu network behind it.
          </p>
          <div data-reveal style={stagger(3)}>
            <BracketLink href="#careers" className="mt-9 -ml-2">
              Open roles
            </BracketLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
