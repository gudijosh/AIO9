import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/i18n/config";

/** Design size of every product window. They are scaled to fit, never reflowed. */
export const WINDOW_W = 760;
export const WINDOW_H = 480;

/** Colours of one product window. Each product has its own, on purpose. */
export interface WindowTheme {
  bg: string;
  ink: string;
  muted: string;
  line: string;
  chrome: string;
  side: string;
  sideText: string;
  sideLine: string;
  /** Brand colour of the product and the text colour that sits on it. */
  app: string;
  on: string;
  /** "Online" indicator in the side bar. */
  ok: string;
}

/** What every product window receives. `step` drives its whole state. */
export interface WindowProps {
  step: number;
  locale: Locale;
  /** "Illustrative simulation" label, shown in the title bar. */
  simulation: string;
}

export function WindowShell({
  theme: c,
  app,
  nav,
  online,
  status,
  top,
  simulation,
  children,
}: {
  theme: WindowTheme;
  /** Product name in the title bar. */
  app: string;
  /** Side navigation; the first entry is the active one. */
  nav: readonly string[];
  /** "Online" label. */
  online: string;
  /** Two short lines under the online indicator. */
  status: readonly string[];
  /** Extra content in the title bar, after the product name. */
  top?: ReactNode;
  simulation: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: WINDOW_W,
        height: WINDOW_H,
        borderRadius: 18,
        overflow: "hidden",
        background: c.bg,
        color: c.ink,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${c.line}`,
        fontSize: 12,
        lineHeight: 1.35,
        textAlign: "left",
      }}
    >
      <div
        style={{
          height: 40,
          background: c.chrome,
          borderBottom: `1px solid ${c.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          flex: "none",
        }}
      >
        {["#f0a6a0", "#f1d08a", "#9fd4a8"].map((dot) => (
          <i key={dot} style={{ width: 10, height: 10, borderRadius: 10, background: dot }} />
        ))}
        <b style={{ marginLeft: 10, fontSize: 13 }}>{app}</b>
        {top}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: c.muted,
            border: `1px solid ${c.line}`,
            borderRadius: 20,
            padding: "3px 11px",
          }}
        >
          {simulation}
        </span>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div
          style={{
            width: 138,
            background: c.side,
            color: c.sideText,
            padding: "14px 10px",
            flex: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {nav.map((item, i) => (
            <div
              key={item}
              style={{
                padding: "9px 11px",
                borderRadius: 9,
                marginBottom: 3,
                ...(i === 0 ? { background: c.app, color: c.on, fontWeight: 600 } : null),
              }}
            >
              {item}
            </div>
          ))}
          <div
            style={{
              marginTop: "auto",
              borderTop: `1px solid ${c.sideLine}`,
              paddingTop: 10,
              fontSize: 10.5,
              lineHeight: 1.5,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.ok }}>
              <Dot color={c.ok} />
              {online}
            </span>
            {status.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Shows its children once the demonstration reaches step `at`. The element
 * always keeps its place in the layout, so nothing jumps when it appears.
 */
export function Step({
  at,
  step,
  children,
  style,
  from = "up",
}: {
  at: number;
  step: number;
  children: ReactNode;
  style?: CSSProperties;
  /** Direction it eases in from. */
  from?: "up" | "left" | "right" | "none";
}) {
  const shown = step >= at;
  const offset = from === "up" ? "translateY(8px)" : from === "left" ? "translateX(-10px)" : from === "right" ? "translateX(10px)" : "none";
  return (
    <div
      aria-hidden={shown ? undefined : true}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offset,
        transition: "opacity 400ms ease-out, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  bg,
  fg,
  style,
}: {
  children: ReactNode;
  bg: string;
  fg: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: bg,
        color: fg,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "background-color 300ms, color 300ms",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Dot({ color }: { color: string }) {
  return <i style={{ width: 7, height: 7, borderRadius: 7, background: color, display: "inline-block", flex: "none" }} />;
}

/** A button-shaped label. Windows are demonstrations, so it is not a real button. */
export function Btn({
  children,
  bg,
  fg,
  style,
}: {
  children: ReactNode;
  bg: string;
  fg: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: fg,
        borderRadius: 8,
        padding: "6px 11px",
        fontWeight: 600,
        transition: "background-color 300ms, color 300ms, box-shadow 300ms",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Small line chart. `points` are plain values; it scales them to the box. */
export function Spark({
  points,
  color,
  width,
  height,
  fill,
}: {
  points: readonly number[];
  color: string;
  width: number;
  height: number;
  fill?: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const x = (i: number) => (i / (points.length - 1)) * width;
  const y = (v: number) => height - 6 - ((v - min) / (max - min || 1)) * (height - 12);
  const d = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }} aria-hidden>
      {fill && <path d={`${d} L${width},${height} L0,${height} Z`} fill={fill} />}
      <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Toggle switch drawn in one of three states. */
export function Switch({ state, on, off, pending }: { state: "on" | "off" | "pending"; on: string; off: string; pending?: string }) {
  const bg = state === "on" ? on : state === "pending" ? (pending ?? off) : off;
  return (
    <span style={{ width: 32, height: 18, borderRadius: 18, background: bg, position: "relative", flex: "none", transition: "background-color 300ms" }}>
      <i
        style={{
          position: "absolute",
          top: 2,
          left: state === "on" ? 16 : 2,
          width: 14,
          height: 14,
          borderRadius: 14,
          background: "#fff",
          transition: "left 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </span>
  );
}
