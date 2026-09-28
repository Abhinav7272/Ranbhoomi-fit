import { SITE, siteUrl } from "@/lib/site";

const data = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: SITE.name,
  description:
    "CrossFit, Hyrox, calisthenics, gymnastics, Zumba, and yoga in Kirsali, Dehradun.",
  url: siteUrl(),
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
  knowsAbout: ["CrossFit", "Hyrox", "gym training", "calisthenics", "gymnastics", "Zumba", "yoga"],
};

export function LocalBusiness() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
