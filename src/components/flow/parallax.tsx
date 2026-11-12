"use client";

import { createContext, use, useRef } from "react";
import { motionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Scroll-linked motion shared by the whole page.
 *
 * Every piece has a progress `p` through the viewport:
 *   -1  entering (from the right on large screens, from below on small ones)
 *    0  centred
 *   +1  leaving
 * Tiles use it to *assemble*: they start scattered (offset, rotated in 3D and
 * transparent) and fly into their place in the grid as `p` approaches 0, then
 * stay put. Nothing runs on a timer, so scrolling back plays it in reverse.
 * With reduced motion `p` stays at 0 and everything is simply in place.
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

/** Where a tile comes from before it settles into the grid. */
export interface Scatter {
  /** Offset in px while fully scattered (large screens). */
  x?: number;
  y?: number;
  /** Rotation in degrees while fully scattered. */
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  /** Small screens: which side it flies in from (-1 left, 1 right). */
  side?: -1 | 1;
  /** Set false to keep it opaque while it travels (e.g. the photograph). */
  fade?: boolean;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * A tile that assembles into the layout as it scrolls into view.
 * `progress` lets several tiles share one progress (an industry's tiles all
 * follow their chapter); without it the tile follows its own position.
 * Children can read the tile's progress with <Layer>.
 */
export function ParallaxTile({
  from,
  progress,
  className,
  children,
  ref,
  ...rest
}: {
  from?: Scatter;
  progress?: MotionValue<number>;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const local = useRef<HTMLDivElement>(null);
  const { horizontal } = use(FlowContext);
  const own = useTileProgress(local);
  // Stacked layouts are too tall for a shared progress, so each tile follows itself.
  const p = horizontal && progress ? progress : own;

  // 1 = fully scattered, 0 = in place. Settles a little before the centre.
  const amount = useTransform(p, (v) => {
    if (!from) return 0;
    const [settled, range] = horizontal ? [0.08, 0.85] : [0.42, 0.5];
    return smooth(clamp((-v - settled) / range, 0, 1));
  });
  const side = from?.side ?? 1;
  const x = useTransform(amount, (a) => a * (horizontal ? (from?.x ?? 0) : side * 150));
  const y = useTransform(amount, (a) => a * (horizontal ? (from?.y ?? 0) : 70));
  const rotateX = useTransform(amount, (a) => a * (horizontal ? (from?.rotateX ?? 0) : 12));
  const rotateY = useTransform(amount, (a) => a * (horizontal ? (from?.rotateY ?? 0) : side * -38));
  const rotateZ = useTransform(amount, (a) => a * (horizontal ? (from?.rotateZ ?? 0) : side * 6));
  const scale = useTransform(amount, (a) => 1 - a * (1 - (from?.scale ?? 0.82)));
  const opacity = useTransform(amount, (a) =>
    from?.fade === false ? 1 : 1 - clamp((a - 0.3) / 0.6, 0, 1),
  );

  return (
    <m.div
      ref={(node) => {
        local.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ x, y, rotateX, rotateY, rotateZ, scale, opacity, transformPerspective: 1200 }}
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
