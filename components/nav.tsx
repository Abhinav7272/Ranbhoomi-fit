"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled || open ? "bg-plum/80 backdrop-blur-md" : ""
        }`}
      >
        <div className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-10">
          <Link href="/" className="relative block h-11 w-[94px] shrink-0 sm:h-[54px] sm:w-[118px]">
            <Image
              src="/images/rfc-logo.png"
              alt="Ranbhoomi RFC"
              fill
              priority
              sizes="118px"
              className="object-contain object-left drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-medium tracking-[0.16em] text-cream/80 uppercase hover:text-cream"
              >
                <span className="mr-1.5 text-coral">+</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="relative h-10 w-10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute left-2 right-2 h-px bg-cream transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "top-1/2 rotate-45" : "top-[14px]"}`}
            />
            <span
              className={`absolute left-2 right-2 top-1/2 h-px bg-cream transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-2 right-2 h-px bg-cream transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "top-1/2 -rotate-45" : "top-[26px]"}`}
            />
          </button>
        </div>
      </header>

      <motion.div
        className="glass fixed inset-0 z-20 bg-plum/90 backdrop-blur-3xl lg:hidden"
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        transition={{ duration: reduce ? 0 : 0.45, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex min-h-[100dvh] flex-col justify-center gap-5 px-6">
          {NAV.map((item, i) => (
            <motion.div
              key={item.href}
              initial={false}
              animate={
                reduce
                  ? { opacity: open ? 1 : 0 }
                  : { opacity: open ? 1 : 0, y: open ? 0 : 24 }
              }
              transition={{ delay: open ? 0.08 * i : 0, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href={item.href}
                className="block font-serif text-3xl tracking-tight"
                onClick={() => setOpen(false)}
              >
                <span className="mr-2 text-coral">+</span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
