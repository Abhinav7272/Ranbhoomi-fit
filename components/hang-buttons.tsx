import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { SITE, waHref } from "@/lib/site";

const hang =
  "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_20px_rgba(0,0,0,0.45)] ring-2 ring-cream/90 hover:scale-105 active:scale-95 sm:h-14 sm:w-14";

export function HangButtons() {
  return (
    <aside
      className="pointer-events-none fixed right-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[15] flex flex-col items-center sm:right-5"
      aria-label="Chat and social"
    >
      <span className="mb-1 h-8 w-px bg-cream/55 sm:h-10" aria-hidden />
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className={`${hang} bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285aeb_90%)]`}
      >
        <InstagramLogo size={22} weight="fill" />
      </a>
      <span className="h-3 w-px bg-cream/55" aria-hidden />
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className={`${hang} bg-[#25d366]`}
      >
        <WhatsappLogo size={24} weight="fill" />
      </a>
    </aside>
  );
}
