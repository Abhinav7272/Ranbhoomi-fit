import { DEHRADUN_TOP_SEARCHES } from "@/lib/seo-dehradun-searches";

/** Base service / intent keywords for Ranbhoomi Fitness Club. */
export const SEO_KEYWORDS_BASE = [
  "Hyrox",
  "Hyrox simulation",
  "Hyrox workout",
  "CrossFit",
  "Strength and conditioning",
  "Best gym",
  "Best gym near me",
  "Best fitness centre",
  "Best fitness centre near me",
  "Best fitness club near me",
  "Yoga",
  "Kick boxing",
  "Calisthenics",
  "Gym",
  "Fitness community",
  "Healthy community",
  "Gymnastics",
  "Kids gymnastics",
  "Kids fitness centre",
  "Kids fitness classes",
  "Kids fitness club",
  "Parkour",
  "Olympic lifting",
  "Power lifting",
  "Lifting club",
  "Endurance building",
] as const;

/** Meta keywords: base terms + full Dehradun top-500 list. */
export const SEO_KEYWORDS = Array.from(
  new Set<string>([...SEO_KEYWORDS_BASE, ...SEO_KEYWORDS_BASE.map((k) => `${k} in Dehradun`), ...DEHRADUN_TOP_SEARCHES]),
);

export const SEO_TITLE = "Best Gym, CrossFit & Hyrox in Dehradun | Ranbhoomi Fitness Club";

export const SEO_DESCRIPTION =
  "Best gym and fitness centre near you in Kirsali, Dehradun. CrossFit, Hyrox simulation & workouts, strength and conditioning, calisthenics, Olympic & power lifting, yoga, kick boxing, parkour, gymnastics, kids fitness classes, and a healthy fitness community. Endurance building at Ranbhoomi Fitness Club.";

/** ~100-word on-page copy for local SEO (home community section). */
export const SEO_ABOUT_COPY =
  "Looking for the best gym near me or the best fitness centre near me in Dehradun? Ranbhoomi Fitness Club in Kirsali is a coached fitness community built for CrossFit, Hyrox, Hyrox simulation, and Hyrox workouts, plus strength and conditioning, calisthenics, Olympic lifting, power lifting, and endurance building. Train yoga, kick boxing, parkour, and gymnastics on the same floor, or bring your child for kids gymnastics, kids fitness classes, and a kids fitness club that keeps them strong and active. Whether you want a lifting club, a healthy community, or the best fitness club near me in Dehradun, walk in, say hi, and book your first class.";

/** Visible on-page phrases Google can index (services + Dehradun). */
export const SEO_ONPAGE_PHRASES = [
  "Hyrox in Dehradun",
  "Hyrox simulation in Dehradun",
  "Hyrox workout in Dehradun",
  "CrossFit in Dehradun",
  "Strength and conditioning in Dehradun",
  "Best gym in Dehradun",
  "Best gym near me",
  "Best fitness centre in Dehradun",
  "Best fitness centre near me",
  "Best fitness club near me",
  "Yoga in Dehradun",
  "Kick boxing in Dehradun",
  "Calisthenics in Dehradun",
  "Gym in Dehradun",
  "Fitness community in Dehradun",
  "Healthy community in Dehradun",
  "Gymnastics in Dehradun",
  "Kids gymnastics in Dehradun",
  "Kids fitness centre in Dehradun",
  "Kids fitness classes in Dehradun",
  "Kids fitness club in Dehradun",
  "Parkour in Dehradun",
  "Olympic lifting in Dehradun",
  "Power lifting in Dehradun",
  "Lifting club in Dehradun",
  "Endurance building in Dehradun",
] as const;

/** Offerings for schema.org knowsAbout (services, not ranking phrases). */
export const SEO_KNOWS_ABOUT = [
  "Hyrox",
  "Hyrox simulation",
  "Hyrox workout",
  "CrossFit",
  "Strength and conditioning",
  "Yoga",
  "Kick boxing",
  "Calisthenics",
  "Gym",
  "Fitness community",
  "Gymnastics",
  "Kids gymnastics",
  "Kids fitness classes",
  "Parkour",
  "Olympic lifting",
  "Power lifting",
  "Lifting club",
  "Endurance building",
  "Best gym in Dehradun",
  "Best fitness centre in Dehradun",
  "Best fitness club in Dehradun",
] as const;
