import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/** Light break after the hero: positioning statement, set against the dark. */
export default function EthosSection() {
  return (
    <section className="bg-bg-secondary text-text-primary">
      <Reveal className="mx-auto grid max-w-[1600px] gap-12 px-6 pt-32 pb-24 md:grid-cols-2 md:gap-20 md:pt-44">
        <div>
          <p
            data-reveal
            className="font-mono text-size2 tracking-[0.16em] uppercase"
          >
            Our ethos
          </p>
          <h2
            data-reveal
            style={stagger(1)}
            className="mt-7 font-display text-display-sm leading-[1.05] font-bold tracking-[-0.02em] uppercase"
          >
            Data is the craft.
            <br />
            Impact is the proof.
          </h2>
        </div>

        <div className="border-t border-text-primary/25 pt-6">
          <p
            data-reveal
            style={stagger(2)}
            className="max-w-2xl text-lead leading-[1.65]"
          >
            We sit between the business question and the system that answers it.
            Models are only worth what they change — so we scope against a
            decision, engineer the data that feeds it, and stay on after launch
            to prove the number moved. Backed by dentsu&apos;s global practice,
            delivered by a team based here in Ulaanbaatar.
          </p>
          <div data-reveal style={stagger(3)}>
            <BracketLink href="#careers" className="mt-9 -ml-2">
              Join us
            </BracketLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
