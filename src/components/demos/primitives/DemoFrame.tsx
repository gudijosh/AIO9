"use client";

import * as m from "motion/react-m";
import { ease } from "@/lib/motion";

/**
 * Layout shared by every demonstration. On large screens panels float over
 * the photograph (absolute positions); on small screens they stack below it.
 */
export function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col gap-2.5 px-3 lg:block lg:h-full lg:px-0">{children}</div>
  );
}

/**
 * The AIO9 Signal travelling between two panels (large screens only).
 * `d` is drawn in a 100×100 box stretched over the stage; its ends sit
 * underneath the panels it connects. `axis` is the direction it is drawn in.
 */
export function Connector({
  when,
  d,
  axis = "x",
}: {
  when: boolean;
  d: string;
  axis?: "x" | "y" | "-x";
}) {
  const closed =
    axis === "x" ? "inset(0% 100% 0% 0%)" : axis === "-x" ? "inset(0% 0% 0% 100%)" : "inset(0% 0% 100% 0%)";
  return (
    <m.svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden size-full lg:block"
      initial={{ clipPath: closed }}
      animate={{ clipPath: when ? "inset(0% 0% 0% 0%)" : closed }}
      transition={{ duration: 0.7, ease }}
    >
      <path
        d={d}
        fill="none"
        stroke="rgb(255 255 255 / 0.5)"
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
      />
    </m.svg>
  );
}
