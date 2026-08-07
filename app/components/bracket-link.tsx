/**
 * CTA styled as a label inside four corner brackets — the brackets are drawn as
 * two-sided pseudo-boxes per corner rather than a full outline, so the frame
 * reads as registration marks instead of a button. On hover they widen.
 *
 * Colour comes from `currentColor` on the link, so the brackets follow whatever
 * text colour the surrounding surface sets.
 */

const CORNER =
  "pointer-events-none absolute inset-0 before:absolute before:size-3 before:border-current before:transition-all after:absolute after:size-3 after:border-current after:transition-all group-hover:before:size-4 group-hover:after:size-4";

export default function BracketLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center px-8 py-4 font-mono text-size2 tracking-[0.18em] uppercase transition-opacity hover:opacity-70 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`${CORNER} before:top-0 before:left-0 before:border-t before:border-l after:right-0 after:bottom-0 after:border-r after:border-b`}
      />
      <span
        aria-hidden="true"
        className={`${CORNER} before:top-0 before:right-0 before:border-t before:border-r after:bottom-0 after:left-0 after:border-b after:border-l`}
      />
      {children}
    </a>
  );
}
