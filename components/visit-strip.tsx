import Image from "next/image";
import { Button } from "@/components/button";
import { Reveal } from "@/components/reveal";

export function VisitStrip() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/box-interior.png"
        alt="Painterly dusk interior of the Ranbhoomi box"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-plum/70" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Reveal>
          <h2 className="max-w-[14ch] text-xl font-semibold tracking-tight sm:text-2xl">
            Walk in. Train with <em className="font-serif font-normal italic">us.</em>
          </h2>
          <p className="mt-3 max-w-[46ch] text-sm text-cream/85">
            Call, WhatsApp, or come to the box. We will get you on the floor.
          </p>
          <div className="mt-6">
            <Button href="/contact">Find us</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
