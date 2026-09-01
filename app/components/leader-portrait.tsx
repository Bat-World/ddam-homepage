import Image from "next/image";

import { PORTRAIT_SIZES, type Leader } from "./leadership";

/**
 * One person: the portrait, then the name, then the title.
 *
 * Rendered identically by the homepage band and the /leadership route, which is
 * the point — the same four faces appear twice on this site and a visitor who
 * follows the link from one to the other should arrive at the row they just
 * left, not at a second design of it.
 *
 * `alt` is empty on purpose, and this is the one place on the site where that
 * is right. office-photos.ts sets the rule the other way round — a photograph
 * of a room is described, because the room is information the caption doesn't
 * carry — and a headshot is the opposite case: everything the page is saying
 * with this picture is already in the <figcaption> under it, in text, and the
 * only thing an alt could add is a description of a real person's appearance
 * that nobody asked to have published. Four near-identical "studio portrait
 * against a grey backdrop" strings would be noise read aloud, four times.
 *
 * The frame is a fixed 4:5 crop of a 2:3 original. `object-top` rather than
 * centre: the set is shot head-and-shoulders with the face in the upper half,
 * so the sixth of the height that has to go is the bottom of the shirt.
 */
export default function LeaderPortrait({
  leader,
  /** First in the reading order gets the eager fetch on /leadership, where the
   *  row is the page's opening image rather than something scrolled to. */
  priority = false,
}: {
  leader: Leader;
  priority?: boolean;
}) {
  return (
    <figure className="portrait-card">
      <div className="portrait-frame relative aspect-[4/5]">
        <Image
          src={leader.image}
          alt=""
          placeholder="blur"
          sizes={PORTRAIT_SIZES}
          priority={priority}
          className="portrait-photo size-full object-cover object-top"
        />
      </div>

      <figcaption className="mt-6 border-t border-mixed/50 pt-5">
        <p className="font-display text-size9 leading-[1.2] font-medium tracking-[-0.01em] text-brand-white uppercase">
          {leader.name}
        </p>
        {/* Sans, not mono — Azeret Mono has no kanji or Cyrillic and would fall
            through to a system face mid-line. Same reason the ethos pillars set
            their Japanese in the sans stack. */}
        <p className="mt-2 font-sans text-size4 leading-[1.4] text-light-gray">
          {leader.native}
        </p>
        {/* 30ch, not the ~26 the longest title actually counts: `ch` measures
            the zero glyph and knows nothing about letter-spacing, and 0.12em of
            it makes every character about 1.12ch wide. At 26 the cap fell
            inside the column and broke "Executive Vice President" across two
            lines while the column had room for it. */}
        <p className="mt-4 max-w-[30ch] font-mono text-size2 leading-[1.6] tracking-[0.12em] text-text-3 uppercase">
          {leader.title}
        </p>
      </figcaption>
    </figure>
  );
}
