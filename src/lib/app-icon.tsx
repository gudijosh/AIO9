/**
 * The site icon (src/app/icon.svg) drawn for ImageResponse at any size, for
 * the home-screen icons: a dark tile with a dot, a dash and a blue square.
 * Full-bleed background: iOS and Android round the corners themselves.
 */
export function AppIcon({ size }: { size: number }) {
  const u = size / 64;
  const box = (left: number, top: number, width: number, height: number) =>
    ({ position: "absolute", left: left * u, top: top * u, width: width * u, height: height * u }) as const;
  return (
    <div style={{ width: size, height: size, display: "flex", position: "relative", background: "#0B1421" }}>
      <div style={{ ...box(9, 27, 10, 10), borderRadius: 5 * u, background: "#ffffff" }} />
      <div style={{ ...box(22, 30.5, 17, 3), background: "#ffffff" }} />
      <div style={{ ...box(42, 24, 16, 16), background: "#2558DC" }} />
    </div>
  );
}
