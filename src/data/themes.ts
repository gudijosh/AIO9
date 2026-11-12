import type { CSSProperties } from "react";
import type { IndustryId } from "./industries";

/**
 * Each industry's software is its own product with its own colours, on
 * purpose outside the AIO9 palette. Every text/background pair here was
 * checked at 4.5:1 or better (see docs/ARCHITECTURE.md).
 */
export interface AppTheme {
  /** Brand colour of the product: buttons, active states, highlights. */
  accent: string;
  /** Text on top of `accent`. */
  on: string;
  /** Accent-coloured text on the window background. */
  ink: string;
  /** Tinted background for soft highlights. */
  soft: string;
  /** Window background and its text colours. */
  win: string;
  text: string;
  muted: string;
  /** Hairlines and neutral fills inside the window. */
  line: string;
  fill: string;
  /** Title bar. */
  chrome: string;
  chromeText: string;
  /** Side navigation. */
  side: string;
  sideText: string;
  /** Warnings and exceptions. */
  warnText: string;
  warnBg: string;
  /** Dark accent used on the page's light tiles (white text sits on it). */
  tileInk: string;
}

const LIGHT_WARN = { warnText: "#96560A", warnBg: "#FBEFD9" };

export const themes: Record<IndustryId, AppTheme> = {
  // Clinic schedule: calm teal on white.
  healthcare: {
    accent: "#0B7A70",
    on: "#FFFFFF",
    ink: "#0B7A70",
    soft: "#DFF3EF",
    win: "#FFFFFF",
    text: "#12332F",
    muted: "#4C6964",
    line: "rgb(18 51 47 / 0.12)",
    fill: "rgb(18 51 47 / 0.07)",
    chrome: "#F1FAF8",
    chromeText: "#12332F",
    side: "#F1FAF8",
    sideText: "#4C6964",
    ...LIGHT_WARN,
    tileInk: "#0B6B62",
  },
  // Reservations: a dark, warm floor app for evening service.
  hospitality: {
    accent: "#E8794A",
    on: "#24140E",
    ink: "#F29A72",
    soft: "#4A2A1C",
    win: "#221712",
    text: "#F6EAE2",
    muted: "#C9B2A5",
    line: "rgb(255 255 255 / 0.1)",
    fill: "rgb(255 255 255 / 0.09)",
    chrome: "#2C1E17",
    chromeText: "#F6EAE2",
    side: "#1B120D",
    sideText: "#C9B2A5",
    warnText: "#FFB59A",
    warnBg: "#4A2A1C",
    tileInk: "#9A3F14",
  },
  // Real-estate CRM: white workspace with a deep green frame.
  realEstate: {
    accent: "#1F6B4A",
    on: "#FFFFFF",
    ink: "#1F6B4A",
    soft: "#E2F0E8",
    win: "#FFFFFF",
    text: "#15281F",
    muted: "#53665C",
    line: "rgb(21 40 31 / 0.12)",
    fill: "rgb(21 40 31 / 0.07)",
    chrome: "#123B2A",
    chromeText: "#EAF4EE",
    side: "#123B2A",
    sideText: "#B9D3C5",
    warnText: "#8A5F12",
    warnBg: "#F6ECD6",
    tileInk: "#1F6B4A",
  },
  // Store back-office: bright raspberry on white.
  retail: {
    accent: "#C42B5C",
    on: "#FFFFFF",
    ink: "#B3204F",
    soft: "#FCE6ED",
    win: "#FFFFFF",
    text: "#2B1320",
    muted: "#73525F",
    line: "rgb(43 19 32 / 0.12)",
    fill: "rgb(43 19 32 / 0.06)",
    chrome: "#FFF5F8",
    chromeText: "#3A1524",
    side: "#FFF5F8",
    sideText: "#73525F",
    ...LIGHT_WARN,
    tileInk: "#B3204F",
  },
  // Document workspace: sober indigo with a dark icon rail.
  services: {
    accent: "#4B3FBF",
    on: "#FFFFFF",
    ink: "#4B3FBF",
    soft: "#EBE9FB",
    win: "#FFFFFF",
    text: "#1B1838",
    muted: "#5B5778",
    line: "rgb(27 24 56 / 0.12)",
    fill: "rgb(27 24 56 / 0.06)",
    chrome: "#F6F5FD",
    chromeText: "#1B1838",
    side: "#221D4E",
    sideText: "#B8B3E0",
    ...LIGHT_WARN,
    tileInk: "#4338B0",
  },
  // Operations console: charcoal with amber signals.
  logistics: {
    accent: "#F5A524",
    on: "#17130A",
    ink: "#F8B84E",
    soft: "#3A2E17",
    win: "#171A1F",
    text: "#EEF1F4",
    muted: "#A3ADB8",
    line: "rgb(255 255 255 / 0.1)",
    fill: "rgb(255 255 255 / 0.08)",
    chrome: "#0F1215",
    chromeText: "#EEF1F4",
    side: "#0F1215",
    sideText: "#A3ADB8",
    warnText: "#FF8A6B",
    warnBg: "#3F221B",
    tileInk: "#855400",
  },
};

/** Exposes a theme as CSS variables for everything inside an industry chapter. */
export function themeVars(theme: AppTheme): CSSProperties {
  return {
    "--app": theme.accent,
    "--app-on": theme.on,
    "--app-ink": theme.ink,
    "--app-soft": theme.soft,
    "--win": theme.win,
    "--win-text": theme.text,
    "--win-muted": theme.muted,
    "--win-line": theme.line,
    "--win-fill": theme.fill,
    "--win-chrome": theme.chrome,
    "--win-chrome-text": theme.chromeText,
    "--side": theme.side,
    "--side-text": theme.sideText,
    "--warn-text": theme.warnText,
    "--warn-bg": theme.warnBg,
    "--tile-ink": theme.tileInk,
  } as CSSProperties;
}
