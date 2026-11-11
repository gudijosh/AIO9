/** Shared motion tokens, mirrored by --ease-signal in globals.css. */
export const ease = [0.16, 1, 0.3, 1] as const;

export const duration = {
  /** Micro-interactions: 150–350 ms */
  micro: 0.28,
  /** Component reveals */
  base: 0.5,
  /** Scene transitions: 450–850 ms */
  scene: 0.8,
} as const;
