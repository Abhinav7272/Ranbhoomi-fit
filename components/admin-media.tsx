"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Trash } from "@phosphor-icons/react";
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
  const [alt, setAlt] = useState("");
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  return (
    <section className={`mt-12 border-t border-line pt-10 ${padded ? "pb-20" : ""}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-[62ch] text-sm text-cream-dim">{blurb}</p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          const form = new FormData();
          form.append("file", file);
          form.append("alt", alt);
          run(() => fetch(endpoint, { method: "POST", body: form })).then(() => {
            setFile(null);
            setAlt("");
          });
        }}
      >
        <label className="block text-sm text-cream-dim">
          Upload image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-2 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="text-sm text-cream-dim">
          Caption
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            placeholder="Optional. Shown as alt text."
          />
        </label>
        {preview ? (
          <div className="relative h-40 w-56 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <button
          disabled={busy || !file}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Upload
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-cream-dim">No photos yet. This section stays off the homepage.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <MediaCard
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              endpoint={endpoint}
              busy={busy}
              run={run}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function MediaCard({
  item,
  index,
  total,
  endpoint,
  busy,
  run,
}: {
  item: GalleryImage;
  index: number;
  total: number;
  endpoint: string;
  busy: boolean;
  run: Run;
}) {
  const [alt, setAlt] = useState(item.alt);

  useEffect(() => {
    setAlt(item.alt);
  }, [item.alt]);

  const dirty = alt.trim() !== item.alt;

  return (
    <li className="rounded-2xl bg-plum-mid p-3">
      <div className="relative overflow-hidden rounded-xl">
        <Image src={item.url} alt={item.alt || titleFallback(endpoint)} width={400} height={300} className="h-40 w-full object-cover" />
      </div>
      <div className="mt-3 flex items-center justify-end gap-1">
        <button
          type="button"
          aria-label="Move photo up"
          disabled={busy || index === 0}
          className="rounded-full border border-line p-2 disabled:opacity-30"
          onClick={() =>
            run(() =>
              fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, action: "move", direction: "up" }),
              }),
            )
          }
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          aria-label="Move photo down"
          disabled={busy || index === total - 1}
          className="rounded-full border border-line p-2 disabled:opacity-30"
          onClick={() =>
            run(() =>
              fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, action: "move", direction: "down" }),
              }),
            )
          }
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          aria-label="Remove photo"
          disabled={busy}
          className="rounded-full border border-line p-2 text-cream-dim hover:text-coral disabled:opacity-30"
          onClick={() => {
            if (!confirm("Remove this photo from the homepage?")) return;
            run(() => fetch(`${endpoint}?id=${item.id}`, { method: "DELETE" }));
          }}
        >
          <Trash size={14} />
        </button>
      </div>
      <form
        className="mt-3 grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            fetch(endpoint, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: item.id, action: "update", alt }),
            }),
          );
        }}
      >
        <label className="text-sm text-cream-dim">
          Caption
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-plum px-3 py-2 text-sm"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={busy || !dirty}
            className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
          >
            Save caption
          </button>
          <label className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm">
            Replace photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                const next = e.target.files?.[0];
                e.target.value = "";
                if (!next) return;
                const form = new FormData();
                form.append("file", next);
                form.append("replaceId", item.id);
                run(() => fetch(endpoint, { method: "POST", body: form }));
              }}
            />
          </label>
        </div>
      </form>
    </li>
  );
}

function titleFallback(endpoint: string) {
  return endpoint.includes("highlight") ? "Ranbhoomi highlight" : "Ranbhoomi gallery image";
}
