import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { SITE, waHref } from "@/lib/site";

const hang =
  "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-cream/70 text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:bg-cream hover:text-plum active:scale-95 sm:h-14 sm:w-14";

export function HangButtons() {
  return (
    <aside
      className="pointer-events-none fixed right-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[15] flex flex-col items-center gap-3 sm:right-5"
      aria-label="Chat and social"
    >
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className={hang}
      >
        <InstagramLogo size={22} weight="fill" />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className={hang}
      >
        <WhatsappLogo size={24} weight="fill" />
      </a>
    </aside>
  );
}
