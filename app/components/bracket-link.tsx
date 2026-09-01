import Link from "next/link";

/**
 * CTA styled as a label inside four corner brackets — the brackets are drawn as
 * two-sided pseudo-boxes per corner rather than a full outline, so the frame
 * reads as registration marks instead of a button. On hover they widen, and
 * the nav's hover mark lights up in front of the label so a CTA and a nav link
 * answer the pointer the same way.
 *
 * Colour comes from `currentColor` on the link, so the brackets follow whatever
 * text colour the surrounding surface sets.
 */

const CORNER =
  "pointer-events-none absolute inset-0 before:absolute before:size-3 before:border-current before:transition-all after:absolute after:size-3 after:border-current after:transition-all group-hover:before:size-4 group-hover:after:size-4";

const SHELL =
  "group hover-mark hover-mark-cta relative inline-flex items-center px-8 py-4 font-mono text-size2 tracking-[0.18em] uppercase";

/**
 * Which element carries the href, decided by the href itself.
 *
 * A CTA on this site points at one of three things, and they want three
 * different elements:
 *
 *   · `#contact`  — an id on the page the reader is already on. Has to stay a
 *                   bare <a>: SmoothScroll claims exactly these, and routing it
 *                   through next/link would take the eased scroll away from it.
 *   · `mailto:`   — not a route at all.
 *   · `/leadership`, `/#contact` — another route on this site.
 *
 * That last case is the one this exists for. As a bare <a> it was a full
 * document load: the browser tears the page down, fetches and parses the bundle
 * again, and React mounts from scratch — which meant the launch overlay
 * remounted and played the whole rocket sequence in front of a reader who had
 * just clicked "read the message". next/link makes it a client-side transition
 * instead, so the route swaps in place with nothing to re-mount, and Next
 * prefetches the destination while the link is merely in view.
 */
function isInternalRoute(href: string) {
  return href.startsWith("/");
}

export default function BracketLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`${CORNER} before:top-0 before:left-0 before:border-t before:border-l after:right-0 after:bottom-0 after:border-r after:border-b`}
      />
      <span
        aria-hidden="true"
        className={`${CORNER} before:top-0 before:right-0 before:border-t before:border-r after:bottom-0 after:left-0 after:border-b after:border-l`}
      />
      <span className="transition-transform duration-300 ease-[var(--ease-brand)] motion-safe:group-hover:translate-x-[3px]">
        {children}
      </span>
    </>
  );

  if (isInternalRoute(href)) {
    return (
      <Link href={href} className={`${SHELL} ${className}`}>
        {body}
      </Link>
    );
  }

  return (
    <a href={href} className={`${SHELL} ${className}`}>
      {body}
    </a>
  );
}
