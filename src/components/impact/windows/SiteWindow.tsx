import Image from "next/image";
import ribbon from "../../../../public/images/hero/ribbon.webp";
import bubble from "../../../../public/images/hero/bubble.webp";

/**
 * A browser window showing this very site in miniature: what AIO9 Web
 * builds. Same 760×480 design size as the product windows. Decorative.
 */
export function SiteWindow({
  lines,
  cta,
  words,
}: {
  lines: readonly string[];
  cta: string;
  words: readonly [string, string];
}) {
  const led = (color: string): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    textTransform: "uppercase",
    fontSize: 46,
    lineHeight: 1,
    color,
    WebkitMaskImage: "radial-gradient(circle, #000 46%, transparent 52%)",
    maskImage: "radial-gradient(circle, #000 46%, transparent 52%)",
    WebkitMaskSize: "4px 4px",
    maskSize: "4px 4px",
    filter: `drop-shadow(0 0 6px ${color})`,
  });
  const mini = (bg: string, bar: string, style: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 150,
        height: 96,
        borderRadius: 7,
        background: bg,
        boxShadow: "0 18px 30px -12px rgba(10,10,18,.55)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ height: 12, background: "rgba(128,128,128,.18)" }} />
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: 28, background: "rgba(0,0,0,.28)" }}>
          <i
            style={{
              display: "block",
              margin: "6px 4px",
              height: 6,
              borderRadius: 3,
              background: bar,
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: 7,
            display: "grid",
            gap: 5,
            alignContent: "start",
          }}
        >
          {[80, 60, 72, 46].map((w, i) => (
            <i
              key={w}
              style={{
                display: "block",
                height: 6,
                borderRadius: 3,
                width: `${w}%`,
                background: i === 1 ? bar : "rgba(128,128,128,.28)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        width: 760,
        height: 480,
        borderRadius: 18,
        overflow: "hidden",
        background: "#EFEAE0",
        color: "#0A0A12",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #d8d1c2",
        textAlign: "left",
      }}
    >
      <div
        style={{
          height: 40,
          background: "#E3DCCF",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          flex: "none",
        }}
      >
        {["#f0a6a0", "#f1d08a", "#9fd4a8"].map((dot) => (
          <i
            key={dot}
            style={{ width: 10, height: 10, borderRadius: 10, background: dot }}
          />
        ))}
        <span
          style={{
            marginLeft: 14,
            flex: 1,
            maxWidth: 380,
            background: "#EFEAE0",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 11.5,
            color: "#4D5C70",
            fontFamily: "var(--font-mono)",
          }}
        >
          aio9 · /es
        </span>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: -30,
            left: 250,
            fontFamily: "var(--font-display)",
            fontSize: 380,
            lineHeight: 0.8,
            color: "#E3DCCF",
            textShadow: "6px 6px 0 #cfc6b3",
            transform: "skewY(-4deg)",
          }}
        >
          AIO9
        </div>
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 12,
            display: "flex",
            alignItems: "center",
            fontFamily: "var(--font-display)",
            fontSize: 20,
          }}
        >
          AIO9
          <span style={{ marginLeft: "auto", display: "grid", gap: 3 }}>
            <i
              style={{
                display: "block",
                width: 16,
                height: 2,
                background: "#0A0A12",
              }}
            />
            <i
              style={{
                display: "block",
                width: 11,
                height: 2,
                background: "#0A0A12",
                marginLeft: 5,
              }}
            />
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 46,
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            fontSize: 74,
            lineHeight: 0.88,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={line}
              style={i === lines.length - 1 ? { color: "#2F63FF" } : undefined}
            >
              {line}
            </div>
          ))}
        </div>
        <span
          style={{
            position: "absolute",
            left: 22,
            top: 258,
            background: "#0A0A12",
            color: "#EFEAE0",
            borderRadius: 99,
            padding: "8px 14px",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {cta} →
        </span>
        {mini("#171A1F", "#F5A524", {
          left: 430,
          top: 150,
          transform: "rotate(-5deg)",
        })}
        {mini("#FFFFFF", "#C42B5C", {
          left: 560,
          top: 196,
          transform: "rotate(4deg)",
        })}
        <Image
          src={ribbon}
          alt=""
          sizes="110px"
          style={{
            position: "absolute",
            left: 610,
            top: 96,
            width: 110,
            height: "auto",
          }}
        />
        <Image
          src={bubble}
          alt=""
          sizes="54px"
          style={{
            position: "absolute",
            left: 530,
            top: 262,
            width: 54,
            height: "auto",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            height: 190,
            background: "#0A0A12",
            clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 22,
              bottom: 20,
              ...led("#17B3A3"),
            }}
          >
            {words[0]}
          </div>
          <div
            style={{
              position: "absolute",
              left: 400,
              bottom: 20,
              ...led("#E8794A"),
            }}
          >
            {words[1]}
          </div>
          <i
            style={{
              position: "absolute",
              left: 380,
              bottom: 0,
              width: 1,
              height: 96,
              background: "#2b2a3a",
            }}
          />
        </div>
      </div>
    </div>
  );
}
