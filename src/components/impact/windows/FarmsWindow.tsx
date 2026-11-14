import type { Locale } from "@/i18n/config";
import { Chip, Spark, Step, Switch, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Granja",
  online: "En línea",
  nav: ["Galpones", "Clima", "Agua y alimento", "Sanidad", "Alertas"],
  status: ["6 nodos ESP32", "Última lectura: hace 2 min"],
  houses: ["Galpón 1", "Galpón 2", "Galpón 3"],
  batch: "Lote 14 · día 23",
  temperature: "Temperatura",
  temperatureValue: "27,4",
  humidity: "Humedad",
  ammonia: "Amoníaco",
  co2: "CO₂",
  co2Value: "1.850",
  chart: "Temperatura, últimas 24 h",
  target: "Objetivo 26–28 °C",
  water: "Agua hoy",
  waterValue: "1.240 L",
  feed: "Alimento hoy",
  feedValue: "410 kg",
  alertTitle: "Amoníaco subiendo",
  alertText: "Galpón 2 pasó de 14 a 21 ppm en 3 h.",
  loggedTitle: "Evento registrado",
  loggedText: "Galpón 2 con más ventilación. Amoníaco en 16 ppm.",
  ventilate: "Ventilar",
  view: "Ver",
  equipment: "Equipos",
  fans: "Ventiladores",
  fans3: "3 de 4 encendidos",
  fans4: "4 de 4 encendidos",
  fogger: "Nebulizador",
  automatic: "Automático",
  heating: "Calefacción",
  off: "Apagada",
  lights: "Luces",
  lightHours: "16 h de luz",
};

const copy = {
  es,
  en: {
    app: "Farm",
    online: "Online",
    nav: ["Houses", "Climate", "Water and feed", "Health", "Alerts"],
    status: ["6 ESP32 nodes", "Last reading: 2 min ago"],
    houses: ["House 1", "House 2", "House 3"],
    batch: "Flock 14 · day 23",
    temperature: "Temperature",
    temperatureValue: "27.4",
    humidity: "Humidity",
    ammonia: "Ammonia",
    co2: "CO₂",
    co2Value: "1,850",
    chart: "Temperature, last 24 h",
    target: "Target 26–28 °C",
    water: "Water today",
    waterValue: "1,240 L",
    feed: "Feed today",
    feedValue: "410 kg",
    alertTitle: "Ammonia rising",
    alertText: "House 2 went from 14 to 21 ppm in 3 h.",
    loggedTitle: "Event logged",
    loggedText: "House 2 with more ventilation. Ammonia at 16 ppm.",
    ventilate: "Ventilate",
    view: "View",
    equipment: "Equipment",
    fans: "Fans",
    fans3: "3 of 4 on",
    fans4: "4 of 4 on",
    fogger: "Fogger",
    automatic: "Automatic",
    heating: "Heating",
    off: "Off",
    lights: "Lights",
    lightHours: "16 h of light",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = { bg: "#FBF8EF", ink: "#2A2412", muted: "#857B5C", line: "#EAE3CC", chrome: "#F5F0DF", side: "#2A2412", sideText: "#D9CFA8", sideLine: "#4a4124", app: "#F2B705", on: "#2A2412", ok: "#9BD46A" };
const GREEN = "#6FA83A";
const ORANGE = "#E2731C";
const temps = [26.2, 26.0, 25.8, 26.1, 26.9, 27.6, 28.4, 28.9, 28.2, 27.7, 27.3, 27.4];

function Gauge({ label, value, unit, fill, color, on }: { label: string; value: string; unit: string; fill: number; color: string; on: boolean }) {
  return (
    <div style={{ flex: 1, background: "#fff", border: `1px solid ${c.line}`, borderRadius: 12, padding: "11px 12px" }}>
      <div style={{ color: c.muted, fontSize: 11 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
        <b style={{ fontSize: 24, letterSpacing: "-.02em", color: color === ORANGE ? "#B4530D" : c.ink, transition: "color 300ms" }}>{value}</b>
        <span style={{ color: c.muted }}>{unit}</span>
      </div>
      <div aria-hidden style={{ height: 5, borderRadius: 5, background: "#F0EAD6", marginTop: 8 }}>
        <i style={{ display: "block", height: "100%", width: `${on ? fill : 0}%`, borderRadius: 5, background: color, transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms" }} />
      </div>
    </div>
  );
}

export function FarmsWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const on = step >= 0;
  const ammonia = step >= 5 ? 16 : step >= 2 ? 21 : 14;
  const high = step >= 2 && step < 5;
  const compared = step >= 1;
  const venting = step >= 4;
  const logged = step >= 5;
  const equipment = [
    [t.fans, venting ? t.fans4 : t.fans3, true],
    [t.fogger, t.automatic, true],
    [t.heating, t.off, false],
    [t.lights, t.lightHours, true],
  ] as const;
  const totals = [
    [t.water, t.waterValue, [3, 5, 6, 4, 7, 8, 6]],
    [t.feed, t.feedValue, [4, 4, 5, 6, 5, 6, 7]],
  ] as const;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          {t.houses.map((house, i) => (
            <Chip key={house} bg={i === 1 ? c.ink : "#fff"} fg={i === 1 ? "#fff" : c.muted} style={i === 1 ? undefined : { boxShadow: `inset 0 0 0 1px ${c.line}` }}>
              {house}
            </Chip>
          ))}
          <span style={{ marginLeft: "auto", color: c.muted }}>{t.batch}</span>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <Gauge label={t.temperature} value={t.temperatureValue} unit="°C" fill={62} color={GREEN} on={on} />
          <Gauge label={t.humidity} value="62" unit="%" fill={55} color={GREEN} on={on} />
          <Gauge label={t.ammonia} value={String(ammonia)} unit="ppm" fill={ammonia * 4} color={high ? ORANGE : GREEN} on={on} />
          <Gauge label={t.co2} value={t.co2Value} unit="ppm" fill={48} color={GREEN} on={on} />
        </div>
        <div style={{ marginTop: 10, background: "#fff", border: `1px solid ${c.line}`, borderRadius: 12, padding: "11px 12px" }}>
          <div style={{ display: "flex", marginBottom: 4 }}>
            <b>{t.chart}</b>
            <span style={{ marginLeft: "auto", color: compared ? "#3F7A14" : c.muted, fontWeight: compared ? 600 : 400, transition: "color 300ms" }}>{t.target}</span>
          </div>
          <div style={{ position: "relative" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 26,
                height: 30,
                background: compared ? "#DDF0C4" : "#EEF6E2",
                boxShadow: `inset 0 0 0 1px ${compared ? "#9CCB6A" : "transparent"}`,
                opacity: compared ? 1 : 0.5,
                borderRadius: 4,
                transition: "background-color 400ms, box-shadow 400ms, opacity 400ms",
              }}
            />
            <div style={{ position: "relative" }}>
              <Spark points={temps} color="#2A2412" width={372} height={84} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 9 }}>
          {totals.map(([label, value, bars]) => (
            <div key={label} style={{ flex: 1, background: "#fff", border: `1px solid ${c.line}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "flex-end" }}>
              <span style={{ flex: 1 }}>
                <span style={{ color: c.muted, fontSize: 11 }}>{label}</span>
                <br />
                <b style={{ fontSize: 17 }}>{value}</b>
              </span>
              <span aria-hidden style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 30 }}>
                {bars.map((h, i) => (
                  <i key={i} style={{ width: 7, height: h * 3.6, borderRadius: 2, background: i === 6 ? c.app : "#E7DFC4" }} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 186, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: c.chrome }}>
        <Step at={3} step={step}>
          <div
            style={{
              background: logged ? "#EEF6E2" : "#FDEBD8",
              border: `1px solid ${logged ? "#BFDDA0" : "#F3C89B"}`,
              borderRadius: 11,
              padding: "10px 11px",
              lineHeight: 1.45,
              transition: "background-color 400ms, border-color 400ms",
            }}
          >
            <b style={{ color: logged ? "#3F7A14" : "#B4530D", transition: "color 400ms" }}>{logged ? `✓ ${t.loggedTitle}` : t.alertTitle}</b>
            <div style={{ minHeight: 35 }}>{logged ? t.loggedText : t.alertText}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <span
                style={{
                  background: venting ? "#6FA83A" : "#2A2412",
                  color: "#fff",
                  borderRadius: 7,
                  padding: "5px 9px",
                  fontWeight: 600,
                  boxShadow: venting ? "inset 0 2px 4px #00000040" : "inset 0 0 0 #00000000",
                  transform: venting ? "translateY(1px)" : "none",
                  transition: "background-color 300ms, box-shadow 300ms, transform 300ms",
                }}
              >
                {t.ventilate}
              </span>
              <span style={{ border: "1px solid #D9C9A8", borderRadius: 7, padding: "5px 9px" }}>{t.view}</span>
            </div>
          </div>
        </Step>
        <b style={{ display: "block", margin: "13px 0 4px" }}>{t.equipment}</b>
        {equipment.map(([label, state, active], i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", padding: "7px 0", borderTop: `1px solid ${c.line}` }}>
            <span style={{ flex: 1 }}>
              {label}
              <div style={{ color: i === 0 && venting ? "#3F7A14" : c.muted, fontWeight: i === 0 && venting ? 600 : 400, fontSize: 10.5, transition: "color 300ms" }}>{state}</div>
            </span>
            <Switch state={active ? "on" : "off"} on="#6FA83A" off="#D9D2BB" />
          </div>
        ))}
      </div>
    </WindowShell>
  );
}
