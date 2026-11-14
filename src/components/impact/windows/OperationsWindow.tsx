import type { Locale } from "@/i18n/config";
import { Btn, Chip, Dot, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Operaciones",
  live: "En vivo",
  online: "En línea",
  nav: ["Órdenes", "Rutas", "Incidencias", "Equipo", "Reportes"],
  status: ["Panel operativo", "Turno de la tarde"],
  counters: ["En ruta", "Reprogramadas", "Incidencias abiertas"],
  columns: ["Orden", "Ruta", "Ventana", "Estado"],
  routes: { centro: "Centro", sur: "Sur", norte: "Norte" },
  statuses: { transit: "En ruta", delivered: "Entregada", incident: "Incidencia", fresh: "Nueva", rescheduled: "Reprogramada" },
  load: "Carga por ruta",
  order: "Orden 4812",
  detail: "24 unidades, ruta norte",
  verify: "Verificación",
  checks: ["Dirección", "Inventario", "Ventana de entrega"],
  ok: "Correcto",
  checking: "Revisando",
  exception: "Fuera de horario",
  suggested: "Acción sugerida",
  action: "Reprogramar la entrega de 14:00 a 16:00",
  approve: "Aprobar",
  change: "Cambiar",
  awaiting: "Requiere aprobación · se asigna al jefe de turno",
  approved: "Aprobada por supervisión · Asignada al jefe de turno",
};

const copy = {
  es,
  en: {
    app: "Operations",
    live: "Live",
    online: "Online",
    nav: ["Orders", "Routes", "Exceptions", "Team", "Reports"],
    status: ["Operations board", "Afternoon shift"],
    counters: ["In transit", "Rescheduled", "Open exceptions"],
    columns: ["Order", "Route", "Window", "Status"],
    routes: { centro: "Central", sur: "South", norte: "North" },
    statuses: { transit: "In transit", delivered: "Delivered", incident: "Exception", fresh: "New", rescheduled: "Rescheduled" },
    load: "Load by route",
    order: "Order 4812",
    detail: "24 units, north route",
    verify: "Verification",
    checks: ["Address", "Inventory", "Delivery window"],
    ok: "OK",
    checking: "Checking",
    exception: "Outside hours",
    suggested: "Suggested action",
    action: "Reschedule delivery to 2:00–4:00 PM",
    approve: "Approve",
    change: "Change",
    awaiting: "Needs approval · goes to the shift lead",
    approved: "Approved by a supervisor · Assigned to the shift lead",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = { bg: "#171A1F", ink: "#EDEFF2", muted: "#8B93A0", line: "#2A2F37", chrome: "#0F1215", side: "#0F1215", sideText: "#AAB1BD", sideLine: "#2A2F37", app: "#F5A524", on: "#231500", ok: "#6FD69C" };

type Status = keyof typeof es.statuses;
type Route = keyof typeof es.routes;

const tone: Record<Status, readonly [string, string]> = {
  transit: ["#1D3A2C", "#6FD69C"],
  delivered: ["#23272E", "#8B93A0"],
  incident: ["#4A2F08", "#F5A524"],
  fresh: ["#1C2B44", "#7FB0FF"],
  rescheduled: ["#3a2a4f", "#C9A6FF"],
};

const rows: readonly (readonly [string, Route, string, Status])[] = [
  ["4809", "centro", "08–10", "delivered"],
  ["4810", "sur", "10–12", "transit"],
  ["4811", "centro", "12–14", "fresh"],
  ["4812", "norte", "14–16", "incident"],
  ["4813", "sur", "14–16", "transit"],
  ["4814", "norte", "16–18", "rescheduled"],
];

const loads: readonly (readonly [Route, number])[] = [["centro", 70], ["sur", 88], ["norte", 52]];

export function OperationsWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  /** Status of order 4812, the one the story follows. */
  const current: Status = step >= 5 ? "rescheduled" : step >= 2 ? "incident" : "fresh";
  const flagged = step >= 2 && step < 5;
  const approved = step >= 4;
  const counters = [
    ["12", "#6FD69C"],
    [step >= 5 ? "4" : "3", "#C9A6FF"],
    [flagged ? "1" : "0", "#F5A524"],
  ] as const;

  return (
    <WindowShell
      theme={c}
      app={t.app}
      nav={t.nav}
      online={t.online}
      status={t.status}
      simulation={simulation}
      top={
        <span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 5, color: "#6FD69C", fontSize: 11 }}>
          <Dot color="#6FD69C" />
          {t.live}
        </span>
      }
    >
      <div style={{ flex: 1, padding: 14, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 11 }}>
          {counters.map(([value, color], i) => (
            <div key={color} style={{ flex: 1, background: "#1E2228", borderRadius: 11, padding: "9px 11px", boxShadow: `inset 3px 0 0 ${color}` }}>
              <span style={{ color: c.muted, fontSize: 10 }}>{t.counters[i]}</span>
              <br />
              <b style={{ fontSize: 19 }}>{value}</b>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", color: c.muted, padding: "0 10px 7px", borderBottom: `1px solid ${c.line}`, marginBottom: 5, fontWeight: 600, fontSize: 11 }}>
          <span style={{ width: 62 }}>{t.columns[0]}</span>
          <span style={{ width: 70 }}>{t.columns[1]}</span>
          <span style={{ width: 70 }}>{t.columns[2]}</span>
          <span>{t.columns[3]}</span>
        </div>
        {rows.map(([order, route, window, fixed]) => {
          const tracked = order === "4812";
          const status = tracked ? current : fixed;
          return (
            <Step key={order} at={tracked ? 0 : -1} step={step} from="left">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 8,
                  marginBottom: 2,
                  background: tracked && flagged ? "#22262D" : "transparent",
                  boxShadow: `inset 3px 0 0 ${tracked && flagged ? "#F5A524" : "transparent"}`,
                  transition: "background-color 300ms, box-shadow 300ms",
                }}
              >
                <span style={{ width: 62, fontVariantNumeric: "tabular-nums" }}>{order}</span>
                <span style={{ width: 70, color: c.muted }}>{t.routes[route]}</span>
                <span style={{ width: 70, color: c.muted }}>{window} h</span>
                <Chip bg={tone[status][0]} fg={tone[status][1]}>
                  {t.statuses[status]}
                </Chip>
              </div>
            </Step>
          );
        })}
        <div style={{ marginTop: 9, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: c.muted, fontSize: 10.5, width: 74 }}>{t.load}</span>
          {loads.map(([route, pct]) => (
            <span key={route} style={{ flex: 1 }}>
              <span style={{ display: "flex", fontSize: 10.5 }}>
                {t.routes[route]}
                <span style={{ marginLeft: "auto", color: c.muted }}>{pct} %</span>
              </span>
              <i aria-hidden style={{ display: "block", height: 5, borderRadius: 5, background: "#2A2F37", marginTop: 4 }}>
                <i style={{ display: "block", height: "100%", width: `${pct}%`, borderRadius: 5, background: pct > 80 ? "#F5A524" : "#6FD69C" }} />
              </i>
            </span>
          ))}
        </div>
      </div>

      <div style={{ width: 196, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: "#13161A" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <b style={{ fontSize: 14 }}>{t.order}</b>
          <span style={{ marginLeft: "auto" }}>
            <Chip bg={tone[current][0]} fg={tone[current][1]}>
              {t.statuses[current]}
            </Chip>
          </span>
        </div>
        <div style={{ color: c.muted, marginTop: 2 }}>{t.detail}</div>
        <b style={{ display: "block", margin: "11px 0 6px" }}>{t.verify}</b>
        {t.checks.map((label, i) => {
          const late = i === 2;
          const failed = late && step >= 2;
          return (
            <div key={label} style={{ display: "flex", padding: "5px 0", borderTop: `1px solid ${c.line}` }}>
              <span style={{ flex: 1, color: c.muted }}>{label}</span>
              <b
                style={{
                  color: failed ? "#F5A524" : late ? c.muted : "#6FD69C",
                  opacity: step >= 1 ? 1 : 0,
                  transition: "opacity 350ms ease-out, color 300ms",
                  transitionDelay: step === 1 ? `${i * 280}ms` : "0ms",
                }}
              >
                {failed ? t.exception : late ? t.checking : t.ok}
              </b>
            </div>
          );
        })}
        <Step at={3} step={step} style={{ marginTop: 11 }}>
          <div style={{ background: "#221A0B", border: "1px solid #5A3F0D", borderRadius: 11, padding: "10px 11px", lineHeight: 1.45 }}>
            <span style={{ color: "#F5A524", fontWeight: 700 }}>{t.suggested}</span>
            <br />
            {t.action}
            <div style={{ marginTop: 9, display: "flex", gap: 6 }}>
              <Btn
                bg={approved ? "#B87A14" : "#F5A524"}
                fg="#231500"
                style={{ boxShadow: approved ? "inset 0 2px 5px #00000066" : "inset 0 0 0 #00000000", transform: approved ? "translateY(1px)" : "none" }}
              >
                {t.approve}
              </Btn>
              <Btn bg="transparent" fg="#EDEFF2" style={{ boxShadow: "inset 0 0 0 1px #5A3F0D", opacity: approved ? 0.5 : 1 }}>
                {t.change}
              </Btn>
            </div>
          </div>
        </Step>
        <Step at={3} step={step} style={{ marginTop: 9 }}>
          <div style={{ color: approved ? "#6FD69C" : c.muted, fontSize: 10.5, minHeight: 30, transition: "color 300ms" }}>
            {approved ? t.approved : t.awaiting}
          </div>
        </Step>
      </div>
    </WindowShell>
  );
}
