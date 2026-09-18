"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Trash, SignOut } from "@phosphor-icons/react";
import { AnnouncementsPanel } from "@/components/admin-announcements";
import { ClassesPanel } from "@/components/admin-classes";
import { MediaPanel } from "@/components/admin-media";
import type { ClassGroup, GalleryImage, Announcement, StoryBlock, Achievement, Coach } from "@/lib/types";

type Props = {
  announcements: Announcement[];
  classes: ClassGroup[];
  gallery: GalleryImage[];
  highlights: GalleryImage[];
  coaches: Coach[];
  mission: StoryBlock;
  vision: StoryBlock;
  achievements: Achievement[];
};

export function AdminDashboard({
  announcements,
  classes,
  gallery,
  highlights,
  coaches,
  mission,
  vision,
  achievements,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    router.refresh();
  }

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
      refresh();
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
      <AchievementsPanel items={achievements} busy={busy} run={run} />
      <ClassesPanel groups={classes} busy={busy} run={run} />
      <CoachesPanel items={coaches} busy={busy} run={run} />
      <MediaPanel
        title="Gallery"
        blurb="Photos in the homepage scroller. Upload, caption, replace, reorder, or remove. An empty gallery stays off the site."
        endpoint="/api/gallery"
        items={gallery}
        busy={busy}
        run={run}
      />
      <MediaPanel
        title="Highlights"
        blurb="The homepage photo grid. Same controls as gallery. An empty highlights section stays off the site."
        endpoint="/api/highlights"
        items={highlights}
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

function AchievementsPanel({
  items,
  busy,
  run,
}: {
  items: Achievement[];
  busy: boolean;
  run: (fn: () => Promise<Response>) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Achievements</h2>
      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            fetch("/api/achievements", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, body }),
            }),
          ).then(() => {
            setTitle("");
            setBody("");
          });
        }}
      >
        <label className="text-sm text-cream-dim">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 min-h-24 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <button
          disabled={busy}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add achievement
        </button>
      </form>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 rounded-2xl bg-plum-mid p-4">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-cream-dim">{item.body}</p>
            </div>
            <button
              type="button"
              aria-label="Remove achievement"
              className="text-cream-dim hover:text-coral"
              onClick={() => run(() => fetch(`/api/achievements?id=${item.id}`, { method: "DELETE" }))}
            >
              <Trash size={18} />
            </button>
          </li>
        ))}
      </ul>
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
          <input
            value={line}
            onChange={(e) => setLine(e.target.value)}
            maxLength={90}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <label className="block text-sm text-cream-dim">
          Photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-2 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </label>
        {preview ? (
          <div className="relative h-40 w-32 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
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
          <li key={item.id} className="flex gap-4 rounded-2xl bg-plum-mid p-3">
            <Image
              src={item.photoUrl}
              alt={item.name}
              width={72}
              height={96}
              className="h-24 w-[72px] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm text-cream-dim">{item.line}</p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              className="text-cream-dim hover:text-coral"
              onClick={() => run(() => fetch(`/api/coaches?id=${item.id}`, { method: "DELETE" }))}
            >
              <Trash size={18} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
