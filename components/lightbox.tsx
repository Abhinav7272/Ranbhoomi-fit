"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { GalleryImage } from "@/lib/types";

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndex]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-plum/95"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-sm text-cream/70">
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-cream/50"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
        {items.length > 1 ? (
          <button
            type="button"
            className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-plum sm:left-6"
            onClick={() => onIndex((index - 1 + items.length) % items.length)}
            aria-label="Previous photo"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
        ) : null}
        <div className="relative h-[68vh] w-full max-w-5xl">
          <Image
            src={item.url}
            alt={item.alt || "Ranbhoomi photo"}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        {items.length > 1 ? (
          <button
            type="button"
            className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-plum sm:right-6"
            onClick={() => onIndex((index + 1) % items.length)}
            aria-label="Next photo"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div className="flex justify-center gap-2 px-4 py-5">
          {items.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-cream" : "w-2 bg-cream/35"}`}
              onClick={() => onIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
