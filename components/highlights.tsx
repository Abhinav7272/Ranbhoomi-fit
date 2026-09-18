"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { Lightbox } from "@/components/lightbox";

export function Highlights({
  items,
  lightboxItems,
}: {
  items: GalleryImage[];
  lightboxItems: GalleryImage[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-6 sm:px-6 lg:px-10 lg:pt-12 lg:pb-6">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Highlights
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const i = lightboxItems.findIndex(
                  (photo) => photo.url === item.url || photo.id === item.id,
                );
                if (i >= 0) setOpen(i);
              }}
              className="relative aspect-[4/3] overflow-hidden text-left"
            >
              <Image
                src={item.url}
                alt={item.alt || "Ranbhoomi highlight"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </div>
      {open != null && open >= 0 ? (
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
