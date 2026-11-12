"use client";

import { cn } from "@/lib/cn";
import { ParallaxTile, type Depth } from "./parallax";

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
 * One piece of the mosaic. Its `drift`, `lift` and `tilt` give it a depth of
 * its own, so neighbouring tiles slide past each other as the page scrolls.
 */
export function Tile({
  surface = "glass",
  className,
  children,
  ...rest
}: Depth & {
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
