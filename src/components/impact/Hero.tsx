import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroCollage } from "./HeroCollage";

/* Fourteen 1.5px steps, down and to the right, in a darker bone. */
const EXTRUDE = Array.from({ length: 14 }, (_, i) => `${(i + 1) * 1.5}px ${(i + 1) * 1.5}px 0 #cfc6b3`).join(", ");

/**
 * Opening screen: the promise in oversized condensed type on a light ground,
 * the wordmark behind it as dotted letters with real depth, and a collage of
 * our software and a few rendered objects flying in. The first dark section
 * cuts across its bottom edge on a diagonal.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.hero;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-bone pb-[18vw] text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [perspective:1200px]">
        <div className="display absolute -top-[3vw] left-[1vw] origin-[35%_45%] text-[60vw] leading-[0.8] whitespace-nowrap select-none [transform:rotateX(20deg)_rotateY(-16deg)_rotateZ(2deg)]">
          {/* Solid letters with a stepped shadow give the volume… */}
          <span style={{ textShadow: EXTRUDE }} className="block text-bone-300">
            AIO9
          </span>
          {/* …and a dotted face on top ties them to the dotted words further down. */}
          <span className="dots absolute inset-0 block text-[#c3b9a4] [mask-size:10px_10px]">AIO9</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1700px] px-5 pt-24 lg:px-10 lg:pt-[7.5rem] xl:px-14">
        <h1 aria-label={t.title} className="display relative z-10 text-[clamp(2.75rem,12.6vw,13rem)]">
          {t.lines.map((line, i) => (
            <span key={line} aria-hidden className={i === t.lines.length - 1 ? "block text-azure" : "block"}>
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-6 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-end">
          <div className="relative z-10 lg:pb-[6vw]">
            <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed">{t.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="pill bg-ink text-bone">
                {t.primary} <span aria-hidden>→</span>
              </a>
              <a href="#industries" className="pill border border-ink/30 text-ink">
                {t.secondary}
              </a>
            </div>
          </div>
          <div className="lg:-mt-[3vw] lg:ml-auto lg:w-[min(54vw,860px)]">
            <HeroCollage locale={locale} simulation={dict.experience.simulation} />
          </div>
        </div>
      </div>
    </section>
  );
}
