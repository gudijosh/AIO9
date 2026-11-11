import type { Dictionary } from "@/i18n/dictionaries";

/** Six capabilities as a typographic list. Deliberately compact. */
export function Capabilities({ t }: { t: Dictionary["capabilities"] }) {
  return (
    <section aria-labelledby="capabilities-heading" className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-36">
        <h2
          id="capabilities-heading"
          className="max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-tight font-medium tracking-[-0.02em] text-white/70"
        >
          {t.title}
        </h2>
        <ul className="mt-10 border-b border-white/10 lg:mt-14">
          {t.items.map((item) => (
            <li
              key={item.name}
              className="group relative grid items-baseline gap-x-10 gap-y-1.5 border-t border-white/10 py-5 lg:grid-cols-[1fr_auto] lg:py-6"
            >
              <span
                aria-hidden
                className="absolute top-1/2 left-0 hidden size-3 -translate-y-1/2 scale-0 bg-signal transition-transform duration-300 ease-signal group-hover:scale-100 lg:block"
              />
              <span className="text-[clamp(1.75rem,4.6vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-white/90 transition-[color,translate] duration-300 ease-signal group-hover:text-white lg:group-hover:translate-x-8">
                {item.name}
              </span>
              <span className="text-[15px] text-slate transition-colors duration-300 group-hover:text-white/80 lg:text-right">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
