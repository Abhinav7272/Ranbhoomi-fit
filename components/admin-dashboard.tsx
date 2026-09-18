"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Trash, SignOut } from "@phosphor-icons/react";
import { AnnouncementsPanel } from "@/components/admin-announcements";
import { ClassesPanel } from "@/components/admin-classes";
import { MediaPanel } from "@/components/admin-media";
import { PhotoPick } from "@/components/photo-pick";
import type { ClassGroup, GalleryImage, Announcement, StoryBlock, Coach } from "@/lib/types";

type Props = {
  announcements: Announcement[];
  classes: ClassGroup[];
  gallery: GalleryImage[];
  highlights: GalleryImage[];
  coaches: Coach[];
  mission: StoryBlock;
  vision: StoryBlock;
};

export function AdminDashboard({
  announcements,
  classes,
  gallery,
  highlights,
  coaches,
  mission,
  vision,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [galleryItems, setGalleryItems] = useState(gallery);
  const [highlightItems, setHighlightItems] = useState(highlights);

  useEffect(() => {
    setGalleryItems(gallery);
  }, [gallery]);

  useEffect(() => {
    setHighlightItems(highlights);
  }, [highlights]);

  async function run(fn: () => Promise<Response>) {
    setBusy(true);
    setError("");
    try {
      const res = await fn();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }
      if (Array.isArray(json.gallery)) setGalleryItems(json.gallery);
      if (Array.isArray(json.highlights)) setHighlightItems(json.highlights);
      await router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cream-dim">Ranbhoomi</p>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-cream/40"
          onClick={() => run(() => fetch("/api/auth", { method: "DELETE" })).then(() => router.replace("/admin/login"))}
        >
          <SignOut size={16} />
          Sign out
        </button>
      </header>
      {error ? <p className="mt-4 text-sm text-coral">{error}</p> : null}

      <AnnouncementsPanel items={announcements} busy={busy} run={run} />
      <StoryPanel mission={mission} vision={vision} busy={busy} run={run} />
      <ClassesPanel groups={classes} busy={busy} run={run} />
      <CoachesPanel items={coaches} busy={busy} run={run} />
      <MediaPanel
        title="Gallery"
        blurb="Homepage scroller. Add or delete photos here only."
        endpoint="/api/gallery"
        items={galleryItems}
        busy={busy}
        run={run}
      />
      <MediaPanel
        title="Highlights"
        blurb="Homepage photo grid. Separate from gallery."
        endpoint="/api/highlights"
        items={highlightItems}
        busy={busy}
        run={run}
        padded
      />
    </main>
  );
}

function StoryPanel({
  mission,
  vision,
  busy,
  run,
}: {
  mission: StoryBlock;
  vision: StoryBlock;
  busy: boolean;
  run: (fn: () => Promise<Response>) => Promise<void>;
}) {
  const [missionTitle, setMissionTitle] = useState(mission.title);
  const [missionBody, setMissionBody] = useState(mission.body);
  const [visionTitle, setVisionTitle] = useState(vision.title);
  const [visionBody, setVisionBody] = useState(vision.body);

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Mission and vision</h2>
      <form
        className="mt-6 grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            fetch("/api/story", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mission: { title: missionTitle, body: missionBody },
                vision: { title: visionTitle, body: visionBody },
              }),
            }),
          );
        }}
      >
        <label className="text-sm text-cream-dim">
          Mission title
          <input
            value={missionTitle}
            onChange={(e) => setMissionTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Mission
          <textarea
            value={missionBody}
            onChange={(e) => setMissionBody(e.target.value)}
            className="mt-2 min-h-32 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Vision title
          <input
            value={visionTitle}
            onChange={(e) => setVisionTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Vision
          <textarea
            value={visionBody}
            onChange={(e) => setVisionBody(e.target.value)}
            className="mt-2 min-h-32 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <button
          disabled={busy}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Save mission and vision
        </button>
      </form>
    </section>
  );
}

function CoachesPanel({
  items,
  busy,
  run,
}: {
  items: Coach[];
  busy: boolean;
  run: (fn: () => Promise<Response>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Coaches</h2>
      <p className="mt-2 text-sm text-cream-dim">Photo, name, and one line. This shows on the homepage.</p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          const form = new FormData();
          form.append("name", name);
          form.append("line", line);
          form.append("file", file);
          run(() => fetch("/api/coaches", { method: "POST", body: form })).then(() => {
            setName("");
            setLine("");
            setFile(null);
          });
        }}
      >
        <label className="text-sm text-cream-dim">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          One line
          <textarea
            value={line}
            onChange={(e) => setLine(e.target.value)}
            maxLength={200}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <PhotoPick file={file} onFile={setFile} disabled={busy} />
        {preview ? (
          <div className="relative h-40 w-32 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <button
          disabled={busy || !file}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add coach
        </button>
      </form>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <CoachEditor key={item.id} item={item} busy={busy} run={run} />
        ))}
      </ul>
    </section>
  );
}

function CoachEditor({
  item,
  busy,
  run,
}: {
  item: Coach;
  busy: boolean;
  run: (fn: () => Promise<Response>) => Promise<void>;
}) {
  const [name, setName] = useState(item.name);
  const [line, setLine] = useState(item.line);

  useEffect(() => {
    setName(item.name);
    setLine(item.line);
  }, [item.name, item.line]);

  const dirty = name.trim() !== item.name || line.trim() !== item.line;

  return (
    <li className="flex gap-4 rounded-2xl bg-plum-mid p-3">
      <Image
        src={item.photoUrl}
        alt={item.name}
        width={72}
        height={96}
        unoptimized={item.photoUrl.startsWith("http")}
        className="h-24 w-[72px] object-cover"
      />
      <form
        className="min-w-0 flex-1 grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData();
          form.append("id", item.id);
          form.append("name", name);
          form.append("line", line);
          run(() => fetch("/api/coaches", { method: "PATCH", body: form }));
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-line bg-plum px-3 py-2 text-sm font-semibold"
          required
        />
        <textarea
          value={line}
          onChange={(e) => setLine(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full rounded-xl border border-line bg-plum px-3 py-2 text-sm"
          required
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={busy || !dirty}
            className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
          >
            Save
          </button>
          <PhotoPick
            label="Change photo"
            disabled={busy}
            onFile={(next) => {
              const form = new FormData();
              form.append("id", item.id);
              form.append("file", next);
              run(() => fetch("/api/coaches", { method: "PATCH", body: form }));
            }}
          />
        </div>
      </form>
      <button
        type="button"
        aria-label={`Remove ${item.name}`}
        className="text-cream-dim hover:text-coral"
        onClick={() => run(() => fetch(`/api/coaches?id=${item.id}`, { method: "DELETE" }))}
      >
        <Trash size={18} />
      </button>
    </li>
  );
}
