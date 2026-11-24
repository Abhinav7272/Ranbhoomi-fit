import { SEO_DESCRIPTION, SEO_KNOWS_ABOUT } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

const data = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: SITE.name,
  alternateName: ["RFC", "Ranbhoomi", "Best gym in Dehradun"],
  description: SEO_DESCRIPTION,
  url: `${siteUrl()}/`,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${siteUrl()}/images/hero-ranbhoomi-cartoon-wide.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Usha Colony, Sahastradhara Road, Above SBI Bank, Kulhan, Kirsali",
    addressLocality: "Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "248001",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "City",
    name: "Dehradun",
  },
  sameAs: [SITE.instagram, SITE.facebook],
  knowsAbout: [...SEO_KNOWS_ABOUT],
  makesOffer: SEO_KNOWS_ABOUT.filter((k) => !k.toLowerCase().startsWith("best")).map((name) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name,
      areaServed: "Dehradun",
      provider: { "@type": "HealthClub", name: SITE.name },
    },
  })),
};

export function LocalBusiness() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
