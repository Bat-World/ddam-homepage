import { LOGO_PATHS, LOGO_VIEWBOX } from "./components/logo-mark";

/**
 * The logo mark as a data URI, for the generated icon/OG images.
 *
 * `next/og` renders through satori, which draws `<img>` but not inline SVG
 * children — so the same paths the React component uses get serialised once
 * here rather than being duplicated as a second copy of the artwork.
 */
export function markDataUri(fill: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}" fill="${fill}">` +
    LOGO_PATHS.map((d) => `<path d="${d}"/>`).join("") +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
