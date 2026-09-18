import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { SITE } from "@/lib/site";
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

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Dehradun`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Dehradun's only one of a kind fitness box. Not a gym. A community. CrossFit, calisthenics, gymnastics, Zumba, Hyrox, and yoga in Kirsali, Dehradun.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010"),
  openGraph: {
    title: `${SITE.name} | Dehradun`,
    description: "Dehradun's only one of a kind fitness box. Not a gym. A community. Win the battle within.",
    images: ["/images/hero-gym.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <body className="bg-plum text-cream antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
