"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useCallback, useEffect, useState } from "react";

interface Options {
  /** How long each step stays on screen before the next one, in ms. */
  durations: readonly number[];
  /** Changing this restarts the timeline (one key per industry). */
  resetKey: string;
  /** The timeline only advances while this is true (stage is on screen). */
  enabled: boolean;
}

export interface DemoTimeline {
  step: number;
  total: number;
  playing: boolean;
  done: boolean;
  toggle: () => void;
  replay: () => void;
  goTo: (step: number) => void;
}

interface State {
  key: string;
  step: number;
  paused: boolean;
  touched: boolean;
}

/**
 * Deterministic step engine behind every industry demonstration.
 * It plays once and stops; nothing loops on its own. With reduced motion it
 * shows the finished state and lets the visitor step through manually.
 */
export function useDemoTimeline({ durations, resetKey, enabled }: Options): DemoTimeline {
  const reduced = usePrefersReducedMotion();
  const last = durations.length - 1;
  const [state, setState] = useState<State>({ key: resetKey, step: 0, paused: false, touched: false });

  if (state.key !== resetKey) {
    setState({ key: resetKey, step: 0, paused: false, touched: false });
  }

  const step = reduced && !state.touched ? last : Math.min(state.step, last);
  const done = step >= last;
  const playing = enabled && !reduced && !state.paused && !done;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setState((s) => (s.key === resetKey ? { ...s, step: s.step + 1 } : s));
    }, durations[step]);
    return () => window.clearTimeout(id);
  }, [playing, step, resetKey, durations]);

  const toggle = useCallback(() => setState((s) => ({ ...s, paused: !s.paused })), []);
  const replay = useCallback(
    () => setState((s) => ({ ...s, step: 0, paused: false, touched: true })),
    [],
  );
  const goTo = useCallback(
    (next: number) => setState((s) => ({ ...s, step: next, paused: true, touched: true })),
    [],
  );

  return { step, total: durations.length, playing, done, toggle, replay, goTo };
}
