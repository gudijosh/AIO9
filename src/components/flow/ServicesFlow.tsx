"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { AppWindow, Bot, Cable, Clapperboard, Files, Workflow } from "lucide-react";
import { industries } from "@/data/industries";
import { themeVars } from "@/data/themes";
import { ease } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { FlowNav } from "./FlowNav";
import { IndustryChapter } from "./IndustryChapter";
import { FlowContext, type Scatter } from "./parallax";
import { Tile, type TileSurface } from "./Tile";

const DESKTOP = "(min-width: 1024px)";
/** The pair of capability tiles after an industry: one solid, one tinted glass. */
const CAPABILITY_SURFACES: TileSurface[] = ["brand", "tint"];
/** One icon per capability, in the order of the dictionary. */
const CAPABILITY_ICONS = [Bot, Workflow, AppWindow, Cable, Files, Clapperboard];
/** Each capability tile flies in from a different corner. */
const CAPABILITY_FROM: Scatter[] = [
  { x: 280, y: -400, rotateY: -55, rotateZ: 14, side: -1 },
  { x: 320, y: 420, rotateY: 50, rotateZ: -12, side: 1 },
  { x: 260, y: -420, rotateX: 55, rotateZ: -14, side: 1 },
  { x: 340, y: 400, rotateX: -50, rotateZ: 12, side: -1 },
  { x: 300, y: -380, rotateY: 55, rotateZ: 10, side: -1 },
  { x: 280, y: 440, rotateY: -50, rotateZ: -14, side: 1 },
];
/** The AIO9 Signal marks: point (input), stroke (intelligence), square (action). */
const MARKS = [
  "size-[11px] rounded-full",
  "h-[11px] w-[3px] rounded-full",
  "size-[11px]",
];

/**
 * Everything AIO9 offers as one mosaic of glass tiles.
 *
 * Large screens: the section pins and vertical scrolling moves the mosaic
 * from right to left (1px of scroll = 1px of travel), with a slower backdrop.
 * Small screens: nothing pins; tiles stack and scroll vertically.
 * On both, each industry slides in with its photograph and software windows,
 * and its tiles fly in scattered from different sides and assemble into the
 * grid as it reaches the centre (see ./parallax).
 */
export function ServicesFlow({ dict }: { dict: Dictionary }) {
  const t = dict.experience;
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const centersRef = useRef<number[]>([]);
  /** distance: horizontal travel in px (0 = stacked layout). */
  const [metrics, setMetrics] = useState({ distance: 0, processTop: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const trackEl = trackRef.current;
    const wrap = wrapRef.current;
    if (!trackEl || !wrap) return;
    const measure = () => {
      const desktop = window.matchMedia(DESKTOP).matches;
      const distance = desktop
        ? Math.max(0, trackEl.offsetWidth - window.innerWidth)
        : 0;
      centersRef.current = chapterRefs.current.map((el) =>
        el ? el.offsetLeft + el.offsetWidth / 2 : 0,
      );
      const process = processRef.current;
      const processTop = !process
        ? 0
        : desktop
          ? Math.min(
              distance,
              Math.max(
                0,
                process.offsetLeft +
                  process.offsetWidth / 2 -
                  window.innerWidth / 2,
              ),
            ) + 80
          : // Layout position, not the visual one: the tile may still be flying in.
            trackEl.getBoundingClientRect().top -
            wrap.getBoundingClientRect().top +
            process.offsetTop;
      setMetrics((current) =>
        current.distance === distance &&
        Math.abs(current.processTop - processTop) < 2
          ? current
          : { distance, processTop },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(trackEl);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { distance } = metrics;
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (value) => -value * distance);
  const backdropX = useTransform(
    scrollYProgress,
    (value) => -value * distance * 0.22,
  );
  const backdropY = useTransform(scrollYProgress, (value) =>
    distance ? 0 : value * -260,
  );
  const flow = useMemo(
    () => ({ trackX: x, horizontal: distance > 0 }),
    [x, distance],
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!distance) return;
    const centre = value * distance + window.innerWidth / 2;
    const centres = centersRef.current;
    let nearest = 0;
    for (let i = 1; i < centres.length; i++) {
      if (Math.abs(centres[i] - centre) < Math.abs(centres[nearest] - centre))
        nearest = i;
    }
    // Past the last industry (capabilities, process) nothing is selected.
    const beyond =
      Math.abs(centres[nearest] - centre) > window.innerWidth * 0.75;
    setActive(beyond ? -1 : nearest);
  });

  const go = useCallback(
    (index: number) => {
      const wrap = wrapRef.current;
      const next = Math.min(industries.length - 1, Math.max(0, index));
      if (!wrap || !distance) return;
      track({ name: "industry_view", industry: industries[next].id });
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const target = Math.min(
        distance,
        Math.max(0, centersRef.current[next] - window.innerWidth / 2),
      );
      window.scrollTo({ top: top + target });
    },
    [distance],
  );

  return (
    <section
      id="industries"
      aria-labelledby="flow-heading"
      className="relative isolate overflow-x-clip"
    >
      <div
        ref={wrapRef}
        className="relative"
        style={{
          height: distance ? `calc(100svh + ${distance}px)` : undefined,
        }}
      >
        <span
          id="process"
          aria-hidden
          className="absolute left-0"
          style={{ top: metrics.processTop }}
        />

        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden">
          {/* Backdrop: colour for the glass to refract, moving slower than the tiles. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <m.div
              style={{ x: backdropX, y: backdropY }}
              className="absolute inset-y-0 left-0 w-[420vw] lg:w-[260vw]"
            >
              <span className="absolute top-[8%] left-[6%] size-[46vmax] rounded-full bg-signal/22 blur-[110px]" />
              <span className="absolute top-[45%] left-[30%] size-[38vmax] rounded-full bg-navy/20 blur-[120px]" />
              <span className="absolute top-[2%] left-[52%] size-[42vmax] rounded-full bg-signal-300/35 blur-[120px]" />
              <span className="absolute top-[40%] left-[76%] size-[40vmax] rounded-full bg-signal/18 blur-[110px]" />
            </m.div>
          </div>

          <FlowContext value={flow}>
            <m.div
              ref={trackRef}
              style={{ x }}
              className={cn(
                "relative flex flex-col gap-5 px-5 py-20",
                "lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:px-[max(2.5rem,calc((100vw-1600px)/2+2.5rem))] lg:py-0",
                "lg:[--stage-w:clamp(700px,56vw,900px)] lg:[--tile-h:min(calc(100svh-12.5rem),640px)]",
              )}
            >
              <div className="mb-6 lg:mb-0 lg:w-[min(34rem,40vw)] lg:shrink-0 lg:pr-8">
                <h2
                  id="flow-heading"
                  className="text-[clamp(2rem,4.2vw,4rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance"
                >
                  {t.heading}
                </h2>
                <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-slate-600 lg:text-lg">
                  {t.intro}
                </p>
              </div>

              {industries.map((industry, i) => (
                <Fragment key={industry.id}>
                  <IndustryChapter
                    ref={(node) => {
                      chapterRefs.current[i] = node;
                    }}
                    industry={industry}
                    count={industries.length}
                    reversed={i % 2 === 1}
                    copy={dict.industries}
                    t={t}
                  />
                  {i % 2 === 0 && (
                    <ul
                    // These two tiles follow the industry before them and take its colours.
                    style={themeVars(industry.theme)}
                    className="grid gap-5 sm:grid-cols-2 lg:h-(--tile-h) lg:w-[300px] lg:shrink-0 lg:grid-cols-1 lg:gap-6"
                  >
                      {dict.capabilities.items
                        .slice(i, i + 2)
                        .map((item, j) => (
                          <li key={item.name} className="flex">
                            <Tile
                              surface={CAPABILITY_SURFACES[j]}
                              from={CAPABILITY_FROM[i + j]}
                              className="flex min-h-44 flex-1 flex-col justify-between p-7"
                            >
                              <CapabilityIcon index={i + j} />
                              <span>
                                <span className="relative block text-[1.625rem] leading-[1.08] font-medium tracking-[-0.03em]">
                                  {item.name}
                                </span>
                                <span className="relative mt-2 block text-[14px] leading-snug opacity-90">
                                  {item.text}
                                </span>
                              </span>
                            </Tile>
                          </li>
                        ))}
                    </ul>
                  )}
                </Fragment>
              ))}

              <div className="py-6 lg:w-[26rem] lg:shrink-0 lg:px-6">
                <p className="text-[clamp(2rem,3.4vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
                  {dict.capabilities.title}
                </p>
              </div>

              <Tile
                ref={processRef}
                aria-labelledby="process-heading"
                from={{ y: 360, rotateX: -40, rotateZ: 6, side: -1 }}
                className="flex flex-col justify-between gap-10 p-7 lg:h-(--tile-h) lg:w-[min(900px,78vw)] lg:shrink-0 lg:p-12"
              >
                <div>
                  <h2
                    id="process-heading"
                    className="max-w-[14ch] text-[clamp(2rem,3.6vw,3.5rem)] leading-none font-medium tracking-[-0.04em] text-balance"
                  >
                    {dict.process.title}
                  </h2>
                  <p className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-slate-600">
                    {dict.process.subtitle}
                  </p>
                </div>
                <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-8">
                  <m.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 1.4, ease, delay: 0.4 }}
                    className="absolute top-[5px] right-[calc(33.333%-1.5rem)] left-0 hidden h-px origin-left bg-signal sm:block"
                  />
                  {dict.process.steps.map((step, i) => (
                    <li key={step.name} className="relative sm:pt-9">
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 hidden h-[11px] items-center bg-[#fbfaf7] pr-2.5 sm:flex"
                      >
                        <span className={cn("block bg-signal", MARKS[i])} />
                      </span>
                      <p className="font-mono text-[13px] text-slate-600">
                        0{i + 1}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium tracking-[-0.025em]">
                        {step.name}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </Tile>
            </m.div>
          </FlowContext>

          <FlowNav
            accent={active >= 0 ? industries[active].theme.tileInk : undefined}
            active={active} onSelect={go} copy={dict.industries} t={t} />
        </div>
      </div>
    </section>
  );
}

function CapabilityIcon({ index }: { index: number }) {
  const Icon = CAPABILITY_ICONS[index];
  return (
    <span className="relative grid size-10 place-items-center rounded-xl bg-current/10">
      <Icon aria-hidden className="size-5" />
    </span>
  );
}
