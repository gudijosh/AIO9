import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The card shown when a page is shared (WhatsApp, LinkedIn, Slack…), in the
 * site's current look: ink background with the dot grain, the AIO9
 * wordmark, a huge League Gothic title whose last line is blue, a volt rule
 * with the tagline, and Io in the corner. 1200×630 PNG, built at build time.
 *
 * The image renderer can't read woff2, so League Gothic (SIL OFL) is also
 * kept as woff in src/fonts.
 */
export const shareCardSize = { width: 1200, height: 630 };

const colors = {
  ink: "#0a0a12",
  ink800: "#14162a",
  bone: "#efeae0",
  bone300: "#e3dccf",
  azure: "#2f63ff",
  volt: "#d4ff3a",
  fog: "#a9a7ba",
};

let font: Promise<Buffer> | undefined;
const leagueGothic = () => (font ??= readFile(join(process.cwd(), "src/fonts/league-gothic-latin.woff")));

/** Io's head (src/components/bot/IoMark.tsx) as a standalone SVG. */
const io = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
    `<rect x="22.9" y="5.5" width="2.2" height="6" rx="1.1" fill="${colors.bone300}"/>` +
    `<circle cx="24" cy="5" r="3" fill="${colors.volt}"/>` +
    `<rect x="4.5" y="21" width="5" height="10" rx="2.5" fill="${colors.bone300}"/>` +
    `<rect x="38.5" y="21" width="5" height="10" rx="2.5" fill="${colors.bone300}"/>` +
    `<rect x="8" y="11" width="32" height="29" rx="11" fill="${colors.bone}"/>` +
    `<rect x="12.5" y="17.5" width="23" height="13.5" rx="6.75" fill="${colors.ink}"/>` +
    `<rect x="17" y="21" width="4.6" height="6.4" rx="2.3" fill="${colors.volt}"/>` +
    `<rect x="26.4" y="21" width="4.6" height="6.4" rx="2.3" fill="${colors.volt}"/>` +
    `<path d="M20.5 34.6q3.5 2.4 7 0" fill="none" stroke="${colors.ink}" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round"/>` +
    `</svg>`,
)}`;

/** Splits a title into `count` lines of similar length, word by word. */
export function splitTitle(title: string, count: number): string[] {
  const words = title.split(/\s+/);
  const target = title.length / count;
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > target * 1.15 && lines.length < count - 1) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  lines.push(current);
  return lines;
}

export async function shareCard({ lines, tagline }: { lines: readonly string[]; tagline: string }) {
  const titleSize = lines.length >= 3 ? 132 : 150;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          color: colors.bone,
          fontFamily: "League Gothic",
          backgroundColor: colors.ink,
          backgroundImage: `radial-gradient(circle at 18% 0%, ${colors.ink800} 0%, ${colors.ink} 62%)`,
        }}
      >
        {/* Dot grain, as on the site's dark sections */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle, rgba(239,234,224,0.07) 1.2px, transparent 1.6px)",
            backgroundSize: "7px 7px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1 }}>
            AIO<span style={{ color: colors.azure }}>9</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={io} width={96} height={96} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: titleSize,
                lineHeight: 0.9,
                textTransform: "uppercase",
                color: i === lines.length - 1 ? colors.azure : colors.bone,
              }}
            >
              {line}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
            <div style={{ width: 72, height: 6, borderRadius: 3, background: colors.volt }} />
            <div style={{ marginLeft: 22, fontSize: 34, letterSpacing: 3, textTransform: "uppercase", color: colors.fog }}>
              {tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...shareCardSize,
      fonts: [{ name: "League Gothic", data: await leagueGothic(), style: "normal", weight: 400 }],
    },
  );
}
