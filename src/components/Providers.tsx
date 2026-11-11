"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** Loads only the animation features we use and honours reduced-motion. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
