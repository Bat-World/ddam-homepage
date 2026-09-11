import BracketLink from "./bracket-link";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Light break after the hero, and the page's thesis: where the company came
 * from, why that is the reason to trust it, and the three ways it says it
 * creates value.
 *
 * The origin argument used to live in AboutSection, roughly 60% down the page.
 * It is the only claim on the site that no other young AI company could make —
 * that the standard arrived before the market did — so it is stated here, in
 * the second screen, before the services list rather than long after it. What
 * stayed behind in About is the evidence for it: the offices, the group, the
 * technical core.
 *
 * One paragraph: the argument (origin, standard, the inversion). A second one
 * used to follow with the method and the growth record (~150 today, tripled in
 * three years); it was cut, and both facts still stand elsewhere — the growth
 * record in HistorySection's 2026 entry and in People & culture, the method in
 * the pillars below and in ServiceOrbit.
 *
 * The three pillars carry the same concept at three levels — 01 why the
 * company exists, 02 how it works for a client, 03 where its energy comes
 * from. `label` and `ja` are the deck's own wording and are left alone; the
 * English leads and bodies are what connect them to the argument above.
 *
 * The three pillars are set as one flush triptych of colour panels — the same
 * device the reference layout uses for its value cards. It's the only saturated
 * moment between the hero and the orbit, and it does two jobs: it breaks the
 * long grey run of the page, and it gives the three statements equal weight,
 * which a hairline-ruled column grid never quite manages.
 *
 * Each pillar carries its Japanese line as well as its English one. The pair is
 * how the deck states it and the group's centre of gravity is Tokyo, so
 * dropping the Japanese would be dropping half the statement. It's set in the
 * sans stack rather than the mono one because Azeret Mono has no CJK coverage —
 * a mono label would fall back to a system face mid-line and break the setting.
 */

/**
 * `surface` is the panel's colour pair, written out in full rather than
 * composed from a base class plus a variable: Tailwind only emits the utilities
 * it can see spelled out in the source.
 */
const PILLARS = [
  {
    surface: "bg-brand-black text-brand-white",
    lead: "AI alone isn't enough.",
    label: "By leading AI implementation in society",
    ja: "AIの社会実装をリード",
    body: "Although we live in an era of technology, its practical implementation in society remains behind. As a technology company specialising in AI, we treat AI as the tool for solving real problems and making a better environment for others.",
  },
  {
    surface: "bg-steel text-brand-black",
    lead: "Prove it before you build it.",
    label: "By bringing solutions to our clients' business",
    ja: "ビジネスへのソリューション",
    body: "No company can know whether applying AI will help its business until the hypothesis is tested. So we test it first — a funded proof of concept returning a working prototype, an honest cost model and a clear go or no-go, where logical thinking, performance speed and affordable cost are all vital. We provide the three of them without compromising quality.",
  },
  {
    surface: "bg-red text-brand-black",
    lead: "No ceiling we have found yet.",
    label: "By providing opportunities to our members",
    ja: "DDAMメンバーに機会提供",
    body: "The energy here comes from the same place the standard does. As a company that depends on human intelligence, we give our members work slightly ahead of what they have done before: global clients, under the mentorship of experts in the field, practising the soft skills that carry a career as well as the hard ones. Nobody has yet found the top of what this team can take on.",
  },
];

export default function EthosSection() {
  return (
    <section className="bg-bg-secondary text-text-primary">
      <div className="mx-auto max-w-[1600px] px-6 pt-32 pb-24 md:pt-44">
        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] uppercase"
            >
              Our philosophy
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-7 font-display text-display-sm leading-[1.05] font-bold tracking-[-0.02em] uppercase"
            >
              Always to create
              <br />
              high value.
            </h2>
          </div>

          <div className="border-t border-text-primary/25 pt-6">
            <p
              data-reveal
              style={stagger(2)}
              className="max-w-2xl text-lead leading-[1.65]"
            >
              DDAM was established in 2018 as an R&amp;D centre inside the dentsu
              group, and became a subsidiary of Dentsu Digital in 2023. For
              those years the work was held to Japanese enterprise standards
              before any of it went to market under our own name. Most
              companies this young earn that standard afterwards; we inherited
              it first.
            </p>
            <div data-reveal style={stagger(3)}>
              <BracketLink href="#careers" className="mt-9 -ml-2">
                Join us
              </BracketLink>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ the pillars */}
        {/* Flush, not gapped: the panels are meant to read as one band of
            colour cut into three, which any gutter would undo.

            The radius therefore goes on the band, clipped — rounding each panel
            would round the seams too and break them back apart. 20px is the
            same radius the light section takes where it opens over the hero, so
            the two largest shapes on the page turn their corners alike.
            Stacked on mobile it lands on the first and last panel, which is
            still the outside of the band. */}
        <Reveal className="mt-24 grid overflow-hidden rounded-xl md:mt-28 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <article
              key={pillar.label}
              data-reveal
              style={stagger(i, 120)}
              className={`${pillar.surface} px-7 pt-10 pb-12 md:px-9 md:pt-12 md:pb-16`}
            >
              {/* Muted, but less so than on the page ground: the same opacity
                  over a saturated panel loses more contrast than it does over
                  grey. */}
              <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 font-display text-size9 leading-[1.2] font-bold tracking-[-0.01em] text-balance uppercase">
                {pillar.lead}
              </h3>
              <p className="mt-5 font-mono text-size2 leading-[1.7] tracking-[0.08em] uppercase opacity-80">
                {pillar.label}
              </p>
              <p className="mt-1 font-sans text-size3 leading-[1.7] opacity-70">
                {pillar.ja}
              </p>
              <p className="mt-6 max-w-[46ch] leading-[1.7]">{pillar.body}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
