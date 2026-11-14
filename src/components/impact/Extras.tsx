import type { Dictionary } from "@/i18n/dictionaries";
import { Curtain } from "./Parallax";
import { Reveal } from "./Reveal";

/** What comes around the four products: maintenance, creative work, training. */
export function Extras({ dict }: { dict: Dictionary }) {
  const extras = dict.capabilities.items.slice(4);
  return (
    <section
      aria-labelledby="extras-heading"
      className="relative isolate overflow-x-clip bg-ink px-5 py-24 lg:px-10 lg:py-32"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Curtain
        to="right"
        colors={["var(--color-volt)", "var(--color-ink-800)"]}
      />
      <div className="mx-auto max-w-[1500px]">
        <h2
          id="extras-heading"
          className="font-mono text-[11px] tracking-[0.14em] text-volt uppercase"
        >
          {dict.ui.also}
        </h2>
        <ul className="mt-6 border-b border-dim">
          {extras.map((item, i) => (
            <li
              key={item.name}
              className="border-t border-dim transition-colors duration-300 hover:border-volt"
            >
              <Reveal
                from={i % 2 ? "right" : "left"}
                className="group grid gap-3 py-7 lg:grid-cols-[3rem_1fr_minmax(0,20rem)] lg:items-center lg:gap-9"
              >
                <span
                  aria-hidden
                  className="font-mono text-[11px] tracking-[0.14em] text-fog"
                >
                  {String(i + 5).padStart(2, "0")}
                </span>
                <h3 className="display text-[clamp(2.75rem,7.2vw,7rem)] transition-[color,translate] duration-500 ease-(--ease-signal) group-hover:text-volt motion-safe:group-hover:translate-x-6">
                  {item.name}
                </h3>
                <p className="max-w-[40ch] text-[0.9688rem] leading-relaxed text-fog">
                  {item.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
