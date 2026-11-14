import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * One oversized word in dotted display type behind a scene. Decorative: the
 * same word is always present as real text nearby.
 */
export function DotWord({ word, color, className }: { word: string; color: string; className?: string }) {
  // The word is sized to span the scene whatever its length.
  const size = `min(${(92 / (word.length * 0.385)).toFixed(1)}vw, 46svh)`;
  return (
    <div
      aria-hidden
      style={{ color, "--word": size } as CSSProperties}
      className={cn(
        "display dots text-[min(24vw,var(--word))] lg:text-(--word) pointer-events-none absolute inset-x-0 top-[9svh] text-center whitespace-nowrap opacity-60 select-none",
        className,
      )}
    >
      {word}
    </div>
  );
}
