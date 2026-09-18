import { Barbell, Confetti, PersonSimple, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

const facts = [
  {
    title: "Coached classes",
    body: "Adult batches are planned and facilitated. You show up, we run the session.",
    Icon: Barbell,
  },
  {
    title: "Mixed levels",
    body: "First day or chasing a personal best, everyone trains on the same floor.",
    Icon: UsersThree,
  },
  {
    title: "Kids gymnastics",
    body: "We make kids strong, flexible, and actually active. A coached hour that builds the foundation and points them in the right direction.",
    Icon: PersonSimple,
  },
  {
    title: "Too much fun",
    body: "Rings, sleds, lifts, and people who will remember your name next class. Hard work, not homework.",
    Icon: Confetti,
  },
];

export function Community() {
  return (
    <section id="community" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Not a gym. A <em className="font-serif font-normal italic">community</em>
          </h2>
          <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-cream-dim">
            Dehradun&apos;s only one of a kind fitness box. Not a gym. A community. Walk in, say hi, train with us.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact, i) => (
            <Reveal key={fact.title} delay={i * 0.04} className="h-full">
              <article className="flex h-full gap-4 rounded-2xl border border-cream/20 bg-cream/[0.05] p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cream/15 bg-cream/[0.06] text-coral">
                  <fact.Icon size={22} weight="regular" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight sm:text-base">{fact.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-cream-dim sm:text-sm">{fact.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
