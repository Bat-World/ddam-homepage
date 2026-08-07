import DotArt, { type DotArtVariant } from "./dot-art";
import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * The four core practices, as full-bleed panels that butt against each other
 * and carry the page from the light ethos band back down into the dark.
 *
 * The row is an accordion: hovering a panel opens it to 40% and squeezes the
 * other three, which is the reference's signature interaction. The widths live
 * in globals.css under `.panel-row` — they're percentages of a four-up row, so
 * they belong together in one rule rather than scattered across variants.
 *
 * `dot-art-host` is what the artwork's hover ripple keys off — it's on the
 * whole panel, so the field reacts anywhere on the card, not just over the SVG.
 */

type Service = {
  title: [string, string];
  art: DotArtVariant;
  body: string;
  surface: string;
};

const SERVICES: Service[] = [
  {
    title: ["AI Solution", "Development"],
    art: "lattice",
    body: "From use-case discovery to a model in production. Forecasting, personalisation, document intelligence and conversational systems — scoped against a decision your business already makes.",
    surface: "bg-brand-black text-brand-white",
  },
  {
    title: ["Data Engineering", "& Analytics"],
    art: "wave",
    body: "Pipelines, warehouses and governance that hold up under load. We make the data trustworthy first, then build the dashboards and measurement that leadership can act on.",
    surface: "bg-steel text-brand-black",
  },
  {
    title: ["Proof of Concept", "& R&D"],
    art: "burst",
    body: "Short, funded experiments that answer one question: is this worth building? A working prototype, an honest cost model, and a clear go or no-go at the end of it.",
    surface: "bg-red text-brand-black",
  },
  {
    title: ["Digital", "Marketing"],
    art: "ribbon",
    body: "Performance, brand and CRM run on the same data spine as everything else — so audience, creative and spend are optimised against outcomes rather than platform metrics.",
    surface: "bg-bg-4 text-brand-black",
  },
];

export default function ServiceMatrix() {
  return (
    <section id="services" className="bg-bg-secondary">
      <Reveal className="panel-row grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row">
        {SERVICES.map((service, i) => (
          <article
            key={service.title.join(" ")}
            data-reveal="wipe"
            style={stagger(i, 110)}
            className={`dot-art-host flex flex-col items-center overflow-hidden px-8 pt-14 pb-14 text-center first:rounded-tl-xl last:rounded-tr-xl ${service.surface}`}
          >
            <h3 className="font-display text-size10 leading-[1.1] font-bold tracking-[-0.01em] whitespace-nowrap uppercase">
              {service.title[0]}
              <br />
              {service.title[1]}
            </h3>

            <DotArt
              variant={service.art}
              className="my-12 w-full max-w-[280px] opacity-90"
            />

            <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-70">
              {String(i + 1).padStart(2, "0")} /{" "}
              {String(SERVICES.length).padStart(2, "0")}
            </p>

            <p className="mt-7 max-w-[36ch] font-mono text-size2 leading-[1.7] tracking-[0.05em] uppercase">
              {service.body}
            </p>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
