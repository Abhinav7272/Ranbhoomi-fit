import { Announcements } from "@/components/announcements";
import { Community } from "@/components/community";
import { Coaches } from "@/components/coaches";
import { Disciplines } from "@/components/disciplines";
import { FindUs } from "@/components/find-us";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Highlights } from "@/components/highlights";
import { HomeTimings } from "@/components/home-timings";
import { Story } from "@/components/story";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getSiteData();

  return (
    <>
      <Hero />
      <Community />
      <Disciplines />
      <HomeTimings groups={data.classes} />
      <Announcements items={data.announcements} />
      <Story mission={data.mission} vision={data.vision} />
      <Gallery items={data.gallery} lightboxItems={data.gallery} />
      <Highlights items={data.highlights} lightboxItems={data.highlights} />
      <Coaches items={data.coaches} />
      <FindUs />
    </>
  );
}
