"use client";

import { useMemo, useState } from "react";
import type { ClassGroup } from "@/lib/types";
import { waHref } from "@/lib/site";

const field =
  "mt-1.5 w-full rounded-xl border border-cream/20 bg-plum-mid px-3 py-2.5 text-sm text-cream outline-none placeholder:text-cream/35 scheme-dark focus:border-cream/50";

const GENDERS = ["Female", "Male", "Other"] as const;
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function isKidsGroup(group: ClassGroup) {
  return /kid/i.test(group.name);
}

function timesFor(groups: ClassGroup[], who: "Adult" | "Kid") {
  const kids = who === "Kid";
  return groups
    .filter((group) => isKidsGroup(group) === kids)
    .flatMap((group) =>
      group.slots.map((slot) => ({
        value: `${group.name} · ${slot.time}`,
        label: `${slot.time} · ${group.name} (${group.days})`,
      })),
    );
}

export function JoinForm({ classes }: { classes: ClassGroup[] }) {
  const minDate = todayISO();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [who, setWho] = useState<"Adult" | "Kid">("Adult");
  const [level, setLevel] = useState("");
  const [startDate, setStartDate] = useState(minDate);
  const [time, setTime] = useState("First available");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const times = useMemo(() => timesFor(classes, who), [classes, who]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          age: Number(age),
          gender,
          who,
          level,
          startDate,
          time,
          website: String(form.get("website") || ""),
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || "Could not send. Try WhatsApp.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Try WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="mt-4 text-sm text-cream">
        Booked. We will confirm with you first once we receive the request.
      </p>
    );
  }

  return (
    <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <label className="text-xs text-cream-dim">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
          autoComplete="name"
          required
        />
      </label>
      <label className="text-xs text-cream-dim">
        Phone no.
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={field}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
        />
      </label>
      <label className="text-xs text-cream-dim">
        Age
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={field}
          type="number"
          inputMode="numeric"
          min={3}
          max={80}
          required
        />
      </label>
      <label className="text-xs text-cream-dim">
        Gender
        <select value={gender} onChange={(e) => setGender(e.target.value)} className={field} required>
          <option value="" disabled>
            Select
          </option>
          {GENDERS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-cream-dim">
        Kid or adult
        <select
          value={who}
          onChange={(e) => {
            const next = e.target.value as "Adult" | "Kid";
            setWho(next);
            setTime("First available");
          }}
          className={field}
          required
        >
          <option value="Adult">Adult</option>
          <option value="Kid">Kid</option>
        </select>
      </label>
      <label className="text-xs text-cream-dim">
        Activity level
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={field} required>
          <option value="" disabled>
            Select
          </option>
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-cream-dim">
        Date to start
        <input
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={field}
          type="date"
          min={minDate}
          required
        />
      </label>
      <label className="text-xs text-cream-dim">
        Time
        <select value={time} onChange={(e) => setTime(e.target.value)} className={field} required>
          <option value="First available">First available</option>
          {times.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p className="text-sm text-cream sm:col-span-2">
          {error}{" "}
          <a href={waHref} target="_blank" rel="noreferrer" className="underline">
            WhatsApp us
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="w-fit rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-plum hover:bg-white disabled:opacity-60 sm:col-span-2"
      >
        {busy ? "Sending…" : "Book 1st class free"}
      </button>
    </form>
  );
}
