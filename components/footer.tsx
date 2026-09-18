import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { mailHref, SITE, telHref, waHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative min-h-[172px] overflow-hidden sm:min-h-[198px]">
      <Image
        src="/images/footer-box-fan.png"
        alt="Ranbhoomi box at dusk with the drum fan, dumbbell racks and calisthenics bars"
        fill
        sizes="100vw"
        className="object-cover object-[center_45%]"
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-6">
        <div>
          <p className="font-serif text-xl italic leading-tight text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-2xl">
            Win the battle <span className="not-italic font-sans font-semibold">within</span>
          </p>
          <div className="mt-2 space-y-1 text-sm text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <a href={SITE.mapsLink} target="_blank" rel="noreferrer" className="hover:underline">
                {SITE.address}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} />
              <a href={telHref} className="hover:underline">
                {SITE.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <WhatsappLogo size={16} />
              <a href={waHref} target="_blank" rel="noreferrer" className="hover:underline">
                WhatsApp
              </a>
            </p>
            <p className="flex items-center gap-2">
              <EnvelopeSimple size={16} />
              <a href={mailHref} className="hover:underline">
                {SITE.email}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/70 text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:bg-cream hover:text-plum"
            >
              <InstagramLogo size={18} />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/70 text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:bg-cream hover:text-plum"
            >
              <FacebookLogo size={18} />
            </a>
          </div>
          <div className="flex gap-5 text-sm font-medium text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <Link href="/#timings" className="hover:underline">
              Timings
            </Link>
            <Link href="/#find-us" className="hover:underline">
              Find us
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden px-4 pb-1 text-center sm:px-6 lg:px-10">
        <p className="font-display select-none text-[6vw] font-semibold leading-none tracking-tighter text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Ranbhoomi
        </p>
      </div>
    </footer>
  );
}
