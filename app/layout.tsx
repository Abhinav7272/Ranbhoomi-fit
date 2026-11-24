import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-jaune",
  display: "swap",
  axes: ["opsz"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const title = SEO_TITLE;
const description = SEO_DESCRIPTION;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  keywords: SEO_KEYWORDS,
  metadataBase: new URL(siteUrl()),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title,
    description,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
    images: ["/images/hero-ranbhoomi-cartoon-wide.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-rfc-path") || "/";
  const canonical = path === "/" ? `${siteUrl()}/` : `${siteUrl()}${path}`;

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <head>
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="bg-plum text-cream antialiased">
        <Script id="start-at-top" strategy="beforeInteractive">
          {`(function () {
            try {
              var nav = performance.getEntriesByType("navigation")[0];
              var reload = !nav || nav.type === "reload";
              if (history.scrollRestoration) history.scrollRestoration = "manual";
              if (!reload) return;
              if (location.hash) history.replaceState(null, "", location.pathname + location.search);
              window.scrollTo(0, 0);
              window.addEventListener("load", function () { window.scrollTo(0, 0); });
            } catch (e) {}
          })();`}
        </Script>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
