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
import type { GalleryImage } from "@/lib/types";

export const dynamic = "force-dynamic";

function uniquePhotos(...groups: GalleryImage[][]) {
  const seen = new Set<string>();
  const out: GalleryImage[] = [];
  for (const group of groups) {
    for (const item of group) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      out.push(item);
    }
  }
  return out;
}

export default async function HomePage() {
  const data = await getSiteData();
  const lightboxItems = uniquePhotos(data.highlights, data.gallery);

  return (
    <>
      <Hero />
      <Community />
      <Disciplines />
      <HomeTimings groups={data.classes} />
      <Announcements items={data.announcements} />
      <Story mission={data.mission} vision={data.vision} />
      <Gallery items={data.gallery} lightboxItems={lightboxItems} />
      <Highlights items={data.highlights} lightboxItems={lightboxItems} />
      <Coaches items={data.coaches} />
      <FindUs />
    </>
  );
}
