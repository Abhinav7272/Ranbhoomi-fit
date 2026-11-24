import type { Metadata } from "next";
import Link from "next/link";
import { SEO_DESCRIPTION } from "@/lib/seo";
import { DEHRADUN_KEYWORD_SECTIONS, DEHRADUN_TOP_SEARCHES } from "@/lib/seo-dehradun-searches";

export const metadata: Metadata = {
  title: "Fitness in Dehradun — Gym, CrossFit, Hyrox & Kids Fitness",
  description: SEO_DESCRIPTION,
  keywords: [...DEHRADUN_TOP_SEARCHES],
};

export default function DehradunPage() {
  const count = DEHRADUN_TOP_SEARCHES.length;

  return (
    <div className="pt-24">
      <article className="mx-auto max-w-[900px] px-4 pb-20 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-sm text-cream/55">
          <Link href="/" className="hover:text-cream">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-cream/80">Dehradun</span>
        </nav>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-coral">Dehradun</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-cream sm:text-5xl">
          Fitness in Dehradun
        </h1>
        <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-cream-dim sm:text-base">
          Find Hyrox, CrossFit, gyms, yoga, calisthenics, kids fitness, and coaches in Dehradun with
          Ranbhoomi Fitness Club (RFC) in Kirsali. These local searches live on this page so people
          looking for training nearby can find our coached fitness community on Sahastradhara Road.
        </p>
        <p className="mt-3 text-xs text-cream/45">{count.toLocaleString()} local search phrases</p>

        <div className="mt-14 space-y-14">
          {DEHRADUN_KEYWORD_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`dehradun-${section.id}`}>
              <h2
                id={`dehradun-${section.id}`}
                className="text-xl font-semibold tracking-tight text-cream sm:text-2xl"
              >
                {section.title}
              </h2>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-cream-dim">{section.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {section.keywords.map((keyword) => (
                  <li key={keyword}>
                    <span className="inline-block rounded-full border border-cream/20 bg-cream/[0.04] px-3 py-1.5 text-xs text-cream/85 sm:text-sm">
                      {keyword}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-16 max-w-[62ch] text-sm leading-relaxed text-cream-dim">
          Ready to train?{" "}
          <Link href="/#join" className="text-cream underline underline-offset-4 hover:text-coral">
            Book your first class free
          </Link>{" "}
          or{" "}
          <Link href="/#find-us" className="text-cream underline underline-offset-4 hover:text-coral">
            find us in Kirsali, Dehradun
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
