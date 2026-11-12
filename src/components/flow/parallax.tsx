"use client";

import { createContext, use, useRef } from "react";
import { motionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Scroll-linked parallax shared by the whole page.
 *
 * Every tile computes its own progress `p`:
 *   -1  entering (from the right on large screens, from below on small ones)
 *    0  centred in the viewport
 *   +1  leaving
 * and everything else (drift, tilt, scale, inner layers) derives from it,
 * so each piece moves at its own pace and nothing animates on a timer.
 * With reduced motion `p` stays at 0 and the page is static.
 */

interface FlowState {
  /** Horizontal travel of the mosaic track, in px (0 or negative). */
  trackX: MotionValue<number>;
  /** True while the mosaic is pinned and moves sideways. */
  horizontal: boolean;
}

const still = motionValue(0);
export const FlowContext = createContext<FlowState>({ trackX: still, horizontal: false });
const ProgressContext = createContext<MotionValue<number>>(still);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Progress of one element through the viewport, on whichever axis the page is moving. */
export function useTileProgress(ref: React.RefObject<HTMLElement | null>): MotionValue<number> {
  const { trackX, horizontal } = use(FlowContext);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform([trackX, scrollYProgress], ([x, vertical]: number[]) => {
    const element = ref.current;
    if (reduced || !element || typeof window === "undefined") return 0;
    if (!horizontal) return clamp((vertical - 0.5) * 2, -1, 1);
    const centre = element.offsetLeft + element.offsetWidth / 2 + x;
    return clamp(-(centre - window.innerWidth / 2) / (window.innerWidth * 0.8), -1.4, 1.4);
  });
}

export interface Depth {
  /** Sideways drift. Negative = foreground (faster), positive = background (slower). */
  drift?: number;
  /** Vertical spread away from the centre line (large screens). */
  lift?: number;
  /** Strength of the 3D tilt, 0–1. */
  tilt?: number;
}

/**
 * A block that moves through the viewport with its own depth. Children can
 * read the same progress with <Layer> to move at yet another pace.
 */
export function ParallaxTile({
  drift = 0,
  lift = 0,
  tilt = 1,
  className,
  children,
  ref,
  ...rest
}: Depth & {
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const local = useRef<HTMLDivElement>(null);
  const { horizontal } = use(FlowContext);
  const p = useTileProgress(local);

  const x = useTransform(p, (v) => (horizontal ? v * drift * 80 : 0));
  // Stacked neighbours spread apart away from the centre, so they never collide.
  const y = useTransform(p, (v) => (horizontal ? Math.abs(v) * lift * 46 : v * drift * -26));
  const scale = useTransform(p, (v) => 1 - Math.min(1, Math.abs(v)) ** 2 * (horizontal ? 0.12 : 0.07));
  const rotateY = useTransform(p, (v) => (horizontal ? v * 9 * tilt : 0));
  const rotateX = useTransform(p, (v) => (horizontal ? 0 : v * -5 * tilt));


  return (
    <m.div
      ref={(node) => {
        local.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ x, y, scale, rotateX, rotateY, transformPerspective: 1400 }}
      className={cn("will-change-transform", className)}
      {...rest}
    >
      <ProgressContext value={p}>{children}</ProgressContext>
    </m.div>
  );
}

/**
 * A layer inside a ParallaxTile that slides against it (e.g. a photograph
 * moving inside its frame). `shift` is the travel in px at the edges.
 */
export function Layer({
  shift,
  zoom = 1,
  className,
  children,
  ...rest
}: {
  shift: number;
  /** Scale applied so a shifted layer never shows its edges. */
  zoom?: number;
  className?: string;
  children: React.ReactNode;
  "aria-hidden"?: boolean;
}) {
  const p = use(ProgressContext);
  const { horizontal } = use(FlowContext);
  const x = useTransform(p, (v) => (horizontal ? v * shift : 0));
  const y = useTransform(p, (v) => (horizontal ? 0 : v * shift));
  return (
    <m.div style={{ x, y, scale: zoom }} className={className} {...rest}>
      {children}
    </m.div>
  );
}

/**
 * Moves with the page scroll at a fraction of its speed (hero layers).
 * `speed` 0.3 lags behind the scroll, negative values run ahead of it.
 * `fade` is the scroll distance in px over which it fades out.
 */
export function Drift({
  speed,
  fade,
  className,
  children,
}: {
  speed: number;
  fade?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  // Small screens stack the hero, so layers travel less to avoid crossing the copy.
  const y = useTransform(scrollY, (value) => {
    if (reduced || typeof window === "undefined") return 0;
    return value * speed * (window.innerWidth < 1024 ? 0.3 : 1);
  });
  const opacity = useTransform(scrollY, (value) => (fade && !reduced ? clamp(1 - value / fade, 0, 1) : 1));
  return (
    <m.div style={{ y, opacity }} className={className}>
      {children}
    </m.div>
  );
}

/** Grows into place as it scrolls into view (the closing contact card). */
export function Arrive({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, (v) => (reduced ? 1 : 0.86 + v * 0.14));
  const y = useTransform(scrollYProgress, (v) => (reduced ? 0 : (1 - v) * 110));
  return (
    <m.div ref={ref} style={{ scale, y }} className={className}>
      {children}
    </m.div>
  );
}
