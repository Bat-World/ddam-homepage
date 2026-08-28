import { getImageProps } from "next/image";

import { ZONE_SIZES, ZONES } from "./office-photos";
import WarmImages, { type WarmSource } from "./warm-images";

/**
 * Server half of the warm-up: resolves each office photograph to the exact
 * `srcSet`/`sizes` the reel's <Image> will render, so the warm fetch and the
 * real one agree on a candidate. Rendering nothing itself — see WarmImages.
 */
export default function WarmPageImages() {
  const sources: WarmSource[] = ZONES.map((zone) => {
    const { props } = getImageProps({
      src: zone.image,
      alt: "",
      sizes: ZONE_SIZES,
    });

    return {
      src: props.src,
      srcSet: props.srcSet ?? "",
      sizes: props.sizes ?? ZONE_SIZES,
    };
  });

  return <WarmImages sources={sources} />;
}
