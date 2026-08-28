import type { StaticImageData } from "next/image";

import aiStudio from "@/public/office/ai-studio.webp";
import japanArea from "@/public/office/japan-area.webp";
import knowledgeHub from "@/public/office/knowledge-hub.webp";
import workSpace from "@/public/office/work-space.webp";

/**
 * The office reel's content, kept out of the section that renders it.
 *
 * Two places need it and only one of them draws it: the workspace section, and
 * the asset warmer that pulls these four photographs down while the launch
 * intro is still playing. The warmer has to reach them from a server component
 * (it needs `getImageProps`), and the section is a client module — everything
 * a client module exports crosses the boundary as a client reference, so plain
 * data can't be read back out of it. Hence a module of its own.
 */
export type Zone = {
  name: string;
  body: string;
  image: StaticImageData;
  /** Describes the room, not the label beside it — the caption is already text. */
  alt: string;
};

/** The widths the reel occupies, shared by the <Image> and its warm-up so the
 *  browser picks one srcset candidate rather than fetching two of them. */
export const ZONE_SIZES = "(min-width: 1024px) 45vw, 92vw";

/*
 * Four zones, because there are four photographs.
 *
 * The Mongolian area and the DDAM pub are real rooms with copy already written
 * for them, but no picture in the supplied set — and in a reel whose whole
 * mechanism is one photograph at a time, a zone with nothing to show is a hole
 * in the run, not a shorter list. They come back the moment their photography
 * does: the copy is in git and `mongolian-area.webp` is still in public/office.
 */
export const ZONES: Zone[] = [
  {
    name: "Work space",
    body: "Open-work zones supporting daily work, teamwork, focus tasks and international meetings and events.",
    image: workSpace,
    alt: "An open-plan floor of white bench desks under circular acoustic ceiling discs and linear lighting.",
  },
  {
    name: "Japan area",
    body: "Japanese culture meeting a cyberpunk event space, with a “Great Wave” feature wall carrying an IT circuit pattern.",
    image: japanArea,
    alt: "An event space with blue neon tracing a circuit pattern across the ceiling, a projection screen, and graphic murals either side.",
  },
  {
    name: "AI studio",
    body: "The technology and AI lab: high-tech laboratories with advanced computing infrastructure and smart presentation suites for AI engineering.",
    image: aiStudio,
    alt: "A black meeting room lit by linear track lighting, with a long pale table and an illuminated chrome figure on the far wall.",
  },
  {
    name: "Knowledge hub & library",
    body: "Deep work and continuous learning.",
    image: knowledgeHub,
    alt: "A library wall of arched alcoves holding books and patterned panels, with a red telephone box at one end.",
  },
];
