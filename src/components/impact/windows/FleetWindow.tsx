import type { Locale } from "@/i18n/config";
import { Chip, Dot, Spark, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Flota en frío",
  online: "En línea",
  nav: ["Mapa", "Unidades", "Viajes", "Alertas", "Reportes"],
  status: ["Raspberry Pi + GPS por unidad", "8 unidades en ruta"],
  onRoute: "8 en ruta",
  noAlerts: "0 alertas",
  oneAlert: "1 alerta",
  inWarehouse: "2 en bodega",
  geofence: "Geocerca: Bodega Norte",
  eta: "Llegada estimada",
  etaValue: "14:20 · faltan 38 km",
  unit: "Unidad 07",
  unitState: "En ruta",
  trip: "Viaje 2231 · congelados",
  box: "Caja",
  temps: { cruise: "−18 °C", peak: "−13,8 °C", back: "−17,4 °C" },
  limit: "Límite −15 °C",
  excursion: " · 1 excursión de 6 min",
  events: "Eventos",
  departure: "Salida de Planta Sur",
  door: "Puerta abierta 2 min",
  outside: "Fuera de geocerca",
  over: "Temperatura sobre el límite",
  notified: "Aviso al supervisor",
  normal: "Temperatura normal",
};

const copy = {
  es,
  en: {
    app: "Cold-chain fleet",
    online: "Online",
    nav: ["Map", "Units", "Trips", "Alerts", "Reports"],
    status: ["Raspberry Pi + GPS per unit", "8 units on route"],
    onRoute: "8 on route",
    noAlerts: "0 alerts",
    oneAlert: "1 alert",
    inWarehouse: "2 at warehouse",
    geofence: "Geofence: North Warehouse",
    eta: "Estimated arrival",
    etaValue: "14:20 · 38 km to go",
    unit: "Unit 07",
    unitState: "On route",
    trip: "Trip 2231 · frozen goods",
    box: "Box",
    temps: { cruise: "−18 °C", peak: "−13.8 °C", back: "−17.4 °C" },
    limit: "Limit −15 °C",
    excursion: " · 1 excursion of 6 min",
    events: "Events",
    departure: "Left South Plant",
    door: "Door open 2 min",
    outside: "Outside geofence",
    over: "Temperature over the limit",
    notified: "Supervisor notified",
    normal: "Temperature normal",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = { bg: "#12141C", ink: "#EEF0F6", muted: "#8D93A6", line: "#272B39", chrome: "#0C0E14", side: "#0C0E14", sideText: "#A7ADC0", sideLine: "#272B39", app: "#FF5A4F", on: "#1b0503", ok: "#5FE0A5" };
const temps = [-18.2, -18.4, -18.1, -18.3, -17.9, -17.2, -15.1, -13.8, -15.6, -17.4, -18.0, -18.3];
const ORIGIN = [52, 372] as const;
const POSITION = [170, 268] as const;
const travel = "1400ms cubic-bezier(0.45, 0, 0.2, 1)";

export function FleetWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const moving = step >= 1;
  const [x, y] = moving ? POSITION : ORIGIN;
  const hot = step >= 3 && step < 5;
  const temp = step >= 5 ? t.temps.back : step >= 3 ? t.temps.peak : t.temps.cruise;
  const alert = step >= 2;
  /** How much of the temperature chart has been reported so far, in px of 140. */
  const drawn = step >= 5 ? 140 : step >= 3 ? 91 : moving ? 53 : 0;
  const events = [
    [0, "09:15", t.departure, "", 0, "#8D93A6"],
    [2, "11:42", t.door, t.outside, 2, "#FF5A4F"],
    [3, "11:44", t.over, t.notified, 4, "#F5C04A"],
    [5, "11:50", t.normal, "", 5, "#5FE0A5"],
  ] as const;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, position: "relative", minWidth: 0, background: "#171A25" }}>
        <svg width={436} height={440} viewBox="0 0 436 440" style={{ position: "absolute", inset: 0 }} aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} stroke="#20243199" strokeWidth={1}>
              <path d={`M0 ${40 + i * 50} H436`} />
              <path d={`M${30 + i * 52} 0 V440`} />
            </g>
          ))}
          <path d="M-10 300 C80 280 120 340 210 300 S340 220 450 250" stroke="#262B3B" strokeWidth={22} fill="none" />
          <path d="M120 -10 C140 90 90 180 150 260 S230 380 210 450" stroke="#262B3B" strokeWidth={14} fill="none" />
          <circle cx={318} cy={118} r={54} fill="#FF5A4F18" stroke="#FF5A4F" strokeWidth={1.5} strokeDasharray="5 5" />
          <path d="M52 372 C110 330 130 300 170 268 S250 200 318 118" stroke="#FF5A4F" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path
            d="M52 372 C110 330 130 300 170 268"
            pathLength={1}
            stroke="#EEF0F6"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="1 1"
            style={{ strokeDashoffset: moving ? 0 : 1, opacity: moving ? 1 : 0, transition: `stroke-dashoffset ${travel}, opacity 200ms` }}
          />
          <circle cx={52} cy={372} r={6} fill="#EEF0F6" />
          <circle cx={318} cy={118} r={7} fill="#FF5A4F" />
          <g style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform ${travel}` }}>
            <circle r={15} fill="#FF5A4F33" />
            <circle r={8} fill="#fff" stroke="#FF5A4F" strokeWidth={3.5} />
          </g>
          <circle cx={96} cy={150} r={5} fill="#5FE0A5" />
          <circle cx={360} cy={330} r={5} fill="#5FE0A5" />
          <circle cx={250} cy={390} r={5} fill="#F5C04A" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 12,
            top: -36,
            transform: `translate(${x}px, ${y}px)`,
            transition: `transform ${travel}`,
            background: "#fff",
            color: "#12141C",
            borderRadius: 9,
            padding: "6px 9px",
            fontWeight: 700,
            fontSize: 11,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 20px -8px #000",
          }}
        >
          {t.unit}
          <span style={{ color: hot ? "#D93A30" : "#12141C", opacity: moving ? 1 : 0, transition: "opacity 400ms 900ms, color 300ms" }}> · {temp}</span>
        </div>
        <div style={{ position: "absolute", left: 332, top: 66, fontSize: 10.5, color: "#FF8A82", whiteSpace: "nowrap" }}>{t.geofence}</div>
        <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
          <Chip bg="#1E2230" fg="#EEF0F6">
            {t.onRoute}
          </Chip>
          <Chip bg={alert ? "#3A1513" : "#1E2230"} fg={alert ? "#FF8A82" : "#8D93A6"}>
            {alert ? t.oneAlert : t.noAlerts}
          </Chip>
          <Chip bg="#1E2230" fg="#8D93A6">
            {t.inWarehouse}
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 12, bottom: 12, background: "#0C0E14E6", border: `1px solid ${c.line}`, borderRadius: 10, padding: "8px 11px", lineHeight: 1.5 }}>
          <span style={{ color: c.muted, fontSize: 10.5 }}>{t.eta}</span>
          <br />
          <b style={{ fontSize: 14 }}>{t.etaValue}</b>
        </div>
      </div>

      <div style={{ width: 186, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <b style={{ fontSize: 14 }}>{t.unit}</b>
          <span style={{ marginLeft: "auto" }}>
            <Chip bg="#173326" fg="#5FE0A5">
              {t.unitState}
            </Chip>
          </span>
        </div>
        <div style={{ color: c.muted, marginTop: 2 }}>{t.trip}</div>
        <div style={{ marginTop: 11, background: "#1A1D29", borderRadius: 11, padding: "10px 11px" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ color: c.muted, fontSize: 11 }}>{t.box}</span>
            <b style={{ marginLeft: "auto", fontSize: 19, color: hot ? "#FF5A4F" : c.ink, opacity: moving ? 1 : 0, transition: "opacity 400ms, color 300ms" }}>{temp}</b>
          </div>
          <div style={{ position: "relative", marginTop: 4 }}>
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 15, borderTop: "1.5px dashed #FF5A4F88" }} />
            <div style={{ width: drawn, overflow: "hidden", transition: "width 1100ms cubic-bezier(0.45, 0, 0.2, 1)" }}>
              <Spark points={temps} color="#EEF0F6" width={140} height={56} />
            </div>
          </div>
          <div style={{ color: "#FF8A82", fontSize: 10.5 }}>
            {t.limit}
            <span style={{ opacity: step >= 5 ? 1 : 0, transition: "opacity 400ms" }}>{t.excursion}</span>
          </div>
        </div>
        <b style={{ display: "block", margin: "12px 0 6px" }}>{t.events}</b>
        {events.map(([at, hour, title, note, noteAt, color]) => (
          <Step key={hour} at={at} step={step} from="right" style={{ display: "flex", gap: 8, marginBottom: 7, lineHeight: 1.35 }}>
            <span style={{ color: c.muted, width: 32, fontVariantNumeric: "tabular-nums" }}>{hour}</span>
            <span aria-hidden style={{ paddingTop: 4 }}>
              <Dot color={color} />
            </span>
            <span style={{ flex: 1 }}>
              {title}
              {note && <div style={{ color: c.muted, fontSize: 10.5, opacity: step >= noteAt ? 1 : 0, transition: "opacity 400ms" }}>{note}</div>}
            </span>
          </Step>
        ))}
      </div>
    </WindowShell>
  );
}
