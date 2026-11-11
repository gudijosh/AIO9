"use client";

import { Send } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle } from "./primitives/Show";

type Copy = Dictionary["industries"]["hospitality"]["demo"];

interface Table {
  n: number;
  seats: number;
  taken: boolean;
  shape: "round" | "rect";
  x: number;
  y: number;
  w?: number;
  h?: number;
}

/** Simplified floor plan (illustrative). Table 7 is the one that gets assigned. */
const TABLES: Table[] = [
  { n: 1, seats: 2, taken: true, shape: "round", x: 38, y: 36 },
  { n: 2, seats: 2, taken: false, shape: "round", x: 90, y: 36 },
  { n: 3, seats: 4, taken: true, shape: "rect", x: 126, y: 20, w: 46, h: 32 },
  { n: 4, seats: 4, taken: false, shape: "rect", x: 192, y: 20, w: 46, h: 32 },
  { n: 5, seats: 2, taken: true, shape: "round", x: 268, y: 36 },
  { n: 6, seats: 6, taken: true, shape: "rect", x: 22, y: 86, w: 72, h: 34 },
  { n: 7, seats: 4, taken: false, shape: "rect", x: 122, y: 87, w: 50, h: 32 },
  { n: 8, seats: 4, taken: true, shape: "rect", x: 192, y: 87, w: 46, h: 32 },
  { n: 9, seats: 2, taken: false, shape: "round", x: 268, y: 103 },
];
const PARTY = 4;
const ASSIGNED = 7;

function TableShape({ table, step }: { table: Table; step: number }) {
  const fits = !table.taken && table.seats >= PARTY && step >= 2;
  const assigned = table.n === ASSIGNED && step >= 3;
  const fill = assigned ? "var(--color-signal)" : table.taken ? "rgb(255 255 255 / 0.2)" : "transparent";
  const stroke = assigned
    ? "var(--color-signal)"
    : fits
      ? "var(--color-signal-300)"
      : table.taken
        ? "transparent"
        : "rgb(255 255 255 / 0.4)";
  const common = {
    fill,
    stroke,
    strokeWidth: fits || assigned ? 1.75 : 1,
    style: { transition: "fill 300ms, stroke 300ms" },
  };
  const cx = table.shape === "round" ? table.x : table.x + (table.w ?? 0) / 2;
  const cy = table.shape === "round" ? table.y : table.y + (table.h ?? 0) / 2;
  return (
    <g>
      {table.shape === "round" ? (
        <circle cx={table.x} cy={table.y} r={15} {...common} />
      ) : (
        <rect x={table.x} y={table.y} width={table.w} height={table.h} rx={7} {...common} />
      )}
      <text
        x={cx}
        y={cy + 3.5}
        textAnchor="middle"
        fontSize={10}
        fontWeight={assigned ? 600 : 400}
        fill={assigned ? "#fff" : "rgb(255 255 255 / 0.65)"}
      >
        {table.n}
      </text>
    </g>
  );
}

/** Request → floor plan and capacity → table assigned → confirmation. */
export function HospitalityDemo({ step, t }: { step: number; t: Copy }) {
  return (
    <DemoFrame>
      <Connector when={step >= 2} d="M 15 22 C 50 22, 50 74, 85 74" />
      <Connector when={step >= 4} axis="-x" d="M 80 86 L 18 86" />

      <Panel when={step >= 0} className="lg:absolute lg:top-6 lg:left-6 lg:w-[280px]">
        <div className="flex flex-col gap-2.5">
          <Bubble when={step >= 0} from="them" who={t.guest}>
            {t.ask}
          </Bubble>
          <Bubble when={step >= 1} from="ai" who={t.assistant}>
            {step >= 3 ? t.offer : t.checking}
          </Bubble>
        </div>
      </Panel>

      <Panel when={step >= 2} className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[330px]">
        <div className="flex h-4 items-center justify-between">
          <PanelTitle>{t.floor}</PanelTitle>
          {step === 2 && <Working className="text-signal-300" />}
        </div>
        <svg viewBox="0 0 300 140" className="mt-2 w-full" aria-hidden>
          {TABLES.map((table) => (
            <TableShape key={table.n} table={table} step={step} />
          ))}
        </svg>
        <ul className="mt-1 flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-white/70">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-white/25" />
            {t.taken}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] border-[1.5px] border-signal-300" />
            {t.fits}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-signal" />
            {t.assigned}
          </li>
        </ul>
      </Panel>

      <Panel
        tone="light"
        when={step >= 4}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[230px]"
      >
        <p className="text-[13px] font-semibold">{t.ticket}</p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-y border-dashed border-midnight/20 py-2.5 text-[12px]">
          <dt className="font-mono text-[15px] font-semibold text-signal">7</dt>
          <dd className="self-center font-medium">{t.table}</dd>
          <dt className="col-span-2 text-slate-600">
            {t.when} · {t.party}
          </dt>
        </dl>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-slate-600">
          <Send aria-hidden className="size-3.5" />
          {t.sent}
        </p>
      </Panel>
    </DemoFrame>
  );
}
