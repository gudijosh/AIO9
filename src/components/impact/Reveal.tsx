"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const FROM = {
  left: "motion-safe:[transform:perspective(1400px)_translate3d(-9%,0,0)_rotateY(22deg)]",
  right:
    "motion-safe:[transform:perspective(1400px)_translate3d(9%,0,0)_rotateY(-22deg)]",
  up: "motion-safe:[transform:perspective(1400px)_translate3d(0,48px,0)_rotateX(-18deg)]",
} as const;

/**
 * Plays an entrance once, the first time its content scrolls into view:
 * it eases in from one side while turning in 3D. Content already on screen
 * when the page loads is simply shown. Without JavaScript, or with reduced
 * motion, everything is visible from the start.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  from?: keyof typeof FROM;
  /** Extra wait before it starts, in ms (to stagger a pair). */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    // Armed only after measuring where the element really is.
    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : undefined }}
      className={cn(
        "motion-safe:transition-[opacity,transform] motion-safe:duration-[900ms] motion-safe:ease-(--ease-signal)",
        state === "hidden" && cn("motion-safe:opacity-0", FROM[from]),
        className,
      )}
    >
      {children}
    </div>
  );
}
