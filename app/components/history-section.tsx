import Reveal from "./reveal";
import { stagger } from "./stagger";

/**
 * Company history — the light break between the two dark bands of About and
 * News, so the page doesn't run five dark sections together in its lower half.
 *
 * Newest first. The timeline answers "how did this get here" for someone who
 * has just read the current numbers above it, and that reader starts from
 * today, not from 2018.
 *
 * Dates are printed as the operations team records them (`2026.04`), not
 * localised — this is a corporate register, and the dotted form is the one that
 * appears in the group's own materials.
 */

const HISTORY = [
  {
    date: "2026.04",
    body: "The company has tripled in size over three years, to approximately 150 employees. Management structure transitioned to an Executive Officers system.",
  },
  { date: "2025.09", body: "Global Division established." },
  { date: "2024.01", body: "Digital Marketing Division established." },
  {
    date: "2023.04",
    body: "Data Artist was integrated into Dentsu Digital Inc., and DDAM became a subsidiary of Dentsu Digital.",
  },
  {
    date: "2019",
    body: "Started providing AI services in areas beyond marketing — HR, education and others.",
  },
  {
    date: "2018.06",
    body: "Joined the dentsu group. Dentsu Data Artist Mongol established as an R&D development centre in Mongolia.",
  },
];

export default function HistorySection() {
  return (
    <section id="history" className="surface-lift bg-bg-4 text-text-primary">
      <div className="mx-auto max-w-[1600px] px-6 py-32">
        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p
              data-reveal
              className="font-mono text-size2 tracking-[0.16em] uppercase"
            >
              History
            </p>
            <h2
              data-reveal
              style={stagger(1)}
              className="mt-7 font-display text-display-sm leading-[1.05] font-bold tracking-[-0.02em] uppercase"
            >
              Eight years,
              <br />
              three times the size.
            </h2>
          </div>

          <div className="border-t border-text-primary/25 pt-6">
            <p
              data-reveal
              style={stagger(2)}
              className="max-w-2xl text-lead leading-[1.65]"
            >
              DDAM opened in 2018 as an R&amp;D development centre for the
              dentsu group and has since become a Dentsu Digital subsidiary with
              its own marketing and global divisions — built in Ulaanbaatar,
              delivering across the network.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-20 border-t border-text-primary/25">
          <ol>
            {HISTORY.map((entry, i) => (
              <li
                key={entry.date}
                data-reveal
                style={stagger(i, 80)}
                className="grid gap-2 border-b border-text-primary/15 py-7 sm:grid-cols-[160px_1fr] sm:gap-8"
              >
                <p className="font-mono text-size2 tracking-[0.12em] uppercase opacity-70">
                  {entry.date}
                </p>
                <p className="max-w-[62ch] text-size6 leading-[1.6]">
                  {entry.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
