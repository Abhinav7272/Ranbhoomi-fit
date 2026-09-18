"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { GalleryImage } from "@/lib/types";
import { Lightbox } from "@/components/lightbox";

export function Gallery({
  items,
  lightboxItems,
}: {
  items: GalleryImage[];
  lightboxItems: GalleryImage[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    setAtStart(left <= 2);
    setAtEnd(left >= max - 2);
    const tile = el.querySelector("button");
    const width = tile?.getBoundingClientRect().width || 168;
    const i = max <= 0 ? 0 : Math.round((left / max) * (items.length - 1));
    setActive(Math.max(0, Math.min(items.length - 1, i)));
  }, [items.length]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  function go(next: number) {
    const el = scroller.current;
    const row = el?.firstElementChild;
    const child = row?.children[next] as HTMLElement | undefined;
    if (!el || !child) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: Math.min(child.offsetLeft, max), behavior: "smooth" });
  }

  function nudge(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const tile = el.querySelector("button");
    const width = tile?.getBoundingClientRect().width || 200;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollTo({
      left: Math.max(0, Math.min(max, el.scrollLeft + dir * width)),
      behavior: "smooth",
    });
  }

  function openPhoto(item: GalleryImage) {
    const i = lightboxItems.findIndex((photo) => photo.url === item.url || photo.id === item.id);
    if (i >= 0) setOpen(i);
  }

  if (!items.length) return null;

  return (
    <section id="gallery" className="scroll-mt-20">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-4 px-4 py-8 sm:px-6 lg:px-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Gallery</h2>
        </div>
        {items.length > 1 ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="gallery-arrow flex h-9 w-9 items-center justify-center rounded-full border border-line text-cream disabled:opacity-30"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous gallery photos"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              className="gallery-arrow flex h-9 w-9 items-center justify-center rounded-full border border-line text-cream disabled:opacity-30"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next gallery photos"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <div ref={scroller} className="hide-scrollbar overflow-x-auto scroll-smooth">
          <div className="flex w-max gap-2 sm:gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openPhoto(item)}
                className="relative h-[132px] w-[168px] shrink-0 overflow-hidden sm:h-[156px] sm:w-[200px]"
              >
                <Image
                  src={item.url}
                  alt={item.alt || "Ranbhoomi gallery image"}
                  fill
                  sizes="200px"
                  unoptimized={item.url.startsWith("http")}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      {items.length > 1 ? (
        <div className="flex justify-center gap-2 py-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Gallery photo ${i + 1}`}
              className={`gallery-dot h-2 rounded-full ${i === active ? "gallery-dot-active w-6 bg-cream" : "w-2 bg-cream/35"}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
      {open != null ? (
        <Lightbox
          items={lightboxItems}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      ) : null}
    </section>
  );
}
