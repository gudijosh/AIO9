"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/cn";
import { usePinned } from "./useIsDesktop";

/**
 * A scene with several panels. On desktop the screen stays pinned and each
 * panel takes one screen of scrolling; elsewhere (and with reduced motion)
 * the panels are simply stacked. Every panel is always in the document, in
 * reading order; focusing something inside a hidden panel scrolls to it.
 */
export function SteppedScene({
  id,
  count,
  label,
  className,
  children,
}: {
  id?: string;
  count: number;
  label?: string;
  className?: string;
  /** `live` is true while that panel is the one on screen. */
  children: (index: number, live: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const pinned = usePinned();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const inView = useInView(ref, { amount: 0.05 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!pinned) return;
    setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count))));
  });

  const goTo = (index: number) => {
    const node = ref.current;
    if (!node || !pinned) return;
    const span = node.offsetHeight - window.innerHeight;
    const top = node.getBoundingClientRect().top + window.scrollY + ((index + 0.5) / count) * span;
    window.scrollTo({ top });
  };

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      style={{ "--scene-h": `${(count + 1) * 100}svh` } as CSSProperties}
      className={cn("relative bg-ink lg:motion-safe:h-(--scene-h)", className)}
    >
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:overflow-hidden">
        {Array.from({ length: count }, (_, i) => {
          const isActive = active === i;
          return (
            <Panel
              key={i}
              pinned={pinned}
              active={isActive}
              sectionInView={inView}
              onFocusInside={() => !isActive && goTo(i)}
            >
              {(live) => children(i, live)}
            </Panel>
          );
        })}
      </div>
    </section>
  );
}

function Panel({
  pinned,
  active,
  sectionInView,
  onFocusInside,
  children,
}: {
  pinned: boolean;
  active: boolean;
  sectionInView: boolean;
  onFocusInside: () => void;
  children: (live: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const live = pinned ? active && sectionInView : inView;
  return (
    <div
      ref={ref}
      data-active={pinned ? active : true}
      onFocusCapture={onFocusInside}
      className={cn(
        "relative min-h-svh overflow-hidden lg:motion-safe:absolute lg:motion-safe:inset-0 lg:motion-safe:min-h-0",
        "lg:motion-safe:transition-[opacity,transform] lg:motion-safe:duration-500 lg:motion-safe:ease-(--ease-signal)",
        "lg:motion-safe:data-[active=false]:pointer-events-none lg:motion-safe:data-[active=false]:translate-y-6 lg:motion-safe:data-[active=false]:opacity-0",
      )}
    >
      {children(live)}
    </div>
  );
}
