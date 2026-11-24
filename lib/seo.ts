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

/** Meta keywords: base terms + full Dehradun search list. */
export const SEO_KEYWORDS = Array.from(
  new Set<string>([...SEO_KEYWORDS_BASE, ...SEO_KEYWORDS_BASE.map((k) => `${k} in Dehradun`), ...DEHRADUN_TOP_SEARCHES]),
);

export const SEO_TITLE = "Best Gym, CrossFit & Hyrox in Dehradun | Ranbhoomi Fitness Club";

export const SEO_DESCRIPTION =
  "Best gym and fitness centre near you in Kirsali, Dehradun. CrossFit, Hyrox simulation & workouts, strength and conditioning, calisthenics, Olympic & power lifting, yoga, kick boxing, parkour, gymnastics, kids fitness classes, and a healthy fitness community. Endurance building at Ranbhoomi Fitness Club.";

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
