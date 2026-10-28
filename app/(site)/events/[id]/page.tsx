import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventRegisterForm } from "@/components/event-register-form";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSiteData();
  const event = data.events.find((item) => item.id === id && item.published);
  if (!event) return { title: "Event" };
  return {
    title: event.title,
    description: event.slogan || `${event.title} at Ranbhoomi Fitness Club.`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getSiteData();
  const event = data.events.find((item) => item.id === id && item.published);
  if (!event) notFound();

  return (
    <div className="pb-16 pt-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Link href="/events" className="text-sm text-cream-dim underline">
          All events
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-cream sm:text-5xl">
          {event.title}
        </h1>
        {event.slogan ? <p className="mt-3 max-w-[48ch] text-cream-dim">{event.slogan}</p> : null}
        <p className="mt-4 text-sm text-cream">
          {[event.date, event.time, event.venue].filter(Boolean).join(" · ")}
        </p>
      </div>

      {event.bannerUrl ? (
        <div className="relative mx-auto mt-8 h-[240px] max-w-[1400px] overflow-hidden sm:h-[360px] lg:h-[420px] lg:rounded-[2rem] lg:px-10">
          <div className="relative h-full w-full overflow-hidden lg:rounded-[2rem]">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              priority
              sizes="100vw"
              unoptimized={event.bannerUrl.startsWith("http")}
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto mt-10 grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          {event.categories.length ? (
            <section>
              <h2 className="text-xl font-semibold text-cream">Categories</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {event.categories.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-full border border-cream/20 px-4 py-2 text-sm text-cream"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {event.perks.length ? (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-cream">What&apos;s waiting for you</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {event.perks.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-line px-4 py-3 text-sm text-cream">
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {event.merchNote ? (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-cream">Merch</h2>
              <p className="mt-3 text-sm text-cream-dim">{event.merchNote}</p>
            </section>
          ) : null}
        </div>

        <section className="rounded-[2rem] border border-line bg-plum-mid p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-cream">Register</h2>
          <p className="mt-2 text-sm text-cream-dim">
            Fill this in and the RFC team gets the registration by email.
          </p>
          <EventRegisterForm event={event} />
        </section>
      </div>
    </div>
  );
}
