import type { Locale } from "@/i18n/config";
import { Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Conteo físico",
  online: "En línea",
  nav: ["Conteos", "Ubicaciones", "Diferencias", "Etiquetas RFID", "Reportes"],
  status: ["Lector RFID · Raspberry Pi", "2 terminales de mano"],
  title: "Conteo cíclico · Pasillo B",
  running: "En curso",
  blind: "Conteo a ciegas",
  progressStart: "6 de 32 ubicaciones",
  progress: "22 de 32 ubicaciones",
  legend: ["Contada", "Diferencia", "Pendiente"],
  accuracy: "Exactitud",
  differences: "Diferencias",
  recount: "Recontar",
  columns: ["Artículo", "Ubicación", "Sistema", "Contado", "Diferencia"],
  items: ["Tornillo M8 × 40", "Guante nitrilo M", "Cinta 48 mm", "Caja 30×20×15", "Etiqueta térmica"],
  lastRead: "Última lectura",
  lastReadMeta: "B-03-4 · hace 12 s",
  diffTitle: "Diferencia de −3",
  diffText: "Supera la tolerancia. Pide un segundo conteo antes de ajustar.",
  readyText: "El segundo conteo confirmó 117. Ajuste listo para aprobar.",
  adjust: "Ajustar",
};

const copy = {
  es,
  en: {
    app: "Physical count",
    online: "Online",
    nav: ["Counts", "Locations", "Differences", "RFID tags", "Reports"],
    status: ["RFID reader · Raspberry Pi", "2 handheld terminals"],
    title: "Cycle count · Aisle B",
    running: "In progress",
    blind: "Blind count",
    progressStart: "6 of 32 locations",
    progress: "22 of 32 locations",
    legend: ["Counted", "Difference", "Pending"],
    accuracy: "Accuracy",
    differences: "Differences",
    recount: "Recount",
    columns: ["Item", "Location", "System", "Counted", "Difference"],
    items: ["M8 × 40 screw", "Nitrile glove M", "48 mm tape", "Box 30×20×15", "Thermal label"],
    lastRead: "Last read",
    lastReadMeta: "B-03-4 · 12 s ago",
    diffTitle: "Difference of −3",
    diffText: "Over tolerance. Ask for a second count before adjusting.",
    readyText: "The second count confirmed 117. Adjustment ready to approve.",
    adjust: "Adjust",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = { bg: "#FFFFFF", ink: "#0E2233", muted: "#6B8194", line: "#E1EAF1", chrome: "#F5F9FC", side: "#0E2233", sideText: "#A9C0D3", sideLine: "#24405a", app: "#1EA7E8", on: "#fff", ok: "#5FE0A5" };

/** 0 pending · 1 counted · 2 difference · 3 being read. */
const cells = [1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
const cellColor = ["#E6EEF4", "#1EA7E8", "#F59E0B", "#0E2233"] as const;
const rows = [
  ["B-03-2", 480, 480],
  ["B-03-4", 120, 117],
  ["B-04-1", 64, 64],
  ["B-04-3", 210, 214],
  ["B-05-2", 36, 36],
] as const;
const barcode = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1];
const fade = "opacity 350ms ease-out";

export function InventoryWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const reading = step >= 1;
  const compared = step >= 2;
  const found = step >= 3;
  const ready = step >= 5;
  const cellBg = (state: number, i: number) => {
    if (!reading) return cellColor[i < 6 ? 1 : 0];
    if (state === 2) return cellColor[found ? 2 : 1];
    return cellColor[state as 0 | 1 | 3];
  };
  const stats = [
    [t.accuracy, compared ? "97 %" : "—"],
    [t.differences, found ? "2" : "0"],
    [t.recount, step >= 4 ? "1" : "0"],
  ] as const;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <b style={{ fontSize: 15 }}>{t.title}</b>
          <Chip bg="#E3F4FD" fg="#0B78AE">
            {t.running}
          </Chip>
          <span style={{ marginLeft: "auto", color: c.muted }}>{t.blind}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 12px" }}>
          <div aria-hidden style={{ flex: 1, height: 8, borderRadius: 8, background: "#E6EEF4" }}>
            <i style={{ display: "block", width: reading ? "68%" : "19%", height: "100%", borderRadius: 8, background: c.app, transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1)" }} />
          </div>
          <b>{reading ? "68 %" : "19 %"}</b>
          <span style={{ color: c.muted }}>{reading ? t.progress : t.progressStart}</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div>
            <div aria-hidden style={{ display: "grid", gridTemplateColumns: "repeat(8,15px)", gap: 4 }}>
              {cells.map((state, i) => (
                <i
                  key={i}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 4,
                    background: cellBg(state, i),
                    transition: "background-color 300ms",
                    transitionDelay: step === 1 ? `${i * 20}ms` : "0ms",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 9, marginTop: 8, fontSize: 10.5, color: c.muted }}>
              {([1, 2, 0] as const).map((k, i) => (
                <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <i aria-hidden style={{ width: 9, height: 9, borderRadius: 2, background: cellColor[k] }} />
                  {t.legend[i]}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            {stats.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  border: `1px solid ${(i === 1 && step === 3) || (i === 2 && step === 4) ? "#F59E0B" : c.line}`,
                  borderRadius: 11,
                  padding: "9px 8px",
                  minWidth: 0,
                  transition: "border-color 300ms",
                }}
              >
                <span style={{ color: c.muted, fontSize: 10 }}>{label}</span>
                <br />
                <b style={{ fontSize: 17, whiteSpace: "nowrap" }}>{value}</b>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12, border: `1px solid ${c.line}`, borderRadius: 11, overflow: "hidden" }}>
          <div style={{ display: "flex", background: c.chrome, color: c.muted, fontWeight: 600, padding: "7px 11px", fontSize: 11 }}>
            <span style={{ flex: 1 }}>{t.columns[0]}</span>
            <span style={{ width: 62 }}>{t.columns[1]}</span>
            <span style={{ width: 54, textAlign: "right" }}>{t.columns[2]}</span>
            <span style={{ width: 54, textAlign: "right" }}>{t.columns[3]}</span>
            <span style={{ width: 74, textAlign: "right" }}>{t.columns[4]}</span>
          </div>
          {rows.map(([location, system, counted], i) => {
            const same = system === counted;
            const delta = counted - system;
            const delay = step === 2 ? `${i * 90}ms` : "0ms";
            return (
              <div
                key={location}
                style={{
                  display: "flex",
                  padding: "7px 11px",
                  borderTop: `1px solid ${c.line}`,
                  background: !same && found ? "#FFF8EB" : "#FFFFFF",
                  boxShadow: `inset 3px 0 0 ${i === 1 && found ? "#F59E0B" : "transparent"}`,
                  transition: "background-color 300ms, box-shadow 300ms",
                }}
              >
                <span style={{ flex: 1 }}>{t.items[i]}</span>
                <span style={{ width: 62, color: c.muted }}>{location}</span>
                <span style={{ width: 54, textAlign: "right" }}>{system}</span>
                <span style={{ width: 54, textAlign: "right", opacity: compared ? 1 : 0, transition: fade, transitionDelay: delay }}>{counted}</span>
                <span
                  style={{
                    width: 74,
                    textAlign: "right",
                    fontWeight: 700,
                    color: same ? "#2E9E6B" : "#C2710A",
                    opacity: (same ? compared : found) ? 1 : 0,
                    transition: fade,
                    transitionDelay: delay,
                  }}
                >
                  {same ? "✓" : delta > 0 ? `+${delta}` : `−${-delta}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: 178, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: c.chrome }}>
        <Step at={1} step={step}>
          <b>{t.lastRead}</b>
          <div style={{ marginTop: 8, background: "#0E2233", color: "#fff", borderRadius: 11, padding: 11, lineHeight: 1.5 }}>
            <span style={{ color: "#8FD3F6", fontSize: 10.5 }}>{t.lastReadMeta}</span>
            <br />
            <b style={{ fontSize: 13 }}>{t.items[1]}</b>
            <div aria-hidden style={{ display: "flex", gap: 2, marginTop: 8, height: 22, alignItems: "stretch" }}>
              {barcode.map((w, i) => (
                <i key={i} style={{ width: w * 1.6, background: "#fff" }} />
              ))}
            </div>
          </div>
        </Step>
        <Step at={4} step={step} style={{ marginTop: 12 }}>
          <div style={{ border: "1px solid #F3D49B", background: "#FFF8EB", borderRadius: 11, padding: "10px 11px", lineHeight: 1.45 }}>
            <b style={{ color: "#A85F06" }}>{t.diffTitle}</b>
            <div style={{ minHeight: 52 }}>{ready ? t.readyText : t.diffText}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              {[t.recount, t.adjust].map((label, i) => {
                const strong = (i === 1) === ready;
                return (
                  <span
                    key={label}
                    style={{
                      background: strong ? c.app : "transparent",
                      color: strong ? "#fff" : c.ink,
                      boxShadow: `inset 0 0 0 1px ${strong ? c.app : "#E4CFA6"}`,
                      borderRadius: 7,
                      padding: "6px 8px",
                      fontWeight: strong ? 600 : 400,
                      transition: "background-color 300ms, color 300ms, box-shadow 300ms",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </Step>
      </div>
    </WindowShell>
  );
}
