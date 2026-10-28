import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Reveal } from "@/components/reveal";
import type { SiteEvent } from "@/lib/types";

export function HomeEvents({ event }: { event: SiteEvent | null }) {
  if (!event) return null;

  return (
    <section id="events" className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Events</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Coming up at RFC
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="mt-8 overflow-hidden rounded-[2rem] border border-line bg-plum-mid sm:rounded-[2.5rem]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[240px] sm:min-h-[320px]">
                {event.bannerUrl ? (
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    unoptimized={event.bannerUrl.startsWith("http")}
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-plum-soft" />
                )}
              </div>
              <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8">
                <h3 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                  {event.title}
                </h3>
                {event.slogan ? <p className="mt-2 text-sm text-cream-dim">{event.slogan}</p> : null}
                <p className="mt-4 text-sm text-cream">
                  {[event.date, event.time, event.venue].filter(Boolean).join(" · ")}
                </p>
                {event.categories.length ? (
                  <p className="mt-3 text-sm text-cream-dim">
                    {event.categories.map((item) => item.label).join(" · ")}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button href={`/events/${event.id}`}>{event.ctaLabel || "Register now"}</Button>
                  <Link href="/events" className="text-sm text-cream-dim underline">
                    All events
                  </Link>
                  <Link href="/" className="text-sm text-cream-dim underline">
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
