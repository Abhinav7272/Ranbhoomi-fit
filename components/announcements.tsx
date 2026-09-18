import type { Announcement } from "@/lib/types";
import { Reveal } from "@/components/reveal";

export function Announcements({ items }: { items: Announcement[] }) {
  if (!items.length) return null;

  return (
    <section id="announcements" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Announcements</h2>
        </Reveal>
        <div className="mt-8 max-w-3xl space-y-6">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <article className="border-l-2 border-coral pl-5">
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
