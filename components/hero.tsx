"use client";

import Image from "next/image";
import Link from "next/link";
import { Images, Megaphone } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[320px] overflow-hidden sm:h-[380px] lg:h-[420px]">
      <Image
        src="/images/hero-ranbhoomi-cartoon-wide.png"
        alt="Illustration of the empty Ranbhoomi box with rig, drum fan, racks and the hills beyond"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_50%]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.92)_18%,rgba(10,10,10,0.45)_42%,transparent_72%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-4 pb-8 pt-20 sm:px-6 sm:pb-10 lg:px-10">
        <motion.div
          className="max-w-3xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <h1 className="text-xl font-semibold leading-[1.15] tracking-tight text-cream drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:text-3xl">
            Win the battle <em className="font-serif font-normal italic">within.</em>
          </h1>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-cream drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            Dehradun&apos;s only one of a kind fitness box.
            <br />
            Not a gym. A community.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Button href="/#contact">Contact</Button>
            <Link
              href="/#announcements"
              aria-label="Announcements"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/70 text-cream hover:bg-cream hover:text-plum"
            >
              <Megaphone size={20} weight="bold" />
            </Link>
            <Link
              href="/#gallery"
              aria-label="Gallery"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/70 text-cream hover:bg-cream hover:text-plum"
            >
              <Images size={20} weight="bold" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
