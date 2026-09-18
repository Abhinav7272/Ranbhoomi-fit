"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Trash } from "@phosphor-icons/react";
import type { Announcement } from "@/lib/types";

type Run = (fn: () => Promise<Response>) => Promise<void>;

function patch(payload: Record<string, unknown>) {
  return fetch("/api/announcements", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function AnnouncementsPanel({
  items,
  busy,
  run,
}: {
  items: Announcement[];
  busy: boolean;
  run: Run;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Announcements</h2>
      <p className="mt-2 max-w-[62ch] text-sm text-cream-dim">
        These show on the homepage in this order. Add, edit, reorder, or remove. An empty list stays
        off the site.
      </p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            fetch("/api/announcements", {
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
            className="mt-2 min-h-28 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            required
          />
        </label>
        <button
          disabled={busy}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add announcement
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-cream-dim">No announcements yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item, i) => (
            <AnnouncementEditor
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              busy={busy}
              run={run}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function AnnouncementEditor({
  item,
  index,
  total,
  busy,
  run,
}: {
  item: Announcement;
  index: number;
  total: number;
  busy: boolean;
  run: Run;
}) {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);

  useEffect(() => {
    setTitle(item.title);
    setBody(item.body);
  }, [item.title, item.body]);

  const dirty = title.trim() !== item.title || body.trim() !== item.body;

  return (
    <li className="rounded-2xl bg-plum-mid p-4">
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            patch({
              id: item.id,
              action: "update",
              title,
              body,
            }),
          );
        }}
      >
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Move announcement up"
            disabled={busy || index === 0}
            className="rounded-full border border-line p-2 disabled:opacity-30"
            onClick={() => run(() => patch({ id: item.id, action: "move", direction: "up" }))}
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            aria-label="Move announcement down"
            disabled={busy || index === total - 1}
            className="rounded-full border border-line p-2 disabled:opacity-30"
            onClick={() => run(() => patch({ id: item.id, action: "move", direction: "down" }))}
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            aria-label="Remove announcement"
            disabled={busy}
            className="rounded-full border border-line p-2 text-cream-dim hover:text-coral disabled:opacity-30"
            onClick={() => {
              if (!confirm("Remove this announcement from the homepage?")) return;
              run(() => fetch(`/api/announcements?id=${item.id}`, { method: "DELETE" }));
            }}
          >
            <Trash size={14} />
          </button>
        </div>
        <label className="text-sm text-cream-dim">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum px-4 py-2"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 min-h-24 w-full rounded-2xl border border-line bg-plum px-4 py-2"
            required
          />
        </label>
        <button
          disabled={busy || !dirty}
          className="w-fit rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
        >
          Save announcement
        </button>
      </form>
    </li>
  );
}
