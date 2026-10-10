import { Story } from "@/components/story";
import { getSiteData } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About RFC",
  description: "Mission and goals of Ranbhoomi Fitness Club in Kirsali, Dehradun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const data = await getSiteData();

  return (
    <div className="pt-24">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Ranbhoomi Fitness Club</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">About RFC</h1>
      </section>
      <Story mission={data.mission} vision={data.vision} />
    </div>
  );
}
