import type { Locale } from "@/i18n/config";
import { Btn, Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Documentos",
  nav: ["Bandeja", "En revisión", "Aprobados", "Plantillas", "Reportes"],
  online: "En línea",
  status: ["Lector activo", "4 documentos hoy"],
  inbox: "Bandeja de entrada",
  file: "contrato-servicios.pdf",
  others: ["factura-0312.pdf", "poder-notarial.pdf", "anexo-b.docx"],
  fresh: "Nuevo",
  reading: "Procesando",
  inReview: "En revisión",
  processed: "Procesada",
  queued: "En cola",
  pages: "12 páginas",
  type: "Contrato de servicios",
  tags: ["Legal", "Prioridad media"],
  extracted: "Datos extraídos",
  confidence: "Confianza",
  fields: ["Partes", "Vigencia", "Renovación"],
  values: ["2 identificadas", "12 meses", "Automática"],
  percent: ["98 %", "96 %", "71 %"],
  check: " · revisar",
  summaryLabel: "Resumen",
  summary: "Contrato anual que se renueva solo. Vale la pena revisar la cláusula de terminación.",
  approve: "Aprobar",
  correct: "Corregir",
  review: "En revisión humana · asignado a un especialista",
};

const copy = {
  es,
  en: {
    app: "Documents",
    nav: ["Inbox", "In review", "Approved", "Templates", "Reports"],
    online: "Online",
    status: ["Reader active", "4 documents today"],
    inbox: "Inbox",
    file: "service-agreement.pdf",
    others: ["invoice-0312.pdf", "power-of-attorney.pdf", "annex-b.docx"],
    fresh: "New",
    reading: "Processing",
    inReview: "In review",
    processed: "Processed",
    queued: "Queued",
    pages: "12 pages",
    type: "Service agreement",
    tags: ["Legal", "Medium priority"],
    extracted: "Extracted data",
    confidence: "Confidence",
    fields: ["Parties", "Term", "Renewal"],
    values: ["2 identified", "12 months", "Automatic"],
    percent: ["98%", "96%", "71%"],
    check: " · review",
    summaryLabel: "Summary",
    summary: "Annual agreement that renews on its own. The termination clause is worth a closer look.",
    approve: "Approve",
    correct: "Correct",
    review: "In human review · assigned to a specialist",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = {
  bg: "#FFFFFF",
  ink: "#1B1838",
  muted: "#77749A",
  line: "#E5E3F3",
  chrome: "#FAF9FF",
  side: "#221D4E",
  sideText: "#C2BDF0",
  sideLine: "#3c3676",
  app: "#7B6CFF",
  on: "#fff",
  ok: "#A9F0C7",
};

/** Width in % of each line of the page preview; `true` marks a line the reader picks data from. */
const LINES: readonly (readonly [number, boolean])[] = [
  [92, false], [70, true], [84, false], [58, false], [88, true], [76, false], [48, false],
  [90, false], [64, true], [80, false], [72, false], [54, false], [86, false], [40, false],
];
/** Whether each of the other documents in the queue is still waiting. */
const WAITING = [false, true, false];
const small = { fontSize: 9.5, padding: "2px 7px" };
const fileName = { fontWeight: 600, fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } as const;

export function ServicesWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const flagged = step >= 3;
  const handedOff = step >= 5;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ width: 168, padding: "14px 10px 14px 14px", flex: "none", borderRight: `1px solid ${c.line}` }}>
        <b>{t.inbox}</b>
        <Step at={0} step={step} from="left" style={{ marginTop: 7, border: "1px solid #7B6CFF", borderRadius: 10, padding: "8px 9px", background: "#F4F2FF" }}>
          <div style={fileName}>{t.file}</div>
          <div style={{ marginTop: 5 }}>
            <Chip bg={handedOff ? "#4B3FBF" : "#ECE9FF"} fg={handedOff ? "#fff" : "#4B3FBF"} style={small}>
              {handedOff ? t.inReview : step >= 1 ? t.reading : t.fresh}
            </Chip>
          </div>
        </Step>
        {t.others.map((name, i) => (
          <div key={name} style={{ marginTop: 7, border: `1px solid ${c.line}`, borderRadius: 10, padding: "8px 9px" }}>
            <div style={fileName}>{name}</div>
            <div style={{ marginTop: 5 }}>
              <Chip bg={WAITING[i] ? "#FFF1D6" : "#E6F6EC"} fg={WAITING[i] ? "#8A5A00" : "#1E7A45"} style={small}>
                {WAITING[i] ? t.queued : t.processed}
              </Chip>
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: 168, padding: "14px 12px", flex: "none", background: "#F4F3FB" }}>
        <Step at={1} step={step} style={{ background: "#fff", border: `1px solid ${c.line}`, borderRadius: 8, padding: "14px 12px", height: "100%", boxShadow: "0 12px 22px -16px #4B3FBF" }}>
          <b style={{ ...fileName, display: "block" }}>{t.file}</b>
          <div style={{ color: c.muted, fontSize: 10, margin: "2px 0 12px" }}>{t.pages}</div>
          <div aria-hidden>
            {LINES.map(([width, picked], i) => (
              <i
                key={i}
                style={{
                  display: "block",
                  height: 6,
                  borderRadius: 6,
                  marginBottom: 7,
                  width: `${width}%`,
                  background: picked && step >= 2 ? "#CFC8FF" : "#ECEAF6",
                  transition: `background-color 400ms ${i * 30}ms`,
                }}
              />
            ))}
          </div>
        </Step>
      </div>
      <div style={{ flex: 1, padding: 14, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <Step at={1} step={step} style={{ width: "100%", marginBottom: 5 }}>
            <b style={{ fontSize: 13.5 }}>{t.type}</b>
          </Step>
          <Step at={1} step={step} style={{ display: "flex" }}>
            <Chip bg="#ECE9FF" fg="#4B3FBF">{t.tags[0]}</Chip>
          </Step>
          <Step at={3} step={step} from="left" style={{ display: "flex" }}>
            <Chip bg="#FFF1D6" fg="#8A5A00">{t.tags[1]}</Chip>
          </Step>
        </div>
        <Step at={2} step={step} from="none" style={{ color: c.muted, fontWeight: 600, margin: "11px 0 6px", display: "flex" }}>
          <span>{t.extracted}</span>
          <span style={{ marginLeft: "auto" }}>{t.confidence}</span>
        </Step>
        {t.fields.map((field, i) => {
          const low = i === 2;
          const warn = low && flagged;
          return (
            <Step
              key={field}
              at={2}
              step={step}
              style={{
                padding: "7px 9px",
                background: warn ? "#FFF6E6" : "#F7F6FD",
                borderRadius: 9,
                marginBottom: 5,
                transition: "opacity 400ms ease-out, transform 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms",
                transitionDelay: `${i * 140}ms, ${i * 140}ms, 0ms`,
              }}
            >
              <div style={{ display: "flex" }}>
                <span style={{ color: c.muted, flex: 1 }}>{field}</span>
                <b style={{ color: warn ? "#A85F06" : low ? c.muted : "#1E7A45", transition: "color 350ms" }}>{t.percent[i]}</b>
              </div>
              <b>{t.values[i]}</b>
              {low && (
                <span aria-hidden={warn ? undefined : true} style={{ color: "#A85F06", fontSize: 10.5, opacity: warn ? 1 : 0, transition: "opacity 350ms" }}>
                  {t.check}
                </span>
              )}
            </Step>
          );
        })}
        <Step at={4} step={step}>
          <div style={{ color: c.muted, fontWeight: 600, margin: "9px 0 5px" }}>{t.summaryLabel}</div>
          <div style={{ lineHeight: 1.45 }}>{t.summary}</div>
        </Step>
        <Step at={5} step={step}>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <Btn bg="#4B3FBF" fg="#fff">{t.approve}</Btn>
            <Btn bg="#fff" fg="#1B1838" style={{ boxShadow: `inset 0 0 0 1px ${c.line}` }}>{t.correct}</Btn>
          </div>
          <div style={{ color: c.muted, fontSize: 10.5, marginTop: 8 }}>{t.review}</div>
        </Step>
      </div>
    </WindowShell>
  );
}
