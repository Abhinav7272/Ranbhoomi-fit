import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { WordTable } from "@/components/word-table";
import { SEO_ABOUT_COPY, SEO_ONPAGE_PHRASES } from "@/lib/seo";

export function SeoLocal() {
  return (
    <section id="dehradun-gym" className="scroll-mt-20" aria-labelledby="seo-local-heading">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Ranbhoomi · Kirsali</p>
          <h2
            id="seo-local-heading"
            className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Best gym & fitness club in <em className="font-serif font-normal italic">Dehradun</em>
          </h2>
          <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-cream-dim">{SEO_ABOUT_COPY}</p>
          <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-cream-dim">
            Search Google for Hyrox in Dehradun, CrossFit in Dehradun, kids fitness classes in
            Dehradun, or best fitness centre near me — Ranbhoomi Fitness Club (RFC) is the coached
            box on Sahastradhara Road for adults and kids who want real training and a healthy
            community. See our{" "}
            <Link href="/dehradun" className="text-cream underline underline-offset-4 hover:text-coral">
              top 500 Dehradun fitness searches
            </Link>
            .
          </p>
        </Reveal>
      </div>
      <WordTable items={[...SEO_ONPAGE_PHRASES]} compact />
    </section>
  );
}
