import type { StaticImageData } from "next/image";

/**
 * Three of the four portraits are the studio files as delivered. The fourth,
 * khandmaa-batbayar.webp, is re-cropped: she was shot from further back than
 * the others, and at the delivered framing her head filled 0.33 of the visible
 * 4:5 frame against 0.51-0.54 for the rest, with her eyeline 6 points lower.
 * In a row of four that does not read as one photograph among four, it reads
 * as one person standing behind the others.
 *
 * The crop is (193, 238)-(827, 1183) of the original 1000x1491 - the same 2:3
 * ratio, so it drops into the same component with no per-person handling, and
 * a straight crop rather than an upscale, so no pixel is invented. It puts her
 * head at 0.51 and her eyeline at 0.37, between Miyamoto and Imai.
 *
 * The consequence to know about: it is 634px wide, so above roughly a 1500px
 * viewport the browser upsamples it slightly where the other three still have
 * native pixels. If the studio ever supplies her file shot at the same
 * distance as the rest, replace it and delete this note - the numbers above
 * are what it would need to match. `git log` has the delivered original.
 */
import hatsumiImai from "@/public/leadership/hatsumi-imai.webp";
import khandmaaBatbayar from "@/public/leadership/khandmaa-batbayar.webp";
import makitoTsukahara from "@/public/leadership/makito-tsukahara.webp";
import yoshikiMiyamoto from "@/public/leadership/yoshiki-miyamoto.webp";

/**
 * The management team and the president's message, kept out of the two places
 * that render them — the homepage band and the /leadership route. Same reason
 * office-photos.ts exists: one set of facts about real people, stated once, so
 * a title can never be right in one place and stale in the other.
 *
 * PRODUCT.md lists "named team members" among the things that must not be
 * invented. Everything here is supplied by the company: the four portraits are
 * the official studio set, the titles come from the management-team chart and
 * the executive-officer list, and the message is the president's own text.
 * Nothing below is written by the site.
 */

export type Leader = {
  name: string;
  /**
   * The name in its own script — kanji for the Japanese executives, Cyrillic
   * for the Mongolian one. It is on every internal listing of this team and
   * dropping it would drop half of how these people are actually named.
   *
   * Set in the sans stack, never the mono one: Azeret Mono has no CJK or
   * Cyrillic coverage and would fall back to a system face mid-line.
   */
  native: string;
  title: string;
  image: StaticImageData;
};

/**
 * Ordered as the org chart orders them: president, then the executive team.
 *
 * The chart also seats the president in the AI Executive Member box — she holds
 * both — and that second title is deliberately not shown. A person listed twice
 * in a row of four reads as a gap in the team rather than as one person doing
 * two jobs, and the row is a statement of who the company's leadership is, not
 * a reproduction of its reporting lines.
 */
export const LEADERS: Leader[] = [
  {
    name: "Hatsumi Imai",
    native: "今井初実",
    title: "President and Executive Officer",
    image: hatsumiImai,
  },
  {
    name: "Makito Tsukahara",
    native: "塚原牧人",
    title: "Vice President and Executive Officer",
    image: makitoTsukahara,
  },
  {
    name: "Khandmaa Batbayar",
    native: "Б.Хандмаа",
    title: "Digital Marketing Division, Executive Officer",
    image: khandmaaBatbayar,
  },
  {
    name: "Yoshiki Miyamoto",
    native: "宮本良樹",
    title: "Corporate Planning and Administration Division, Executive Officer",
    image: yoshikiMiyamoto,
  },
];

/** The president, pulled out by name rather than by index — the letter is hers
 *  specifically, and an index would follow the row if it were ever reordered. */
export const PRESIDENT = LEADERS[0];

/**
 * The president's message, one string per paragraph, as supplied.
 *
 * Two orthographic edits and no others, both to keep the letter consistent with
 * the site it is printed on rather than to change what it says:
 *   · "Dentsu Data Artist Mongolia" -> "Dentsu Data Artist Mongol", the legal
 *     entity name PRODUCT.md holds the site to.
 *   · "organization" -> "organisation", the spelling every other page uses.
 * Revert either by editing the sentence it appears in; nothing else depends on
 * them.
 */
export const MESSAGE: string[] = [
  "We are living in an era where generative AI is rapidly transforming the way businesses operate, create value, and compete on a global scale. As technology continues to evolve at an unprecedented speed, companies are expected not only to adopt new tools, but also to rethink how they work, collaborate, and deliver meaningful impact.",
  "At Dentsu Data Artist Mongol (DDAM), our ambition is to become a global AI development hub for the dentsu group. Based in Mongolia, DDAM brings together strong capabilities in digital advertising, BPO, data, engineering, and AI development. By combining operational excellence with advanced technology, we support business transformation and contribute to the growth of Dentsu Digital, dentsu Japan, and the broader dentsu group.",
  "Mongolia has the potential to serve as a strategic hub connecting global teams across regions such as the UK, Singapore, India, Taiwan, China, Indonesia, and Vietnam. By leveraging this unique position, DDAM will continue to strengthen cross-border collaboration and develop scalable AI solutions that create value beyond any single market.",
  "Our greatest strength is our people. DDAM is a team of talented and ambitious members who bring speed, creativity, and commitment to every challenge. As we continue to grow, we are also building the culture, systems, and governance needed to become a stronger and more sustainable organisation. I believe that when each member feels proud to be part of DDAM, understands our shared vision, and continues to learn and grow, we can create even greater value together.",
  "As President, I place great importance on staying close to the frontline, listening to our members, and communicating openly. Understanding not only what we do, but why we do it, is essential to building trust and moving forward as one team. Differences in culture and ways of working are not obstacles; they are opportunities to broaden our perspectives and create new possibilities.",
  "Looking ahead, DDAM will continue to pursue both business growth and operational excellence. While revenue growth is an important measure of our contribution to the dentsu group, sustainable growth can only be achieved when our people, culture, and operations grow together.",
  "Our vision is clear: to make DDAM an indispensable AI development hub for the dentsu group and a source of innovation from Mongolia to the world.",
  "Together, we will continue to challenge ourselves, strengthen our capabilities, and create the future through technology, collaboration, and people.",
];

/**
 * The line the homepage band quotes — the letter's own thesis, and the only
 * sentence in it that states an ambition rather than a method. Indexed off
 * MESSAGE rather than copied, so the two can never drift apart.
 */
export const PULL_QUOTE = MESSAGE[6];

/** The widths a portrait occupies in the homepage row of four, shared by the
 *  <Image> and anything that needs to resolve the same srcSet candidate. */
export const PORTRAIT_SIZES =
  "(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 88vw";
