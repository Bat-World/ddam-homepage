/**
 * In-page anchors, resolved against where the reader currently is.
 *
 * The header and footer navs are written as bare fragments (`#about`) because
 * the site was a single page. It isn't any more — article routes live under
 * /news/… — and on one of those a bare `#about` points at an id that doesn't
 * exist, so the link silently does nothing.
 *
 * Off the homepage they become `/#about`: the same destination stated
 * absolutely, which the browser resolves as a route change plus a fragment.
 * On the homepage they stay bare, and that distinction is load-bearing rather
 * than cosmetic — SmoothScroll only intercepts hrefs beginning with `#`, so a
 * bare fragment eases with the page's own scroll curve while `/#about` would
 * fall through to a native jump on the page the reader is already on.
 */
export function resolveHref(href: string, onHome: boolean) {
  return onHome || !href.startsWith("#") ? href : `/${href}`;
}
