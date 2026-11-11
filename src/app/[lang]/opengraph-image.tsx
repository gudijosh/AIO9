import { ImageResponse } from "next/og";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AIO9 — Intelligence in Motion";

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0B1421",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 44, fontWeight: 600, letterSpacing: -2 }}>
          AIO9
          <div style={{ width: 13, height: 13, marginLeft: 6, background: "#2558DC" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -4, maxWidth: 900 }}>{dict.hero.title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 44, color: "#86A8FF" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#86A8FF" }} />
            <div style={{ width: 260, height: 2, margin: "0 8px", background: "#86A8FF" }} />
            <div style={{ width: 16, height: 16, background: "#86A8FF" }} />
            <div style={{ marginLeft: 24, fontSize: 28, color: "#8997A8" }}>{dict.footer.tagline}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
