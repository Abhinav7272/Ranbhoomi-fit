import Image from "next/image";
import type { Coach } from "@/lib/types";

export function Coaches({ items }: { items: Coach[] }) {
  if (!items.length) return null;

  return (
    <section id="coaches" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-0 sm:px-6 lg:px-10 lg:pt-8">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          The <em className="font-serif font-normal italic">coaches</em>
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-8">
          {items.map((coach) => (
            <article key={coach.id} className="flex w-36 flex-col items-center text-center sm:w-40">
              <div className="relative h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32">
                <Image
                  src={coach.photoUrl}
                  alt={coach.name}
                  fill
                  sizes="128px"
                  unoptimized={coach.photoUrl.startsWith("http")}
                  className="object-cover object-top"
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold tracking-tight">{coach.name}</h3>
              <p className="mt-1 text-sm leading-snug text-cream-dim">{coach.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
