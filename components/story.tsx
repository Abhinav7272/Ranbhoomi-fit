import Image from "next/image";
import type { StoryBlock } from "@/lib/types";
import { Reveal } from "@/components/reveal";

export function Story({
  mission,
  vision,
}: {
  mission: StoryBlock;
  vision: StoryBlock;
}) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="relative mx-auto min-h-[320px] max-w-[1400px] overflow-hidden rounded-[2rem] sm:min-h-[360px] sm:rounded-[2.5rem] lg:min-h-[400px]">
        <Image
          src="/images/box-interior.png"
          alt="Inside the Ranbhoomi box"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-plum/40 mix-blend-multiply"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-plum/20" aria-hidden />
        <div className="relative grid min-h-[320px] w-full items-center gap-8 px-5 py-8 sm:min-h-[360px] sm:px-8 md:grid-cols-2 md:gap-12 lg:min-h-[400px] lg:gap-16 lg:px-12 lg:py-10">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] sm:text-2xl">
              {mission.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
              {mission.body}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-xl font-semibold tracking-tight text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] sm:text-2xl">
              {vision.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
              {vision.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
