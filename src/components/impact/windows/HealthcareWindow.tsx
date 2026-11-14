import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Agenda clínica",
  nav: ["Agenda", "Pacientes", "Lista de espera", "Recordatorios", "Asistente"],
  online: "En línea",
  status: ["Asistente activo", "3 conversaciones hoy"],
  agenda: "Agenda de mañana",
  openings: ["2 espacios libres", "1 espacio libre"],
  views: ["Día", "Semana"],
  rooms: ["Consultorio 1", "Consultorio 2", "Consultorio 3"],
  busy: "Ocupado",
  pending: "Por confirmar",
  free: "Disponible",
  booked: "Cita nueva",
  bookedSub: "Paciente · 10:30",
  stats: ["Citas de mañana", "En lista de espera", "Recordatorios enviados"],
  inbox: "Mensajes",
  assistant: "Asistente",
  ask: "Hola, ¿tendrán cita para mañana?",
  checking: "¡Hola! Claro, déjame revisar la agenda.",
  found: "Tengo dos espacios mañana. Te aparto el de las 10:30, ¿te parece?",
  confirmed: "Cita confirmada",
  when: "Mañana, 10:30 AM",
  reminder: "Recordatorio programado",
};

const copy = {
  es,
  en: {
    app: "Clinic schedule",
    nav: ["Schedule", "Patients", "Waitlist", "Reminders", "Assistant"],
    online: "Online",
    status: ["Assistant active", "3 conversations today"],
    agenda: "Tomorrow's schedule",
    openings: ["2 open slots", "1 open slot"],
    views: ["Day", "Week"],
    rooms: ["Room 1", "Room 2", "Room 3"],
    busy: "Booked",
    pending: "To confirm",
    free: "Open",
    booked: "New appointment",
    bookedSub: "Patient · 10:30",
    stats: ["Tomorrow's appointments", "On the waitlist", "Reminders sent"],
    inbox: "Messages",
    assistant: "Assistant",
    ask: "Hi, do you have anything open tomorrow?",
    checking: "Hi! Sure, let me check the schedule.",
    found: "I have two openings tomorrow. I'll hold the 10:30 for you, sound good?",
    confirmed: "Appointment confirmed",
    when: "Tomorrow, 10:30 AM",
    reminder: "Reminder scheduled",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = {
  bg: "#FFFFFF",
  ink: "#12302c",
  muted: "#6b837f",
  line: "#DDEAE7",
  chrome: "#F3FAF8",
  side: "#0D2F2B",
  sideText: "#BFDCD7",
  sideLine: "#23504a",
  app: "#17B3A3",
  on: "#06231f",
  ok: "#7BE3C4",
};

const HOURS = ["9:00", "9:45", "10:30", "11:15", "12:00"];
/** One list per room. 0 free · 1 busy · 2 to confirm · 3 the slot the assistant books. */
const ROOMS = [
  [1, 1, 3, 1, 1],
  [1, 0, 1, 1, 2],
  [2, 1, 1, 1, 1],
];
const STAT_VALUES = ["11", "2", "9"];

const cell: CSSProperties = { height: 40, borderRadius: 8, padding: "6px 8px" };
const mine: CSSProperties = { marginTop: 6, background: "#0B7A70", color: "#fff", borderRadius: "11px 11px 3px 11px", padding: "8px 10px", lineHeight: 1.4 };

/** A free slot. It lights up while the assistant checks, and stays marked once picked. */
function freeCell(lit: boolean, picked: boolean): CSSProperties {
  return {
    ...cell,
    padding: "5px 8px",
    border: `1.5px ${picked ? "solid #0B7A70" : "dashed #9FD8CF"}`,
    color: "#0B7A70",
    fontWeight: 600,
    background: lit || picked ? "#E4F6F2" : "transparent",
    boxShadow: lit || picked ? "0 0 0 3px #D9F1ED" : "0 0 0 0 #D9F1ED",
    transition: "background-color 300ms, box-shadow 300ms, border-color 300ms",
  };
}

export function HealthcareWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const created = step >= 4;

  const slot = (state: number, key: string) => {
    if (state === 1) return <div key={key} style={{ ...cell, background: "#EEF4F3", color: c.muted }}>{t.busy}</div>;
    if (state === 2) return <div key={key} style={{ ...cell, background: "#FFF4DC", color: "#8a5a00" }}>{t.pending}</div>;
    if (state === 0) return <div key={key} style={freeCell(step === 2, false)}>{t.free}</div>;
    return (
      <div key={key} style={{ position: "relative", height: 40 }}>
        <div
          aria-hidden={created ? true : undefined}
          style={{ ...freeCell(step === 2, step === 3), position: "absolute", inset: 0, opacity: created ? 0 : 1, transition: "opacity 300ms, background-color 300ms, box-shadow 300ms, border-color 300ms" }}
        >
          {t.free}
        </div>
        <div
          aria-hidden={created ? undefined : true}
          style={{
            ...cell,
            position: "absolute",
            inset: 0,
            background: "#0B7A70",
            color: "#fff",
            fontWeight: 600,
            lineHeight: 1.25,
            boxShadow: "0 8px 16px -8px #0B7A70",
            opacity: created ? 1 : 0,
            transform: created ? "none" : "scale(0.94)",
            transition: "opacity 400ms ease-out, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {t.booked}
          <div style={{ fontWeight: 400, fontSize: 10, opacity: 0.9 }}>{t.bookedSub}</div>
        </div>
      </div>
    );
  };

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <b style={{ fontSize: 15 }}>{t.agenda}</b>
          <Chip bg={step === 2 ? "#0B7A70" : "#D9F1ED"} fg={step === 2 ? "#fff" : "#0B7A70"}>
            {t.openings[created ? 1 : 0]}
          </Chip>
          <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <Chip bg="#12302c" fg="#fff">{t.views[0]}</Chip>
            <Chip bg="#fff" fg={c.muted} style={{ boxShadow: `inset 0 0 0 1px ${c.line}` }}>{t.views[1]}</Chip>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "38px repeat(3,1fr)", gap: 6, fontSize: 11 }}>
          <span />
          {t.rooms.map((room) => (
            <b key={room} style={{ fontSize: 11, color: c.muted, paddingBottom: 2 }}>{room}</b>
          ))}
          {HOURS.flatMap((hour, row) => [
            <span key={hour} style={{ color: c.muted, paddingTop: 6, fontVariantNumeric: "tabular-nums" }}>{hour}</span>,
            ...ROOMS.map((room, i) => slot(room[row], `${hour}-${i}`)),
          ])}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {t.stats.map((label, i) => (
            <div key={label} style={{ flex: 1, border: `1px solid ${c.line}`, borderRadius: 11, padding: "8px 10px" }}>
              <span style={{ color: c.muted, fontSize: 10 }}>{label}</span>
              <br />
              <b style={{ fontSize: 17 }}>{STAT_VALUES[i]}</b>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 190, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: c.chrome }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <b>{t.inbox}</b>
          <span style={{ marginLeft: "auto" }}>
            <Chip bg="#D9F1ED" fg="#0B7A70">{t.assistant}</Chip>
          </span>
        </div>
        <Step at={0} step={step} style={{ marginTop: 9, background: "#fff", border: `1px solid ${c.line}`, borderRadius: "11px 11px 11px 3px", padding: "8px 10px", lineHeight: 1.4 }}>
          {t.ask}
        </Step>
        <Step at={1} step={step} style={mine}>{t.checking}</Step>
        <Step at={3} step={step} style={mine}>{t.found}</Step>
        <Step at={5} step={step} style={{ marginTop: 11, border: "1px solid #BFE5DE", background: "#fff", borderRadius: 11, padding: "10px 11px", lineHeight: 1.5 }}>
          <b style={{ color: "#0B7A70" }}>
            <span aria-hidden>✓ </span>
            {t.confirmed}
          </b>
          <br />
          {t.when}
          <div style={{ color: c.muted, fontSize: 10.5, marginTop: 4 }}>{t.reminder}</div>
        </Step>
      </div>
    </WindowShell>
  );
}
