"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import board from "../../../public/images/hero/board.webp";
import bubble from "../../../public/images/hero/bubble.webp";
import phone from "../../../public/images/hero/phone.webp";
import ribbon from "../../../public/images/hero/ribbon.webp";
import { useMotionReady } from "./Parallax";
import { Fit } from "./scroll/Fit";
import { AgroWindow } from "./windows/AgroWindow";
import { OperationsWindow } from "./windows/OperationsWindow";
import { RetailWindow } from "./windows/RetailWindow";

/**
 * One floating piece of the hero. It flies in from its own direction once
 * the opening curtain lifts, drifts gently, and on scroll rises at its own
 * speed (`depth`), so near pieces overtake far ones.
 */
function Piece({
  children,
  className,
  from,
  delay,
  drift,
  depth,
  spin = 0,
  tilt,
}: {
  children: ReactNode;
  className: string;
  /** Where it comes from: x, y and starting rotation. */
  from: [string, string, string];
  /** Seconds after load. */
  delay: number;
  /** Seconds per drift cycle. */
  drift: number;
  /** Pixels it travels up over the first screen of scrolling. */
  depth: number;
  /** Degrees it turns over the same distance. */
  spin?: number;
  /** Resting 3D pose. */
  tilt?: string;
}) {
  const ready = useMotionReady();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, -depth]);
  const rotate = useTransform(scrollY, [0, 900], [0, spin]);
  return (
    <div
      style={{ "--fx": from[0], "--fy": from[1], "--fr": from[2], animationDelay: `${delay}s` } as CSSProperties}
      className={cn("absolute animate-[hero-in_1.1s_var(--ease-signal)_both]", className)}
    >
      <m.div style={ready ? { y, rotate } : undefined}>
        <div style={{ animationDuration: `${drift}s` }} className="motion-safe:animate-[hero-float_ease-in-out_infinite_alternate]">
          <div style={tilt ? { transform: tilt } : undefined}>{children}</div>
        </div>
      </m.div>
    </div>
  );
}

function Shot({ src, sizes }: { src: StaticImageData; sizes: string }) {
  return <Image src={src} alt="" sizes={sizes} className="h-auto w-full drop-shadow-[0_30px_30px_rgba(10,10,18,0.35)]" />;
}

/**
 * The picture of the hero: three of our own product windows floating in 3D
 * among a few rendered objects. The whole group leans towards the cursor.
 * Decorative; every window appears again, live and labelled, further down.
 */
export function HeroCollage({ locale, simulation }: { locale: Locale; simulation: string }) {
  const ready = useMotionReady();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-9, 9]), { stiffness: 80, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [7, -7]), { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (!ready || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth) * 2 - 1);
      py.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready, px, py]);

  const frame = "overflow-hidden rounded-[10px] shadow-[0_50px_80px_-24px_rgba(10,10,18,0.6)] lg:rounded-[14px]";
  const win = { locale, simulation } as const;
  return (
    <div aria-hidden className="[perspective:1600px]">
      <m.div style={ready ? { rotateX, rotateY } : undefined} className="relative aspect-[10/8] w-full [transform-style:preserve-3d]">
        <Piece className="top-[2%] left-0 w-[60%]" from={["-30vw", "-10vh", "-14deg"]} delay={1.05} drift={6.5} depth={120} tilt="rotateY(18deg) rotateX(6deg) rotateZ(-4deg)">
          <Fit className={frame}>
            <OperationsWindow step={5} {...win} />
          </Fit>
        </Piece>
        <Piece className="top-[26%] right-0 w-[58%]" from={["34vw", "0", "12deg"]} delay={1.2} drift={7.5} depth={260} tilt="rotateY(-16deg) rotateX(5deg) rotateZ(3deg)">
          <Fit className={frame}>
            <RetailWindow step={4} {...win} />
          </Fit>
        </Piece>
        <Piece className="top-[54%] left-[9%] w-[54%]" from={["-12vw", "40vh", "8deg"]} delay={1.35} drift={5.8} depth={400} tilt="rotateY(10deg) rotateX(8deg) rotateZ(-2deg)">
          <Fit className={frame}>
            <AgroWindow step={4} {...win} />
          </Fit>
        </Piece>
        <Piece className="-top-[6%] right-[4%] w-[30%]" from={["20vw", "-30vh", "60deg"]} delay={1.45} drift={5} depth={520} spin={70}>
          <Shot src={ribbon} sizes="(min-width: 1024px) 17vw, 30vw" />
        </Piece>
        <Piece className="right-[2%] bottom-[0%] w-[32%]" from={["24vw", "30vh", "-40deg"]} delay={1.55} drift={6.2} depth={620} spin={-28}>
          <Shot src={board} sizes="(min-width: 1024px) 18vw, 32vw" />
        </Piece>
        <Piece className="top-[30%] -left-[5%] w-[15%]" from={["-24vw", "10vh", "-50deg"]} delay={1.65} drift={5.4} depth={700} spin={35}>
          <Shot src={phone} sizes="(min-width: 1024px) 9vw, 15vw" />
        </Piece>
        <Piece className="top-[41%] left-[50%] w-[13%]" from={["0", "-50vh", "80deg"]} delay={1.8} drift={4.6} depth={860} spin={-60}>
          <Shot src={bubble} sizes="(min-width: 1024px) 8vw, 13vw" />
        </Piece>
      </m.div>
    </div>
  );
}
