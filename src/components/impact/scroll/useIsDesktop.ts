"use client";

import { useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const QUERY = "(min-width: 1024px)";

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/** Hydration-safe: `false` on the server and on the first client render. */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Scenes are pinned (the screen stays still while scrolling advances them)
 * only on desktop and only when the visitor has not asked for reduced motion.
 * The CSS uses `lg:motion-safe:` for the same condition, so layout never
 * depends on this hook; it only switches behaviour.
 */
export function usePinned(): boolean {
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  return desktop && !reduced;
}
