import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Reservas",
  nav: ["Salón", "Reservas", "En espera", "Clientes", "Reportes"],
  online: "En línea",
  status: ["Asistente activo", "Turno de cena"],
  floor: "Salón, viernes 20:00",
  shifts: ["19:00", "20:00", "21:00"],
  entrance: "Entrada",
  bar: "Barra",
  table: "Mesa",
  states: ["Disponible", "Ocupada", "Asignada"],
  occupancy: "Ocupación por hora",
  hours: ["18 h", "19 h", "20 h", "21 h", "22 h", "23 h"],
  stats: ["Reservas hoy", "En espera"],
  ticket: "Reserva confirmada",
  when: "Viernes, 20:00",
  party: "4 personas",
  sent: "Confirmación enviada al cliente",
  inbox: "Mensajes",
  ask: "Buenas, ¿tienen mesa para cuatro el viernes a las 8?",
  checking: "¡Con gusto! Déjame ver cómo está el salón.",
  offer: "Listo, les aparté la mesa 7 para el viernes a las 8.",
};

const copy = {
  es,
  en: {
    app: "Reservations",
    nav: ["Floor", "Bookings", "Waitlist", "Guests", "Reports"],
    online: "Online",
    status: ["Assistant active", "Dinner shift"],
    floor: "Dining room, Friday 8:00 PM",
    shifts: ["7 PM", "8 PM", "9 PM"],
    entrance: "Entrance",
    bar: "Bar",
    table: "Table",
    states: ["Open", "Taken", "Assigned"],
    occupancy: "Occupancy by hour",
    hours: ["6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"],
    stats: ["Bookings today", "Waitlist"],
    ticket: "Reservation confirmed",
    when: "Friday, 8:00 PM",
    party: "Party of 4",
    sent: "Confirmation sent to the guest",
    inbox: "Messages",
    ask: "Hi, do you have a table for four on Friday at 8?",
    checking: "Happy to help! Let me look at the floor.",
    offer: "All set, I've saved table 7 for Friday at 8.",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = {
  bg: "#221712",
  ink: "#F5E9DF",
  muted: "#A89488",
  line: "#3A2A22",
  chrome: "#1B120D",
  side: "#1B120D",
  sideText: "#C9B5A8",
  sideLine: "#3A2A22",
  app: "#E8794A",
  on: "#2A0F04",
  ok: "#9BD9A2",
};

/** x, y, taken, round, number. Table 7 is the one the assistant assigns. */
const TABLES: readonly (readonly [number, number, boolean, boolean, number])[] = [
  [40, 34, false, false, 1],
  [128, 34, true, true, 2],
  [216, 34, false, false, 3],
  [304, 34, true, false, 4],
  [40, 112, true, true, 5],
  [128, 112, false, false, 6],
  [216, 112, false, true, 7],
  [304, 112, false, true, 8],
  [84, 186, true, false, 9],
  [216, 186, false, false, 10],
];
const BARS = [3, 5, 8, 10, 7, 4];
const STAT_VALUES = ["18", "2"];
const FILL = ["transparent", "#33241c", "#E8794A"];
const TEXT = ["#D8C4B6", "#8f7a6d", "#2A0F04"];
const ease = "fill 350ms, stroke 350ms, opacity 350ms";

export function HospitalityWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const checking = step === 2;
  const reserved = step >= 3;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <b style={{ fontSize: 15 }}>{t.floor}</b>
          <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {t.shifts.map((shift, i) => {
              const active = i === 1 && step >= 2;
              return <Chip key={shift} bg={active ? c.app : "#30221B"} fg={active ? c.on : c.muted}>{shift}</Chip>;
            })}
          </span>
        </div>
        <div style={{ background: "#1B120D", border: `1px solid ${c.line}`, borderRadius: 12, padding: 4 }}>
          <svg width={392} height={244} viewBox="0 0 392 244" style={{ display: "block" }}>
            <rect x={8} y={8} width={376} height={228} rx={10} fill="none" stroke="#3A2A22" strokeDasharray="3 5" />
            <text x={20} y={232} fontSize={9.5} fill="#6f5b50">{t.entrance}</text>
            <rect x={344} y={170} width={34} height={58} rx={5} fill="#2a1d17" />
            <text x={361} y={203} fontSize={9} fill="#6f5b50" textAnchor="middle">{t.bar}</text>
            {TABLES.map(([x, y, taken, round, n]) => {
              const mine = n === 7;
              const s = taken ? 1 : mine && reserved ? 2 : 0;
              const lit = s === 0 && checking;
              const shape: CSSProperties = {
                fill: lit ? "rgba(232,121,74,0.16)" : FILL[s],
                stroke: s ? "transparent" : lit ? "#E8794A" : "#5A4338",
                transition: ease,
              };
              const label: CSSProperties = { fill: TEXT[s], transition: ease };
              const cx = x + (round ? 28 : 31);
              return (
                <g key={n}>
                  {round ? (
                    <circle cx={x + 28} cy={y + 28} r={27} strokeWidth={1.5} strokeDasharray="4 4" style={shape} />
                  ) : (
                    <rect x={x} y={y + 4} width={62} height={48} rx={10} strokeWidth={1.5} strokeDasharray="4 4" style={shape} />
                  )}
                  <text x={cx} y={y + 26} textAnchor="middle" fontSize={11} fontWeight={700} style={label}>
                    {t.table} {n}
                  </text>
                  <text x={cx} y={y + 39} textAnchor="middle" fontSize={9} aria-hidden={s === 2 ? true : undefined} style={{ ...label, opacity: s === 2 ? 0 : 1 }}>
                    {t.states[taken ? 1 : 0]}
                  </text>
                  {mine && (
                    <text x={cx} y={y + 39} textAnchor="middle" fontSize={9} aria-hidden={s === 2 ? undefined : true} style={{ ...label, opacity: s === 2 ? 1 : 0 }}>
                      {t.states[2]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: c.muted, fontSize: 10.5 }}>{t.occupancy}</span>
            <div aria-hidden style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 44, marginTop: 5 }}>
              {BARS.map((h, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <i style={{ display: "block", height: h * 3.4, borderRadius: 3, background: i === 3 ? c.app : "#3d2c23" }} />
                </div>
              ))}
            </div>
            <div aria-hidden style={{ display: "flex", fontSize: 9.5, color: c.muted, marginTop: 3 }}>
              {t.hours.map((hour) => (
                <span key={hour} style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap" }}>{hour}</span>
              ))}
            </div>
          </div>
          {t.stats.map((label, i) => (
            <div key={label} style={{ width: 84, border: `1px solid ${c.line}`, borderRadius: 11, padding: "8px 10px" }}>
              <span style={{ color: c.muted, fontSize: 10 }}>{label}</span>
              <br />
              <b style={{ fontSize: 17 }}>{STAT_VALUES[i]}</b>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 190, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none" }}>
        <Step at={3} step={step}>
          <b>{t.ticket}</b>
          <div style={{ marginTop: 9, background: "#F5E9DF", color: "#2A1A12", borderRadius: 11, padding: 12, lineHeight: 1.65 }}>
            <b style={{ fontSize: 19 }}>{t.table} 7</b>
            <br />
            {t.when}
            <br />
            {t.party}
            <Step at={4} step={step} from="none" style={{ borderTop: "1.5px dashed #C9B5A8", marginTop: 8, paddingTop: 8, fontSize: 10.5, color: "#7A5F50" }}>
              {t.sent}
            </Step>
          </div>
        </Step>
        <b style={{ display: "block", margin: "13px 0 6px" }}>{t.inbox}</b>
        <Step at={0} step={step} style={{ background: "#30221B", borderRadius: "11px 11px 11px 3px", padding: "8px 10px", lineHeight: 1.4 }}>
          {t.ask}
        </Step>
        {([[1, t.checking], [3, t.offer]] as const).map(([at, text]) => (
          <Step key={at} at={at} step={step} style={{ marginTop: 6, background: c.app, color: c.on, borderRadius: "11px 11px 3px 11px", padding: "8px 10px", lineHeight: 1.4, fontWeight: 500 }}>
            {text}
          </Step>
        ))}
      </div>
    </WindowShell>
  );
}
