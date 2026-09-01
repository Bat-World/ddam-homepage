import Link from "next/link";

/**
 * One navigation destination, rendered as whichever element its href needs.
 *
 * The site's navs are written as bare fragments (`#about`) and resolved against
 * where the reader is by resolveHref — see anchor-href.ts. That produces two
 * kinds of href from one list, and they want two different elements:
 *
 *   · `#about`  — an id on the page the reader is already on. Has to stay a
 *                 bare <a>, because SmoothScroll claims exactly these and eases
 *                 the page to them with the site's own scroll curve.
 *   · `/#about`, `/leadership` — another route. next/link, so the route swaps
 *                 in place instead of the browser tearing the document down,
 *                 refetching the bundle and mounting React from scratch. That
 *                 full reload is what used to replay the launch intro on every
 *                 link that left the page, and it still cost a blank frame and
 *                 a fresh parse after the intro learned to stay away.
 *
 * The test is the resolved href rather than a prop, so a caller cannot get the
 * pairing wrong: whatever resolveHref decided, this follows it.
 */
export default function NavLink({
  href,
  children,
  ...rest
}: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
