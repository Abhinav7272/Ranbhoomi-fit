"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { PhotoPick } from "@/components/photo-pick";
import type { GalleryImage } from "@/lib/types";

type Run = (fn: () => Promise<Response>) => Promise<void>;

export function MediaPanel({
  title,
  blurb,
  endpoint,
  items,
  busy,
  run,
  padded,
}: {
  title: string;
  blurb: string;
  endpoint: string;
  items: GalleryImage[];
  busy: boolean;
  run: Run;
  padded?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  return (
    <section className={`mt-12 border-t border-line pt-10 ${padded ? "pb-20" : ""}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-cream-dim">{blurb}</p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          const form = new FormData();
          form.append("file", file);
          run(() => fetch(endpoint, { method: "POST", body: form })).then(() => setFile(null));
        }}
      >
        <PhotoPick file={file} onFile={setFile} disabled={busy} />
        {preview ? (
          <div className="relative h-40 w-56 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <button
          disabled={busy || !file}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add photo
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-cream-dim">No photos yet. This section stays off the homepage.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="relative overflow-hidden rounded-2xl">
              <Image
                src={item.url}
                alt=""
                width={400}
                height={300}
                unoptimized={item.url.startsWith("http")}
                className="h-40 w-full object-cover"
              />
              <button
                type="button"
                aria-label="Delete photo"
                disabled={busy}
                className="absolute top-2 right-2 rounded-full bg-plum/80 p-2 text-cream hover:text-coral disabled:opacity-30"
                onClick={() => {
                  if (!confirm("Delete this photo?")) return;
                  run(() => fetch(`${endpoint}?id=${item.id}`, { method: "DELETE" }));
                }}
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
