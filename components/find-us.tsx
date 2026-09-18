import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/button";
import { JoinForm } from "@/components/join-form";
import { mailHref, SITE, telHref, waHref } from "@/lib/site";
import type { ClassGroup } from "@/lib/types";

export function FindUs({ classes }: { classes: ClassGroup[] }) {
  return (
    <section id="find-us" className="scroll-mt-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-8 pb-12 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10 lg:px-10 lg:pt-8 lg:pb-16">
        <div id="contact" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Find <em className="font-serif font-normal italic">us</em>
          </h2>
          <ul className="mt-6 space-y-4 text-sm text-cream-dim">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-coral" />
              <a href={SITE.mapsLink} target="_blank" rel="noreferrer" className="hover:text-cream">
                {SITE.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone size={20} className="text-coral" />
              <a href={telHref} className="hover:text-cream">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <WhatsappLogo size={20} className="text-coral" />
              <a href={waHref} target="_blank" rel="noreferrer" className="hover:text-cream">
                WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <EnvelopeSimple size={20} className="text-coral" />
              <a href={mailHref} className="hover:text-cream">
                {SITE.email}
              </a>
            </li>
          </ul>

          <h3 className="mt-8 text-base font-semibold tracking-tight">Contact</h3>
          <p className="mt-2 max-w-[42ch] text-sm text-cream-dim">
            Message us on WhatsApp, call the box, or write to us.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={waHref} external>
              WhatsApp
            </Button>
            <Button href={telHref} variant="outline" external>
              Call now
            </Button>
            <Button href={mailHref} variant="ghost" external>
              Email
            </Button>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 hover:border-cream/50"
              aria-label="Instagram"
            >
              <InstagramLogo size={20} />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 hover:border-cream/50"
              aria-label="Facebook"
            >
              <FacebookLogo size={20} />
            </a>
          </div>
        </div>

        <div id="join" className="scroll-mt-24">
          <div className="h-full rounded-[1.5rem] border border-cream/15 bg-cream/[0.04] p-5 sm:p-6 lg:p-7">
            <h3 className="text-base font-semibold tracking-tight sm:text-xl">Book your 1st class free</h3>
            <p className="mt-2 max-w-[46ch] text-sm text-cream-dim">
              Fill this in to join. We will confirm with you first once we receive the request.
            </p>
            <JoinForm classes={classes} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="min-h-[280px] overflow-hidden border border-line bg-plum-mid lg:min-h-[420px]">
          <iframe
            title="Ranbhoomi Fitness Club on Google Maps"
            src={SITE.mapsEmbed}
            className="h-full min-h-[280px] w-full lg:min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
