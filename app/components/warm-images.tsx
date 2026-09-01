"use client";

import { useEffect } from "react";

export type WarmSource = { srcSet: string; src: string; sizes: string };

/**
 * Pulls the page's below-the-fold photography down while the launch intro is
 * still playing, so the leadership portraits and the office reel are already
 * decoded by the time anyone scrolls to them and never show a blur placeholder.
 *
 * The intro runs 2.6s over a hero that has nothing left to fetch, which is the
 * only window on this page where the connection is idle and the visitor is
 * occupied. `loading="lazy"` on the reel's <Image>s means that window would
 * otherwise go unused and the photographs would start downloading at the
 * moment they're scrolled into view — the one moment they're being looked at.
 *
 * Why detached <img> rather than `priority` on the reel, or a <link rel=
 * preload> in the head: both of those fetch on the critical path and compete
 * with the hero's own scripts and fonts for bandwidth. This starts after
 * hydration, at low priority, and can be declined outright on a metered
 * connection — the better part of a megabyte of decoration is not worth
 * someone's data plan. That last clause is the reason this list is allowed to
 * grow: every image added here is free on a fast connection and refused
 * entirely on a metered one.
 *
 * `srcSet`/`sizes` are the ones each section itself renders, handed down from
 * the server so the candidate picked here is the candidate the <img> later
 * wants; warming a different width would download the set twice. They arrive in
 * scroll order and are started in that order — see warm-page-images.tsx.
 */
export default function WarmImages({ sources }: { sources: WarmSource[] }) {
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    // Held in scope until they resolve: a detached image with no reference is
    // collectable, and a collected one may never finish its fetch.
    const pending: HTMLImageElement[] = [];

    for (const source of sources) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "low";
      img.sizes = source.sizes;
      img.srcset = source.srcSet;
      img.src = source.src;
      // Decoding too, not just fetching. A cached-but-undecoded photograph
      // still costs a frame the first time it's painted, and the reel paints
      // it mid-scroll.
      img.decode().catch(() => {});
      pending.push(img);
    }

    // Drop anything still in flight on unmount, so a visitor who leaves isn't
    // holding four requests open for a section they never reached.
    return () => {
      for (const img of pending) img.src = "";
    };
  }, [sources]);

  return null;
}
