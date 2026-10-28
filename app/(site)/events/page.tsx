import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteData, publishedEvents } from "@/lib/store";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming races and community events at Ranbhoomi Fitness Club in Dehradun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  const data = await getSiteData();
  const events = publishedEvents(data.events);

  return (
    <div className="px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Ranbhoomi Fitness Club</p>
          <Link href="/" className="text-sm text-cream-dim underline">
            Home
          </Link>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">Events</h1>
        <p className="mt-3 max-w-[54ch] text-sm text-cream-dim">
          Race days, open events, and community days at the box. Open an event to see the banner and
          register.
        </p>

        {events.length === 0 ? (
          <p className="mt-10 text-sm text-cream-dim">No published events right now.</p>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-line bg-plum-mid transition hover:border-cream/30"
                >
                  <div className="relative h-48">
                    {event.bannerUrl ? (
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        unoptimized={event.bannerUrl.startsWith("http")}
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-plum-soft" />
                    )}
                  </div>
                  <div className="px-5 py-5">
                    <h2 className="text-xl font-semibold tracking-tight text-cream">{event.title}</h2>
                    <p className="mt-2 text-sm text-cream-dim">
                      {[event.date, event.time, event.venue].filter(Boolean).join(" · ")}
                    </p>
                    {event.slogan ? <p className="mt-2 text-sm text-cream/80">{event.slogan}</p> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
