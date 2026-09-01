import { getImageProps } from "next/image";

import { LEADERS, PORTRAIT_SIZES } from "./leadership";
import { ZONE_SIZES, ZONES } from "./office-photos";
import WarmImages, { type WarmSource } from "./warm-images";

/**
 * Server half of the warm-up: resolves each of the homepage's photographs to
 * the exact `srcSet`/`sizes` its <Image> will render, so the warm fetch and the
 * real one agree on a candidate. Rendering nothing itself — see WarmImages.
 *
 * Order is scroll order, and it is load-bearing: these are fetched in sequence
 * at low priority, so whatever is listed first is whatever is ready first. The
 * leadership portraits sit above the office reel on the page, so they are
 * warmed above it here. Reversing the two lists would spend the intro's idle
 * window on the band a visitor reaches second.
 */

type Target = { image: Parameters<typeof getImageProps>[0]["src"]; sizes: string };

const TARGETS: Target[] = [
  ...LEADERS.map((leader) => ({ image: leader.image, sizes: PORTRAIT_SIZES })),
  ...ZONES.map((zone) => ({ image: zone.image, sizes: ZONE_SIZES })),
];

export default function WarmPageImages() {
  const sources: WarmSource[] = TARGETS.map((target) => {
    const { props } = getImageProps({
      src: target.image,
      alt: "",
      sizes: target.sizes,
    });

    return {
      src: props.src,
      srcSet: props.srcSet ?? "",
      sizes: props.sizes ?? target.sizes,
    };
  });

  return <WarmImages sources={sources} />;
}
