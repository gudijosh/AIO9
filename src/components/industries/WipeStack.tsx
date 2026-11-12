"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import * as m from "motion/react-m";
import { duration, ease } from "@/lib/motion";

export interface WipeImage {
  key: string;
  src: StaticImageData;
  alt: string;
  /** CSS object-position */
  focus: string;
}

const FULL = "inset(0% 0% 0% 0%)";

/**
 * A stack of photographs where the active one is revealed over the previous
 * one with a directional clip-path wipe while it settles from a slight zoom.
 * All images stay mounted, so switching never waits on the network.
 */
export function WipeStack({
  images,
  active,
  direction = 1,
  sizes,
  preloadFirst = false,
}: {
  images: readonly WipeImage[];
  active: number;
  direction?: 1 | -1;
  sizes: string;
  preloadFirst?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState({ active, previous: active });
  if (state.active !== active) setState({ active, previous: state.active });

  const from = direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

  return (
    <div className="absolute inset-0 bg-paper">
      {images.map((image, i) => {
        const isActive = i === state.active;
        const isPrevious = i === state.previous && !isActive;
        const transition = { duration: reduced || !isActive ? 0 : duration.scene, ease };
        return (
          <m.div
            key={image.key}
            className="absolute inset-0"
            style={{ zIndex: isActive ? 2 : isPrevious ? 1 : 0 }}
            initial={false}
            animate={{ clipPath: isActive ? [from, FULL] : FULL }}
            transition={transition}
          >
            <m.div
              className="absolute inset-0"
              initial={false}
              animate={
                isActive
                  ? { scale: [1.1, 1], x: [`${direction * 3}%`, "0%"] }
                  : { scale: 1, x: "0%" }
              }
              transition={transition}
            >
              <Image
                src={image.src}
                alt={isActive ? image.alt : ""}
                fill
                sizes={sizes}
                quality={85}
                placeholder="blur"
                preload={preloadFirst && i === 0}
                className="object-cover"
                style={{ objectPosition: image.focus }}
              />
            </m.div>
          </m.div>
        );
      })}
    </div>
  );
}
