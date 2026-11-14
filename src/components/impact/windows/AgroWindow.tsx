import type { Locale } from "@/i18n/config";
import { Chip, Spark, Step, Switch, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Riego",
  online: "En línea",
  nav: ["Parcelas", "Riego", "Clima", "Sensores", "Historial"],
  status: ["4 nodos ESP32 · batería 86 %", "Estación en Raspberry Pi"],
  title: "Finca · Lote Norte",
  auto: "Riego automático",
  area: "12,4 ha",
  zones: ["Zona 1", "Zona 2", "Zona 3", "Zona 4"],
  moisture: "Humedad del suelo",
  mark: "La marca es el mínimo por cultivo.",
  tiles: [
    ["ET de hoy", "5,2 mm"],
    ["Lluvia", "20 %"],
    ["Viento", "9 km/h"],
    ["Agua semanal", "186 m³"],
  ],
  below: "Zona 3 está por debajo del mínimo",
  suggestion: "Sugerencia: regar 25 min a las 05:30, antes del calor.",
  schedule: "Programar",
  scheduled: "Programado",
  valves: "Válvulas",
  closed: "Cerrada",
  opens: "Abre 05:30",
  watering: "Regando · 12 min",
  flow: "Caudal",
  flowValue: "6,0 L/s · presión 2,1 bar",
};

const copy = {
  es,
  en: {
    app: "Irrigation",
    online: "Online",
    nav: ["Plots", "Irrigation", "Weather", "Sensors", "History"],
    status: ["4 ESP32 nodes · battery 86 %", "Station on Raspberry Pi"],
    title: "Farm · North Lot",
    auto: "Automatic irrigation",
    area: "12.4 ha",
    zones: ["Zone 1", "Zone 2", "Zone 3", "Zone 4"],
    moisture: "Soil moisture",
    mark: "The mark is the minimum per crop.",
    tiles: [
      ["ET today", "5.2 mm"],
      ["Rain", "20 %"],
      ["Wind", "9 km/h"],
      ["Weekly water", "186 m³"],
    ],
    below: "Zone 3 is below the minimum",
    suggestion: "Suggestion: irrigate 25 min at 05:30, before the heat.",
    schedule: "Schedule",
    scheduled: "Scheduled",
    valves: "Valves",
    closed: "Closed",
    opens: "Opens 05:30",
    watering: "Irrigating · 12 min",
    flow: "Flow",
    flowValue: "6.0 L/s · pressure 2.1 bar",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = { bg: "#F6FAF2", ink: "#152A17", muted: "#6C8468", line: "#DDE9D5", chrome: "#EEF5E8", side: "#17361C", sideText: "#B9D6B4", sideLine: "#2f5535", app: "#8BD450", on: "#122414", ok: "#B6F27C" };

/** Moisture %, outline on the map, colour, label position. Zone 3 (index 2) is the dry one. */
const zones = [
  [41, "M12 14 L150 10 L160 96 L18 110 Z", "#9CCB6A", 84, 60],
  [36, "M158 10 L298 16 L290 104 L168 96 Z", "#B8D987", 226, 58],
  [19, "M18 118 L160 104 L172 206 L28 212 Z", "#E3C77B", 94, 160],
  [44, "M170 104 L290 112 L296 200 L180 206 Z", "#86BF58", 234, 156],
] as const;
const DRY = 2;

export function AgroWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const measured = step >= 0;
  const dry = step >= 1;
  const scheduled = step >= 4;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <b style={{ fontSize: 15 }}>{t.title}</b>
          <Chip bg="#DFF1CF" fg="#2F6B1E">
            {t.auto}
          </Chip>
          <span style={{ marginLeft: "auto", color: c.muted }}>{t.area}</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: "#fff", border: `1px solid ${c.line}`, borderRadius: 12, padding: 8, flex: "none" }}>
            <svg width={308} height={222} viewBox="0 0 308 222" style={{ display: "block" }} aria-hidden>
              {zones.map(([, d, color], i) => {
                const flagged = i === DRY && dry;
                return (
                  <path
                    key={d}
                    d={d}
                    style={{
                      fill: !measured ? "#E3EDDB" : i === DRY && !dry ? "#C4DB8C" : color,
                      stroke: flagged ? "#B4530D" : "#ffffff",
                      strokeWidth: flagged ? 2.5 : 2,
                      transition: "fill 500ms, stroke 400ms, stroke-width 400ms",
                    }}
                  />
                );
              })}
              {zones.map(([, , , x, y], i) => (
                <g key={i} fill="#152A17">
                  <circle cx={x} cy={y} r={4} />
                  <text x={x + 9} y={y + 4} fontSize={11} fontWeight={700}>
                    {t.zones[i]}
                  </text>
                </g>
              ))}
              <path d="M0 108 H308" stroke="#3B82C4" strokeWidth={2.5} strokeDasharray="2 5" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: c.muted, fontWeight: 600, fontSize: 11, marginBottom: 6 }}>{t.moisture}</div>
            {zones.map(([pct], i) => {
              const flagged = i === DRY && dry;
              return (
                <div key={i} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex" }}>
                    <span>{t.zones[i]}</span>
                    <b style={{ marginLeft: "auto", color: flagged ? "#B4530D" : c.ink, opacity: measured ? 1 : 0, transition: "color 300ms, opacity 400ms" }}>{pct} %</b>
                  </div>
                  <div aria-hidden style={{ height: 6, borderRadius: 6, background: "#E3EDDB", marginTop: 4, position: "relative" }}>
                    <i
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${measured ? pct * 1.7 : 0}%`,
                        borderRadius: 6,
                        background: flagged ? "#E2931C" : "#5FA833",
                        transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms",
                        transitionDelay: step === 0 ? `${i * 90}ms` : "0ms",
                      }}
                    />
                    <i style={{ position: "absolute", left: "48%", top: -3, width: 2, height: 12, background: "#152A17" }} />
                  </div>
                </div>
              );
            })}
            <div style={{ color: c.muted, fontSize: 10.5 }}>{t.mark}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          {t.tiles.map(([label, value], i) => (
            <Step key={label} at={i < 3 ? 2 : -1} step={step} style={{ flex: 1, transitionDelay: step === 2 ? `${i * 90}ms` : "0ms" }}>
              <div style={{ background: "#fff", border: `1px solid ${c.line}`, borderRadius: 11, padding: "9px 10px" }}>
                <span style={{ color: c.muted, fontSize: 10.5 }}>{label}</span>
                <br />
                <b style={{ fontSize: 16 }}>{value}</b>
              </div>
            </Step>
          ))}
        </div>
        <Step at={3} step={step} style={{ marginTop: 10 }}>
          <div style={{ background: "#17361C", color: "#EAF6E2", borderRadius: 11, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: 1 }}>
              <b>{t.below}</b>
              <br />
              <span style={{ color: "#B9D6B4" }}>{t.suggestion}</span>
            </span>
            <span
              style={{
                background: scheduled ? "#2F5535" : c.app,
                color: scheduled ? "#B6F27C" : c.on,
                boxShadow: `inset 0 0 0 1px ${scheduled ? "#8BD450" : "transparent"}`,
                borderRadius: 8,
                padding: "7px 12px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                transition: "background-color 300ms, color 300ms, box-shadow 300ms",
              }}
            >
              {scheduled ? `✓ ${t.scheduled}` : t.schedule}
            </span>
          </div>
        </Step>
      </div>

      <div style={{ width: 170, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: c.chrome }}>
        <b>{t.valves}</b>
        {t.zones.map((zone, i) => {
          const state = i === 3 ? "on" : i === DRY && scheduled ? "pending" : "off";
          return (
            <div key={zone} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${c.line}`, marginTop: i === 0 ? 8 : 0 }}>
              <span style={{ flex: 1 }}>
                {zone}
                <div style={{ color: state === "on" ? "#2F6B1E" : state === "pending" ? "#8A6A0A" : c.muted, fontSize: 10.5, transition: "color 300ms" }}>
                  {state === "on" ? t.watering : state === "pending" ? t.opens : t.closed}
                </div>
              </span>
              <Switch state={state} on="#5FA833" off="#CFDCC6" pending="#E2C46B" />
            </div>
          );
        })}
        <b style={{ display: "block", margin: "12px 0 6px" }}>{t.flow}</b>
        <Spark points={[2, 2.2, 6.4, 6.6, 6.5, 6.4, 2.1, 2, 2, 5.8, 6.1, 6]} color="#2F6B1E" width={142} height={44} fill="#DFF1CF" />
        <div style={{ color: c.muted, fontSize: 10.5, marginTop: 4 }}>{t.flowValue}</div>
      </div>
    </WindowShell>
  );
}
