import { Announcements } from "@/components/announcements";
import { Community } from "@/components/community";
import { Coaches } from "@/components/coaches";
import { Disciplines } from "@/components/disciplines";
import { FindUs } from "@/components/find-us";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Highlights } from "@/components/highlights";
import { HomeEvents } from "@/components/home-events";
import { HomeTimings } from "@/components/home-timings";
import { Story } from "@/components/story";
import { featuredEvent, getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getSiteData();

  return (
    <>
      <Hero />
      <HomeEvents event={featuredEvent(data.events)} />
      <Gallery items={data.gallery} lightboxItems={data.gallery} />
      <Community />
      <Disciplines />
      <HomeTimings groups={data.classes} />
      <Highlights items={data.highlights} lightboxItems={data.highlights} />
      <Announcements items={data.announcements} />
      <Story mission={data.mission} vision={data.vision} />
      <Coaches items={data.coaches} />
      <FindUs classes={data.classes} />
    </>
  );
}
