/**
 * Stagger helper for scroll reveals — `style={stagger(i)}` on a `data-reveal`
 * element walks the delay down a list. Capped so a long list doesn't leave the
 * last item waiting seconds after the first.
 *
 * This lives outside reveal.tsx deliberately. That file is a client module, and
 * a plain function exported from one can't be *called* by a server component —
 * across the boundary it's only a reference, not the function itself. Every
 * section here renders on the server, so the helper has to sit in a module with
 * no "use client" of its own.
 */
export function stagger(index: number, step = 90, max = 540) {
  return {
    "--reveal-delay": `${Math.min(index * step, max)}ms`,
  } as React.CSSProperties;
}
