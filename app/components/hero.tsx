import BracketLink from "./bracket-link";
import DotSphere from "./dot-sphere";
import LogoMark from "./logo-mark";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Full-viewport opening: the headline is split into a left-set and a right-set
 * line so the rotating point cloud shows through the gap between them, and the
 * standfirst sits on the fold line as a footer strip.
 *
 * The two headline lines and the strip below reveal in sequence on load — the
 * observer fires immediately here, since this is what the page opens on.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden px-6 pb-8"
    >
      <DotSphere className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(84vw,780px)] -translate-x-1/2 -translate-y-[56%]" />

      <Reveal className="relative flex flex-1 items-center pt-32">
        <h1 className="w-full font-display text-display leading-[0.94] font-medium tracking-[-0.02em] text-bg-secondary uppercase">
          <span data-reveal style={stagger(0)} className="block">
            Building AI that
          </span>
          <span data-reveal style={stagger(1, 140)} className="block text-right">
            moves business forward
          </span>
        </h1>
      </Reveal>

      <Reveal className="relative grid items-start gap-8 border-t border-mixed/60 pt-7 md:grid-cols-[auto_1fr_auto] md:gap-12">
        <div data-reveal style={stagger(0, 140)}>
          <BracketLink href="#contact" className="-ml-2 text-bg-secondary">
            Contact us
          </BracketLink>
        </div>

        <p
          data-reveal
          style={stagger(1, 140)}
          className="max-w-2xl font-mono text-size1 leading-[1.75] tracking-[0.05em] text-text-3 uppercase"
        >
          Dentsu Data Artist Mongol is an AI and data consultancy inside the
          dentsu network. Strategy. Engineering. Analytics. Growth. We build the
          systems that turn data into decisions — and the teams that keep them
          running.
        </p>

        <LogoMark
          data-reveal
          style={stagger(2, 140)}
          className="w-9 self-center text-brand-white md:justify-self-end"
        />
      </Reveal>
    </section>
  );
}
