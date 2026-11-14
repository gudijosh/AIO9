"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { WINDOW_H, WINDOW_W } from "../windows/kit";

/**
 * Scales a fixed-size product window (760×480) to the width of its
 * container, like a screenshot, so its layout is identical on every screen.
 */
export function Fit({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / WINDOW_W));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ aspectRatio: `${WINDOW_W} / ${WINDOW_H}` }}>
      <div
        className="absolute top-0 left-0 origin-top-left transition-opacity duration-300"
        style={{ width: WINDOW_W, height: WINDOW_H, transform: `scale(${scale ?? 0.4})`, opacity: scale === null ? 0 : 1 }}
      >
        {children}
      </div>
    </div>
  );
}
