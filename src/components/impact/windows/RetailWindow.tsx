import Image from "next/image";
import type { Locale } from "@/i18n/config";
import photo from "../../../../public/images/industries/retail.webp";
import { Chip, Step, WindowShell, type WindowProps, type WindowTheme } from "./kit";

const es = {
  app: "Tienda",
  nav: ["Productos", "Pedidos", "Clientes", "Inventario", "Mensajes"],
  online: "En línea",
  status: ["Asistente activo", "Inventario al día"],
  product: "Chaqueta de lana",
  sku: "Ref. 204",
  colors: ["Gris piedra", "Azul noche", "Carbón"],
  columns: ["Talla", "Existencia"],
  units: "disponibles",
  out: "Agotada",
  held: "Apartada",
  low: "Quedan pocas",
  stats: ["Pedidos de hoy", "Apartados", "Por dar seguimiento"],
  inbox: "Mensajes",
  ask: "Hola, ¿tienen la chaqueta gris en talla M?",
  reply: "¡Sí! Quedan 3 en talla M. También la tenemos en azul noche.",
  order: "Pedido",
  item: "Chaqueta de lana, gris, M",
  hold: "Apartada por 24 horas",
  flow: ["Consulta", "Inventario", "Apartado", "Seguimiento"],
  followUp: "Seguimiento programado: mañana, 10:00",
};

const copy = {
  es,
  en: {
    app: "Store",
    nav: ["Products", "Orders", "Customers", "Inventory", "Messages"],
    online: "Online",
    status: ["Assistant active", "Inventory up to date"],
    product: "Wool jacket",
    sku: "Ref. 204",
    colors: ["Stone grey", "Midnight blue", "Charcoal"],
    columns: ["Size", "Stock"],
    units: "in stock",
    out: "Sold out",
    held: "On hold",
    low: "Running low",
    stats: ["Today's orders", "On hold", "To follow up"],
    inbox: "Messages",
    ask: "Hi, do you have the grey jacket in a medium?",
    reply: "Yes! We have 3 left in medium. It also comes in midnight blue.",
    order: "Order",
    item: "Wool jacket, grey, M",
    hold: "On hold for 24 hours",
    flow: ["Question", "Inventory", "Hold", "Follow-up"],
    followUp: "Follow-up scheduled: tomorrow, 10:00 AM",
  },
} satisfies Record<Locale, typeof es>;

const c: WindowTheme = {
  bg: "#FFFFFF",
  ink: "#2B1420",
  muted: "#8A6F7B",
  line: "#F0DFE6",
  chrome: "#FFF9FB",
  side: "#3A0F22",
  sideText: "#E6BECD",
  sideLine: "#5c2239",
  app: "#F0457E",
  on: "#fff",
  ok: "#FFB3CC",
};

const SWATCHES = ["#9A9A98", "#1F2B4A", "#33343A"];
const SIZES: readonly (readonly [string, number])[] = [["S", 0], ["M", 3], ["L", 5], ["XL", 2]];
const STAT_VALUES = ["14", "3", "5"];
/** Step at which each stage of the flow is done. */
const FLOW_AT = [0, 1, 3, 4];

export function RetailWindow({ step, locale, simulation }: WindowProps) {
  const t = copy[locale];
  const options = step >= 2;

  return (
    <WindowShell theme={c} app={t.app} nav={t.nav} online={t.online} status={t.status} simulation={simulation}>
      <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Image
            src={photo}
            alt=""
            width={156}
            height={156}
            sizes="200px"
            style={{ width: 78, height: 78, objectFit: "cover", borderRadius: 12, flex: "none" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <b style={{ fontSize: 16 }}>{t.product}</b>
              <span style={{ color: c.muted }}>{t.sku}</span>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 9, alignItems: "center" }}>
              {t.colors.map((name, i) => {
                const picked = i === 0 && options;
                return (
                  <span key={name} style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", color: picked ? c.ink : c.muted, fontWeight: picked ? 600 : 400, transition: "color 300ms" }}>
                    <i
                      aria-hidden
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        flex: "none",
                        background: SWATCHES[i],
                        boxShadow: picked ? "0 0 0 2px #fff, 0 0 0 3.5px #C42B5C" : "0 0 0 2px #fff, 0 0 0 2px #C42B5C",
                        transform: options ? "none" : "scale(0.86)",
                        transition: "box-shadow 300ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, border: `1px solid ${c.line}`, borderRadius: 11, overflow: "hidden" }}>
          <div style={{ display: "flex", background: c.chrome, color: c.muted, fontWeight: 600, padding: "7px 11px", fontSize: 11 }}>
            <span style={{ width: 52 }}>{t.columns[0]}</span>
            <span style={{ flex: 1 }}>{t.columns[1]}</span>
            <span style={{ width: 96 }} />
          </div>
          {SIZES.map(([size, n], i) => {
            const asked = size === "M";
            return (
              <div key={size} style={{ borderTop: `1px solid ${c.line}`, background: asked && step >= 1 ? "#FDE8EF" : "transparent", transition: "background-color 400ms 200ms" }}>
                <Step at={1} step={step} from="left" style={{ display: "flex", alignItems: "center", padding: "8px 11px", transitionDelay: `${i * 70}ms` }}>
                  <b style={{ width: 52 }}>{size}</b>
                  <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <span aria-hidden style={{ width: 90, height: 6, borderRadius: 6, background: "#F3E3E9" }}>
                      <i style={{ display: "block", height: "100%", width: `${n * 18}%`, borderRadius: 6, background: n ? "#C42B5C" : "transparent" }} />
                    </span>
                    <span style={{ color: n ? undefined : c.muted }}>{n ? `${n} ${t.units}` : t.out}</span>
                  </span>
                  <span style={{ width: 96, textAlign: "right" }}>
                    {asked && (
                      <span aria-hidden={step >= 3 ? undefined : true} style={{ display: "inline-block", opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? "none" : "scale(0.9)", transition: "opacity 350ms, transform 350ms" }}>
                        <Chip bg="#C42B5C" fg="#fff">{t.held}</Chip>
                      </span>
                    )}
                    {n === 2 && <Chip bg="#FFF1D6" fg="#8A5A00">{t.low}</Chip>}
                  </span>
                </Step>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
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
        <b>{t.inbox}</b>
        <Step at={0} step={step} style={{ marginTop: 8, background: "#fff", border: `1px solid ${c.line}`, borderRadius: "11px 11px 11px 3px", padding: "8px 10px", lineHeight: 1.4 }}>
          {t.ask}
        </Step>
        <Step at={2} step={step} style={{ marginTop: 6, background: "#C42B5C", color: "#fff", borderRadius: "11px 11px 3px 11px", padding: "8px 10px", lineHeight: 1.4 }}>
          {t.reply}
        </Step>
        <Step at={3} step={step} style={{ marginTop: 11, border: `1px solid ${c.line}`, background: "#fff", borderRadius: 11, padding: "10px 11px", lineHeight: 1.45 }}>
          <b>{t.order}</b>
          <br />
          {t.item}
          <div style={{ marginTop: 6 }}>
            <Chip bg="#FDE8EF" fg="#C42B5C">{t.hold}</Chip>
          </div>
        </Step>
        <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {t.flow.map((name, i) => {
            const done = step >= FLOW_AT[i];
            return (
              <span key={name} style={{ display: "flex", alignItems: "center", gap: 6, color: done ? c.ink : c.muted, transition: "color 300ms" }}>
                <i aria-hidden style={{ width: 9, height: 9, borderRadius: 9, flex: "none", background: done ? "#C42B5C" : "#F1D5DF", transition: "background-color 300ms" }} />
                {name}
              </span>
            );
          })}
        </div>
        <Step at={4} step={step} style={{ color: c.muted, fontSize: 10.5, marginTop: 8 }}>
          {t.followUp}
        </Step>
      </div>
    </WindowShell>
  );
}
