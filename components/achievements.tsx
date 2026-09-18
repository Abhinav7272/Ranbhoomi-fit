import type { Achievement } from "@/lib/types";
import { Reveal } from "@/components/reveal";

export function Achievements({ items }: { items: Achievement[] }) {
  if (!items.length) return null;

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            What we <em className="font-serif font-normal italic">stand for</em>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <article>
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
