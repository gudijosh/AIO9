"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * A sector name drawn as a panel of LED dots in its own colour. As it
 * travels up the screen a band of light sweeps across the dots, they glow
 * brighter around the middle, and the word drifts slightly sideways.
 * Decorative: the real name is always in the text next to it.
 */
export function LedWord({ word, color }: { word: string; color: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The band of light crosses the word between 15% and 70% of its trip.
  const shine = useTransform(scrollYProgress, [0.15, 0.7], ["130%", "-30%"]);
  const glow = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.75, 1],
    [0.15, 0.6, 1, 0.55, 0.2],
  );
  const filter = useTransform(
    glow,
    (v) =>
      `drop-shadow(0 0 ${(v * 0.09).toFixed(3)}em ${color}) drop-shadow(0 0 ${(v * 0.3).toFixed(3)}em ${color})`,
  );
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  // As large as the design allows, but never wider than its column.
  const fontSize = `min(clamp(1.75rem, 11vw, 8.5rem), ${(41 / (word.length * 0.4)).toFixed(2)}vw)`;

  return (
    <m.p
      ref={ref}
      aria-hidden
      style={{
        fontSize,
        ...(reduced
          ? { filter: `drop-shadow(0 0 0.12em ${color})` }
          : { filter, x }),
      }}
      className="display flex min-h-[10vw] items-end whitespace-nowrap select-none lg:min-h-0"
    >
      <m.span
        style={{
          backgroundImage: `linear-gradient(105deg, ${color} 38%, #fff 50%, ${color} 62%)`,
          backgroundSize: "260% 100%",
          backgroundPositionX: reduced ? "130%" : shine,
        }}
        className="dots inline-block bg-clip-text text-transparent [mask-size:max(3px,0.05em)_max(3px,0.05em)]"
      >
        {word}
      </m.span>
    </m.p>
  );
}
