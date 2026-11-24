import { WordTable } from "@/components/word-table";

const disciplines = [
  "CrossFit",
  "Hyrox",
  "Hyrox Simulation",
  "Strength & Conditioning",
  "Calisthenics",
  "Olympic Lifting",
  "Power Lifting",
  "Endurance Building",
  "Yoga",
  "Kick Boxing",
  "Parkour",
  "Gymnastics",
  "Kids Gymnastics",
  "Kids Fitness",
  "Zumba",
  "Lifts",
  "Jumps",
  "Runs",
];

export function Disciplines() {
  return (
    <section id="train" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          What we <em className="font-serif font-normal italic">train</em>
        </h2>
      </div>
      <WordTable items={disciplines} compact />
    </section>
  );
}
