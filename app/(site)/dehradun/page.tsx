import type { Metadata } from "next";
import Link from "next/link";
import { SEO_ABOUT_COPY, SEO_DESCRIPTION } from "@/lib/seo";
import { DEHRADUN_TOP_SEARCHES } from "@/lib/seo-dehradun-searches";

export const metadata: Metadata = {
  title: "Top Gym & Fitness Searches in Dehradun",
  description: SEO_DESCRIPTION,
  keywords: [...DEHRADUN_TOP_SEARCHES],
};

export default function DehradunSearchesPage() {
  return (
    <div className="pt-24">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-cream/70">Local SEO · Dehradun</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
          Top 500 fitness searches in <em className="font-serif font-normal italic">Dehradun</em>
        </h1>
        <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-cream-dim">{SEO_ABOUT_COPY}</p>
        <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-cream-dim">
          Ranbhoomi Fitness Club (RFC) in Kirsali ranks for gym, CrossFit, Hyrox, kids fitness, and
          strength searches across Dehradun. Browse the phrases people use below, then{" "}
          <Link href="/#join" className="text-cream underline underline-offset-4 hover:text-coral">
            book your first class
          </Link>{" "}
          or{" "}
          <Link href="/#find-us" className="text-cream underline underline-offset-4 hover:text-coral">
            find us
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-10" aria-label="Dehradun search phrases">
        <ol className="columns-1 gap-x-10 text-sm text-cream-dim sm:columns-2 lg:columns-3">
          {DEHRADUN_TOP_SEARCHES.map((phrase, i) => (
            <li key={phrase} className="mb-2 break-inside-avoid">
              <span className="mr-2 tabular-nums text-cream/40">{i + 1}.</span>
              {phrase}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
