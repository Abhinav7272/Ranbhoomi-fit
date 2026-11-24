import { SeoLocal } from "@/components/seo-local";
import { Story } from "@/components/story";
import { getSiteData } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About RFC — Best Gym in Dehradun",
  description:
    "About Ranbhoomi Fitness Club — best gym and fitness centre in Dehradun for CrossFit, Hyrox, calisthenics, lifting, yoga, gymnastics, and kids fitness classes in Kirsali.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const data = await getSiteData();

  return (
    <div className="pt-24">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Ranbhoomi Fitness Club</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
          About RFC — best gym in Dehradun
        </h1>
      </section>
      <Story mission={data.mission} vision={data.vision} />
      <SeoLocal />
    </div>
  );
}
