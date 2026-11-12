"use client";

import * as m from "motion/react-m";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const surfaces = {
  /** Semi-transparent glass over the coloured backdrop. */
  glass: "glass text-midnight",
  ink: "bg-midnight text-white shadow-glass",
  blue: "bg-signal text-white shadow-glass",
  /** Backdrop of the illustrated objects. */
  paper: "border border-white bg-paper text-midnight shadow-glass",
  /** No surface: type sits directly on the page. */
  bare: "text-midnight",
} as const;

export type TileSurface = keyof typeof surfaces;

/**
 * One piece of the mosaic. Tiles arrive from the right the first time they
 * come into view, which is what makes the services appear to flow in as the
 * track moves from right to left.
 */
export function Tile({
  surface = "glass",
  delay = 0,
  className,
  children,
  ref,
  ...rest
}: {
  surface?: TileSurface;
  delay?: number;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  id?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, x: 90, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease, delay }}
      className={cn("rounded-[28px]", surfaces[surface], className)}
      {...rest}
    >
      {children}
    </m.div>
  );
}
