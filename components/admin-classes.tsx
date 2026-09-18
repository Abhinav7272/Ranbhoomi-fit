"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash } from "@phosphor-icons/react";
import type { ClassGroup, ClassSlot, SlotKind } from "@/lib/types";

type Run = (fn: () => Promise<Response>) => Promise<void>;

function patch(payload: Record<string, unknown>) {
  return fetch("/api/classes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function ClassesPanel({
  groups,
  busy,
  run,
}: {
  groups: ClassGroup[];
  busy: boolean;
  run: Run;
}) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [note, setNote] = useState("");
  const [eitherOr, setEitherOr] = useState(false);

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Classes and timings</h2>
      <p className="mt-2 max-w-[62ch] text-sm text-cream-dim">
        Everything on the homepage board comes from here. Add a class, then add its times. Use “or”
        when people pick one time, like Saturday 8:00 or 9:00. Empty classes stay off the site until
        they have a time.
      </p>
      <form
        className="mt-6 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            fetch("/api/classes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, days, note, eitherOr }),
            }),
          ).then(() => {
            setName("");
            setDays("");
            setNote("");
            setEitherOr(false);
          });
        }}
      >
        <label className="text-sm text-cream-dim">
          Class name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            placeholder="Adults"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Days
          <input
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            placeholder="Monday - Friday"
            required
          />
        </label>
        <label className="text-sm text-cream-dim sm:col-span-2">
          Note
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3"
            placeholder="Optional, e.g. One batch only"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-dim sm:col-span-2">
          <input
            type="checkbox"
            checked={eitherOr}
            onChange={(e) => setEitherOr(e.target.checked)}
            className="h-4 w-4 accent-coral"
          />
          Join times with “or”
        </label>
        <button
          disabled={busy}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add class
        </button>
      </form>

      {groups.length === 0 ? (
        <p className="mt-8 text-sm text-cream-dim">No classes yet. Add one above.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {groups.map((group, i) => (
            <ClassEditor
              key={group.id}
              group={group}
              index={i}
              total={groups.length}
              busy={busy}
              run={run}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ClassEditor({
  group,
  index,
  total,
  busy,
  run,
}: {
  group: ClassGroup;
  index: number;
  total: number;
  busy: boolean;
  run: Run;
}) {
  const [name, setName] = useState(group.name);
  const [days, setDays] = useState(group.days);
  const [note, setNote] = useState(group.note);
  const [eitherOr, setEitherOr] = useState(group.eitherOr);
  const [time, setTime] = useState("");
  const [kind, setKind] = useState<SlotKind>("morning");

  useEffect(() => {
    setName(group.name);
    setDays(group.days);
    setNote(group.note);
    setEitherOr(group.eitherOr);
  }, [group.name, group.days, group.note, group.eitherOr]);

  const dirty =
    name.trim() !== group.name ||
    days.trim() !== group.days ||
    note.trim() !== group.note ||
    eitherOr !== group.eitherOr;

  return (
    <article className="rounded-2xl bg-plum-mid p-5">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            patch({
              classId: group.id,
              action: "update",
              name,
              days,
              note,
              eitherOr,
            }),
          );
        }}
      >
        <div className="flex items-start justify-between gap-3 sm:col-span-2">
          <p className="text-sm font-semibold tracking-tight">
            {group.name || "Untitled class"}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Move class up"
              disabled={busy || index === 0}
              className="rounded-full border border-line p-2 disabled:opacity-30"
              onClick={() => run(() => patch({ classId: group.id, action: "move-group", direction: "up" }))}
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              aria-label="Move class down"
              disabled={busy || index === total - 1}
              className="rounded-full border border-line p-2 disabled:opacity-30"
              onClick={() => run(() => patch({ classId: group.id, action: "move-group", direction: "down" }))}
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              aria-label="Remove class"
              disabled={busy}
              className="rounded-full border border-line p-2 text-cream-dim hover:text-coral disabled:opacity-30"
              onClick={() => {
                if (!confirm(`Remove ${group.name} from the homepage?`)) return;
                run(() => fetch(`/api/classes?id=${group.id}`, { method: "DELETE" }));
              }}
            >
              <Trash size={14} />
            </button>
          </div>
        </div>
        <label className="text-sm text-cream-dim">
          Class name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum px-4 py-2"
            required
          />
        </label>
        <label className="text-sm text-cream-dim">
          Days
          <input
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum px-4 py-2"
            required
          />
        </label>
        <label className="text-sm text-cream-dim sm:col-span-2">
          Note
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-plum px-4 py-2"
            placeholder="Optional"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-dim sm:col-span-2">
          <input
            type="checkbox"
            checked={eitherOr}
            onChange={(e) => setEitherOr(e.target.checked)}
            className="h-4 w-4 accent-coral"
          />
          Join times with “or”
        </label>
        <button
          disabled={busy || !dirty}
          className="w-fit rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
        >
          Save class
        </button>
      </form>

      <ul className="mt-5 space-y-2">
        {group.slots.length === 0 ? (
          <li className="text-sm text-cream-dim">No times yet. Add one below. This class stays hidden until it has a time.</li>
        ) : (
          group.slots.map((slot, i) => (
            <SlotRow
              key={slot.id}
              groupId={group.id}
              slot={slot}
              index={i}
              total={group.slots.length}
              busy={busy}
              run={run}
            />
          ))
        )}
      </ul>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          run(() =>
            patch({
              classId: group.id,
              action: "add-slot",
              time,
              kind,
            }),
          ).then(() => setTime(""));
        }}
      >
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 rounded-2xl border border-line bg-plum px-4 py-2"
          placeholder="6:15 AM"
          required
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as SlotKind)}
          className="rounded-2xl border border-line bg-plum px-3 py-2 text-sm"
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
        <button
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm disabled:opacity-60"
        >
          <Plus size={14} />
          Add time
        </button>
      </form>
    </article>
  );
}

function SlotRow({
  groupId,
  slot,
  index,
  total,
  busy,
  run,
}: {
  groupId: string;
  slot: ClassSlot;
  index: number;
  total: number;
  busy: boolean;
  run: Run;
}) {
  const [time, setTime] = useState(slot.time);

  useEffect(() => {
    setTime(slot.time);
  }, [slot.time]);

  function saveTime() {
    const next = time.trim();
    if (!next || next === slot.time) {
      setTime(slot.time);
      return;
    }
    run(() =>
      patch({
        classId: groupId,
        action: "update-slot",
        slotId: slot.id,
        time: next,
      }),
    );
  }

  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-line bg-plum px-3 py-2 sm:flex-row sm:items-center">
      <input
        value={time}
        onChange={(e) => setTime(e.target.value)}
        onBlur={saveTime}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="min-w-0 flex-1 rounded-xl border border-line bg-plum-mid px-3 py-2 text-sm"
        aria-label="Class time"
      />
      <select
        value={slot.kind}
        disabled={busy}
        onChange={(e) =>
          run(() =>
            patch({
              classId: groupId,
              action: "update-slot",
              slotId: slot.id,
              kind: e.target.value as SlotKind,
            }),
          )
        }
        className="rounded-xl border border-line bg-plum-mid px-3 py-2 text-sm"
        aria-label="Morning or evening"
      >
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
      </select>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Move time up"
          disabled={busy || index === 0}
          className="rounded-full border border-line p-2 disabled:opacity-30"
          onClick={() =>
            run(() => patch({ classId: groupId, action: "move-slot", slotId: slot.id, direction: "up" }))
          }
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          aria-label="Move time down"
          disabled={busy || index === total - 1}
          className="rounded-full border border-line p-2 disabled:opacity-30"
          onClick={() =>
            run(() =>
              patch({ classId: groupId, action: "move-slot", slotId: slot.id, direction: "down" }),
            )
          }
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          aria-label="Remove time"
          disabled={busy}
          className="rounded-full border border-line p-2 text-cream-dim hover:text-coral disabled:opacity-30"
          onClick={() =>
            run(() =>
              patch({ classId: groupId, action: "remove-slot", slotId: slot.id }),
            )
          }
        >
          <Trash size={14} />
        </button>
      </div>
    </li>
  );
}
