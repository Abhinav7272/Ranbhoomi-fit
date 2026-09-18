import Image from "next/image";
import type { ClassGroup } from "@/lib/types";
import { Reveal } from "@/components/reveal";
import { Schedule } from "@/components/schedule";

export function HomeTimings({ groups }: { groups: ClassGroup[] }) {
  return (
    <section id="timings" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-cream/15 bg-plum/30 p-1.5 sm:rounded-[2.25rem]">
            <div className="absolute inset-0">
              <Image
                src="/images/hero-ranbhoomi-cartoon-dark.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-plum/30"
              aria-hidden
            />

            <div className="relative rounded-[calc(2rem-0.375rem)] px-4 py-4 sm:rounded-[calc(2.25rem-0.375rem)] sm:px-6 sm:py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] sm:text-2xl">
                      Class <em className="font-serif font-normal italic">timings</em>
                    </h2>
                    <p className="mt-1 max-w-[52ch] text-sm text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                      Every session is planned and facilitated by our coaches.
                    </p>
                  </div>
                  {groups.some((group) => group.slots.length > 0) ? (
                    <p className="text-xs text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:text-sm">
                      {groups.some((group) => group.slots.some((slot) => slot.kind === "morning")) ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-coral" />
                          Morning
                        </span>
                      ) : null}
                      {groups.some((group) => group.slots.some((slot) => slot.kind === "evening")) ? (
                        <span className="ml-4 inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cream/80" />
                          Evening
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4">
                  <Schedule groups={groups} />
                </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
