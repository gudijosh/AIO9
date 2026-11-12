"use client";

import { cn } from "@/lib/cn";
import type { MotionValue } from "motion/react";
import { ParallaxTile, type Scatter } from "./parallax";

const surfaces = {
  /** Semi-transparent glass over the coloured backdrop. */
  glass: "glass text-midnight",
  ink: "bg-midnight text-white shadow-glass",
  blue: "bg-signal text-white shadow-glass",
  /** Studio backdrop of the industry photographs. */
  paper: "border border-white bg-paper text-midnight shadow-glass",
  /** No surface: type sits directly on the page. */
  bare: "text-midnight",
} as const;

export type TileSurface = keyof typeof surfaces;

/**
 * One piece of the mosaic. `from` says where it flies in from before it
 * settles into the grid; `progress` ties it to its chapter.
 */
export function Tile({
  surface = "glass",
  className,
  children,
  ...rest
}: {
  from?: Scatter;
  progress?: MotionValue<number>;
  surface?: TileSurface;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  id?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <ParallaxTile className={cn("rounded-[28px]", surfaces[surface], className)} {...rest}>
      {children}
    </ParallaxTile>
  );
}
