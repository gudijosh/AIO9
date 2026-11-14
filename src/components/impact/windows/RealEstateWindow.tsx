import type { ReactNode } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import photo from "../../../../public/images/industries/real-estate.webp";
import { Btn, Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "CRM inmobiliario",
  nav: ["Prospectos", "Propiedades", "Visitas", "Mensajes", "Reportes"],
  online: "En línea",
  status: ["Asistente activo", "CRM actualizado"],
  working: "Atendiendo consulta",
  search: "Buscar prospecto",
  addLead: "+ Prospecto",
  columns: ["Nuevo", "Calificado", "Visita", "Oferta"],
  levels: { high: "Alto", mid: "Medio", low: "Bajo", fresh: "Nuevo" },
  cards: [
    ["Consulta web", "Apartamento"],
    ["Llamada", "Local comercial"],
    ["Consulta web", "Terreno"],
    ["Referido", "Casa"],
  ],
  leadName: "Prospecto web",
  property: "Casa en zona residencial",
  specs: "3 habitaciones · 2 baños · 180 m²",
  available: "Disponible",
  week: "Visitas de la semana",
  days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  midweek: "16:30",
  visitTime: "11:00",
  interest: "Interés alto",
  budget: "Presupuesto: hasta 180 mil",
  timeline: "Plazo: este año",
  visit: "Visita agendada",
  visitWhen: "Sábado, 11:00",
};

const copy = {
  es,
  en: {
    app: "Real estate CRM",
    nav: ["Leads", "Listings", "Visits", "Messages", "Reports"],
    online: "Online",
    status: ["Assistant active", "CRM updated"],
    working: "Handling inquiry",
    search: "Search leads",
    addLead: "+ Lead",
    columns: ["New", "Qualified", "Visit", "Offer"],
    levels: { high: "High", mid: "Medium", low: "Low", fresh: "New" },
    cards: [
      ["Web inquiry", "Apartment"],
      ["Phone call", "Retail space"],
      ["Web inquiry", "Land"],
      ["Referral", "House"],
    ],
    leadName: "Web lead",
    property: "House in a residential area",
    specs: "3 bedrooms · 2 baths · 1,940 sq ft",
    available: "Available",
    week: "Visits this week",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    midweek: "4:30 PM",
    visitTime: "11:00 AM",
    interest: "High interest",
    budget: "Budget: up to 180k",
    timeline: "Timeline: this year",
    visit: "Visit scheduled",
    visitWhen: "Saturday, 11:00 AM",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = {
  bg: "#FFFFFF",
  ink: "#16291F",
  muted: "#6F8478",
  line: "#E1EAE4",
  chrome: "#F6FAF7",
  side: "#123B2A",
  sideText: "#B9D5C6",
  sideLine: "#2a5a43",
  app: "#C9A24B",
  on: "#1C1503",
  ok: "#8FE0B0",
};

type Level = keyof typeof es.levels;
const LEVEL_BG: Record<Level, string> = { high: "#C9A24B", mid: "#F1E7CC", low: "#EDF2EE", fresh: "#EDF2EE" };
const LEVEL_FG: Record<Level, string> = { high: "#1C1503", mid: "#6F5A1E", low: "#6F5A1E", fresh: "#6F5A1E" };

function Card({ title, sub, level, label, hot }: { title: string; sub: string; level: Level; label: string; hot?: boolean }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${hot ? "#1F6B4A" : c.line}`,
        borderRadius: 9,
        padding: "7px 8px",
        marginBottom: 6,
        boxShadow: hot ? "0 8px 16px -10px #1F6B4A" : undefined,
      }}
    >
      <b style={{ display: "block", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</b>
      <div style={{ color: c.muted, fontSize: 10, margin: "2px 0 5px" }}>{sub}</div>
      <Chip bg={LEVEL_BG[level]} fg={LEVEL_FG[level]} style={{ fontSize: 9.5, padding: "2px 7px" }}>{label}</Chip>
    </div>
  );
}

/** The place the moving lead takes in one column. It keeps its space while empty. */
function Slot({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={show ? undefined : true}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(6px) scale(0.96)",
        transition: "opacity 400ms ease-out, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

function Column({ name, count, children }: { name: string; count: number; children: ReactNode }) {
  return (
    <div style={{ flex: 1, background: "#F2F6F3", borderRadius: 10, padding: 7, minWidth: 0 }}>
      <div style={{ display: "flex", marginBottom: 7, fontWeight: 600, fontSize: 11 }}>
        {name}
        <span style={{ marginLeft: "auto", color: c.muted }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

export function RealEstateWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  /** Column the web lead sits in: new, then qualified, then visit. */
  const stage = step >= 4 ? 2 : step >= 3 ? 1 : 0;
  const booked = step >= 4;
  const base = (i: number, level: Level) => <Card title={t.cards[i][0]} sub={t.cards[i][1]} level={level} label={t.levels[level]} />;
  const lead = (at: number, level: Level) => (
    <Slot show={stage === at}>
      <Card title={t.leadName} sub={t.property} level={level} label={t.levels[level]} hot={at > 0} />
    </Slot>
  );

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={[t.status[0], step >= 5 ? t.status[1] : t.working]} simulation={simulation}>
      <div style={{ flex: 1, padding: 14, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ flex: 1, border: `1px solid ${c.line}`, borderRadius: 8, padding: "7px 10px", color: c.muted }}>{t.search}</span>
          <Btn bg="#1F6B4A" fg="#fff">{t.addLead}</Btn>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <Column name={t.columns[0]} count={stage === 0 ? 3 : 2}>
            {base(0, "mid")}
            {base(1, "low")}
            {lead(0, "fresh")}
          </Column>
          <Column name={t.columns[1]} count={stage === 1 ? 3 : 2}>
            {base(2, "mid")}
            {base(3, "high")}
            {lead(1, "high")}
          </Column>
          <Column name={t.columns[2]} count={stage === 2 ? 1 : 0}>
            {lead(2, "high")}
          </Column>
          <Column name={t.columns[3]} count={0}>
            <div aria-hidden style={{ border: "1.5px dashed #C8D6CD", borderRadius: 9, height: 54 }} />
          </Column>
        </div>
        <div style={{ marginTop: 10, border: `1px solid ${c.line}`, borderRadius: 11, padding: "9px 11px" }}>
          <b>{t.week}</b>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 5, marginTop: 7, fontSize: 10.5 }}>
            {t.days.map((day, i) => {
              const on = i === 5 && booked;
              return (
                <div
                  key={day}
                  style={{
                    borderRadius: 8,
                    padding: "6px 7px",
                    background: on ? "#1F6B4A" : "#F2F6F3",
                    color: on ? "#fff" : "#6F8478",
                    whiteSpace: "nowrap",
                    transition: "background-color 350ms, color 350ms",
                  }}
                >
                  <b>{day}</b>
                  <div style={{ marginTop: 2 }}>{on ? t.visitTime : i === 2 ? t.midweek : "—"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ width: 196, borderLeft: `1px solid ${c.line}`, padding: 14, flex: "none", background: c.chrome }}>
        <Step at={1} step={step}>
          <Image
            src={photo}
            alt=""
            width={336}
            height={168}
            sizes="200px"
            style={{ display: "block", width: "100%", height: 84, objectFit: "cover", borderRadius: 10 }}
          />
          <b style={{ display: "block", marginTop: 9 }}>{t.property}</b>
          <div style={{ color: c.muted, marginTop: 3 }}>{t.specs}</div>
          <Chip bg="#E0F2E8" fg="#1F6B4A" style={{ marginTop: 6 }}>{t.available}</Chip>
        </Step>
        <Step at={2} step={step} style={{ marginTop: 11, borderTop: `1px solid ${c.line}`, paddingTop: 9 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <b>{t.leadName}</b>
            <Step at={3} step={step} from="right" style={{ marginLeft: "auto", display: "flex" }}>
              <Chip bg="#C9A24B" fg="#1C1503">{t.interest}</Chip>
            </Step>
          </div>
          <div style={{ color: c.muted, lineHeight: 1.7, marginTop: 5 }}>
            {t.budget}
            <br />
            {t.timeline}
          </div>
        </Step>
        <Step at={5} step={step} style={{ marginTop: 9, background: "#123B2A", color: "#fff", borderRadius: 10, padding: "9px 10px", lineHeight: 1.45 }}>
          <b>{t.visit}</b>
          <br />
          {t.visitWhen}
        </Step>
      </div>
    </WindowShell>
  );
}
