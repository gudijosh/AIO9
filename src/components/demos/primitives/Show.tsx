"use client";

import * as m from "motion/react-m";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const hidden = { opacity: 0, y: 12, scale: 0.98 };
const visible = { opacity: 1, y: 0, scale: 1 };

/**
 * Reveals its children when `when` becomes true. The element always keeps its
 * place in the layout, so nothing jumps while a demonstration plays.
 */
export function Show({
  when,
  delay = 0,
  className,
  children,
}: {
  when: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <m.div
      initial={hidden}
      animate={when ? visible : hidden}
      transition={{ duration: 0.45, ease, delay: when ? delay : 0 }}
      className={className}
    >
      {children}
    </m.div>
  );
}

const tones = {
  dark: "border-white/10 bg-midnight/92 text-white backdrop-blur-xl",
  light: "border-midnight/8 bg-white/95 text-midnight backdrop-blur-xl",
} as const;

/** A floating interface surface placed over the photograph. */
export function Panel({
  when,
  delay,
  tone = "dark",
  className,
  children,
}: {
  when: boolean;
  delay?: number;
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Show
      when={when}
      delay={delay}
      className={cn("rounded-2xl border p-3.5 shadow-float", tones[tone], className)}
    >
      {children}
    </Show>
  );
}

/** Small heading inside a panel. */
export function PanelTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-medium opacity-60", className)}>{children}</p>;
}
