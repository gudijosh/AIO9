"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { videos } from "@/data/videos";
import { cn } from "@/lib/cn";
import { Curtain } from "./Parallax";
import { Reveal } from "./Reveal";

/**
 * AIO9 videos in a row of vertical cards that you slide by hand: swipe,
 * scroll sideways, drag with the mouse, or use the arrows (on desktop, only
 * when the row is wider than the screen). Each card shows its poster; tapping it plays that video with sound and controls, and
 * stops any other. Nothing is downloaded until a card is played. Each
 * language shows its own videos; with none, the section is not rendered.
 */
export function VideoReel({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const list = videos[locale];
  const t = dict.videos;
  const rowRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false, overflow: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({
      start: row.scrollLeft <= 2,
      end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 2,
      overflow: row.scrollWidth > row.clientWidth + 2,
    });
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    measure();
    row.addEventListener("scroll", measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    return () => {
      row.removeEventListener("scroll", measure);
      resize.disconnect();
    };
  }, [measure]);

  if (list.length === 0) return null;
  // With a few videos, desktop puts the title beside them instead of
  // leaving a long empty row; with more, the row takes the full width.
  const compact = list.length <= 3;

  const step = (dir: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.querySelector("li");
    if (!row || !card) return;
    row.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <section
      id="videos"
      aria-labelledby="videos-heading"
      className="relative isolate overflow-x-clip bg-ink pt-20 pb-[calc(6rem+14vw)] lg:pt-28"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Curtain to="right" colors={["var(--color-azure)", "var(--color-ink-800)"]} />

      <div className={cn(compact && "lg:mx-auto lg:flex lg:max-w-[1700px] lg:items-center")}>
        <div className={cn("mx-auto flex max-w-[1700px] items-end gap-6 px-5 lg:px-10 xl:px-14", compact && "lg:mx-0 lg:flex-1 lg:pr-0")}>
          <Reveal from="left" className="flex-1">
            <h2 id="videos-heading" className="display text-[clamp(3rem,9vw,8.5rem)]">
              {t.title}
            </h2>
          </Reveal>
          <div className={cn("hidden gap-3 pb-3", edges.overflow && "lg:flex")}>
            {(
              [
                [-1, t.prev, ArrowLeft, edges.start],
                [1, t.next, ArrowRight, edges.end],
              ] as const
            ).map(([dir, label, Icon, disabled]) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-controls="videos-row"
                disabled={disabled}
                onClick={() => step(dir)}
                className="grid size-12 place-items-center rounded-full border border-bone/30 text-bone transition-colors duration-200 hover:border-volt hover:text-volt disabled:pointer-events-none disabled:opacity-30"
              >
                <Icon aria-hidden className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <Reveal from="right" delay={120} className={cn("mt-10 lg:mt-14", compact && "lg:mt-0 lg:min-w-0")}>
          <ul
            id="videos-row"
            ref={rowRef}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || !rowRef.current) return;
              drag.current = { x: event.clientX, left: rowRef.current.scrollLeft, moved: false };
            }}
            onPointerMove={(event) => {
              const d = drag.current;
              const row = rowRef.current;
              if (!d || !row) return;
              const dx = event.clientX - d.x;
              if (Math.abs(dx) > 6) d.moved = true;
              if (d.moved) row.scrollLeft = d.left - dx;
            }}
            onPointerUp={() => {
              window.setTimeout(() => (drag.current = null), 0);
            }}
            onPointerLeave={() => (drag.current = null)}
            onClickCapture={(event) => {
              if (drag.current?.moved) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 lg:scroll-px-10 lg:px-10 xl:scroll-px-14 xl:px-14"
          >
            {list.map((video) => {
              const playing = active === video.id;
              return (
                <li
                  key={video.id}
                  className={cn(
                    "w-[62vw] max-w-[22rem] shrink-0 snap-start sm:w-[40vw]",
                    compact ? "lg:w-[clamp(15rem,21vw,22rem)]" : "lg:w-[calc((100vw-10rem)/4.8)]",
                  )}
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[14px] bg-ink-800 shadow-[0_40px_80px_-30px_#000,0_0_0_1px_rgb(239_234_224/0.08)]">
                    {playing ? (
                      <video
                        key={video.src}
                        src={video.src}
                        poster={video.poster}
                        controls
                        autoPlay
                        playsInline
                        preload="none"
                        onEnded={() => setActive(null)}
                        className="absolute inset-0 size-full bg-black object-cover"
                      >
                        {video.captions && <track kind="captions" src={video.captions} srcLang={locale} label={locale.toUpperCase()} default />}
                      </video>
                    ) : (
                      <button
                        type="button"
                        aria-label={`${t.play}: ${video.title}`}
                        onClick={() => setActive(video.id)}
                        className="group absolute inset-0 block size-full"
                      >
                        <Image
                          src={video.poster}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 62vw"
                          className="object-cover transition-transform duration-700 ease-(--ease-signal) group-hover:scale-[1.04]"
                        />
                        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                        <span
                          aria-hidden
                          className="absolute top-1/2 left-1/2 grid size-16 -translate-1/2 place-items-center rounded-full bg-bone/90 text-ink transition-[transform,background-color] duration-300 group-hover:scale-110 group-hover:bg-volt"
                        >
                          <Play className="ml-1 size-6 fill-current" />
                        </span>
                      </button>
                    )}
                  </div>
                  <p className={cn("mt-4 text-[15px] leading-snug", playing ? "text-volt" : "text-bone")}>{video.title}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
