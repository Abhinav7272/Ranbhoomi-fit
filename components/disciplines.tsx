import { WordTable } from "@/components/word-table";

const disciplines = [
  "CrossFit",
  "Calisthenics",
  "Gymnastics",
  "Zumba",
  "Hyrox",
  "Yoga",
  "Lifts",
  "Jumps",
  "Runs",
  "Rings",
  "Sled",
  "Kids Gymnastics",
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
