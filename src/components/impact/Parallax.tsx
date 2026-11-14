"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * True once the page is running in the browser with motion allowed. Until
 * then every effect here renders its content plainly, so the page reads
 * without JavaScript and with reduced motion.
 */
const noop = () => () => {};

export function useMotionReady(): boolean {
  const reduced = usePrefersReducedMotion();
  // False on the server and during hydration, true afterwards.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return mounted && !reduced;
}

const SPRING = { stiffness: 140, damping: 26, mass: 0.35 };

/**
 * Scroll-driven 3D arrival: the content swings in from one side towards the
 * centre as it climbs the screen, and swings back if you scroll up again.
 */
export function Fly({
  children,
  from,
  className,
}: {
  children: ReactNode;
  from: "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMotionReady();
  const dir = from === "left" ? -1 : 1;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1.05", "start 0.68"],
  });
  const p = useSpring(scrollYProgress, SPRING);
  const x = useTransform(p, [0, 1], [`${dir * 38}%`, "0%"]);
  const rotateY = useTransform(p, [0, 1], [dir * -48, 0]);
  const rotateZ = useTransform(p, [0, 1], [dir * 5, 0]);
  const scale = useTransform(p, [0, 1], [0.78, 1]);
  const opacity = useTransform(p, [0, 0.45], [0, 1]);
  return (
    <div ref={ref} className={className}>
      <m.div
        style={
          ready
            ? {
                x,
                rotateY,
                rotateZ,
                scale,
                opacity,
                transformPerspective: 1300,
              }
            : undefined
        }
      >
        {children}
      </m.div>
    </div>
  );
}

/**
 * Parallax drift: the content moves a little slower or faster than the page
 * while it crosses the screen. `speed` is the total travel in pixels;
 * negative values move against the scroll.
 */
export function Drift({
  children,
  speed,
  className,
}: {
  children: ReactNode;
  speed: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMotionReady();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);
  return (
    <div ref={ref} className={className}>
      <m.div style={ready ? { y } : undefined}>{children}</m.div>
    </div>
  );
}

/**
 * Transition into a section: as its top edge climbs the screen, two solid
 * panels that cover it slide away sideways, one after the other, uncovering
 * the content. Place it as the first child of a `relative` section.
 */
export function Curtain({
  to,
  colors = ["var(--color-azure)", "var(--color-volt)"],
}: {
  to: "left" | "right";
  colors?: [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMotionReady();
  const dir = to === "left" ? -1 : 1;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.2"],
  });
  const p = useSpring(scrollYProgress, SPRING);
  const front = useTransform(p, [0.12, 0.72], ["0%", `${dir * 102}%`]);
  const back = useTransform(p, [0.3, 0.95], ["0%", `${dir * 102}%`]);
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-30 h-svh overflow-hidden",
        !ready && "hidden",
      )}
    >
      <m.div
        style={{ x: back, background: colors[1] }}
        className="absolute inset-0"
      />
      <m.div
        style={{ x: front, background: colors[0] }}
        className="absolute inset-0"
      />
    </div>
  );
}
