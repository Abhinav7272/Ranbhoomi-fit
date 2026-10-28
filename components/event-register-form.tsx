"use client";

import { useMemo, useState } from "react";
import { sendEventViaFormsubmit } from "@/lib/booking";
import type { SiteEvent } from "@/lib/types";
import { waHref } from "@/lib/site";

const field =
  "mt-1.5 w-full rounded-xl border border-cream/20 bg-plum-mid px-3 py-2.5 text-sm text-cream outline-none placeholder:text-cream/35 scheme-dark focus:border-cream/50";

export function EventRegisterForm({ event }: { event: SiteEvent }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [emergency, setEmergency] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState(event.categories[0]?.label || "");
  const [extras, setExtras] = useState<Record<string, string>>(() =>
    Object.fromEntries(event.formFields.map((item) => [item.id, item.type === "select" ? item.options[0] || "" : ""])),
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const fields = useMemo(() => event.formFields, [event.formFields]);

  if (!event.registrationOpen) {
    return <p className="mt-4 text-sm text-cream-dim">Registration is closed for this event.</p>;
  }

  if (done) {
    return (
      <p className="mt-4 text-sm text-cream">
        Registration sent. The team will confirm with you. You can also reach them on{" "}
        <a href={waHref} className="underline" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        .
      </p>
    );
  }

  return (
    <form
      className="mt-4 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const form = new FormData(e.currentTarget);
          const res = await fetch("/api/events/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: event.id,
              name,
              phone,
              age: Number(age),
              email,
              emergency,
              notes,
              category,
              extras,
              website: String(form.get("website") || ""),
            }),
          });
          const data = (await res.json().catch(() => null)) as {
            error?: string;
            inbox?: string;
            registration?: {
              eventTitle: string;
              category: string;
              name: string;
              phone: string;
              age: number;
              email: string;
              emergency: string;
              notes: string;
              extras: Record<string, string>;
            };
          } | null;
          if (!res.ok) throw new Error(data?.error || "Could not send. Try WhatsApp.");
          if (data?.inbox && data.registration) {
            await sendEventViaFormsubmit(data.inbox, data.registration);
          }
          setDone(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not send. Try WhatsApp.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="text-sm text-cream-dim">
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} className={field} required />
      </label>
      <label className="text-sm text-cream-dim">
        Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} required />
      </label>
      <label className="text-sm text-cream-dim">
        Age
        <input
          type="number"
          min={5}
          max={90}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={field}
          required
        />
      </label>
      {event.categories.length ? (
        <label className="text-sm text-cream-dim">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field} required>
            {event.categories.map((item) => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {fields.map((item) => (
        <label key={item.id} className="text-sm text-cream-dim">
          {item.label}
          {item.type === "select" ? (
            <select
              value={extras[item.id] || ""}
              onChange={(e) => setExtras((prev) => ({ ...prev, [item.id]: e.target.value }))}
              className={field}
              required={item.required}
            >
              {!item.required ? <option value="">Choose</option> : null}
              {item.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={extras[item.id] || ""}
              onChange={(e) => setExtras((prev) => ({ ...prev, [item.id]: e.target.value }))}
              className={field}
              required={item.required}
            />
          )}
        </label>
      ))}
      <label className="text-sm text-cream-dim">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
      </label>
      <label className="text-sm text-cream-dim">
        Emergency contact
        <input value={emergency} onChange={(e) => setEmergency(e.target.value)} className={field} />
      </label>
      <label className="text-sm text-cream-dim">
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${field} min-h-20`} />
      </label>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <button
        disabled={busy}
        className="mt-1 w-fit rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-plum disabled:opacity-60"
      >
        {busy ? "Sending…" : event.ctaLabel || "Register now"}
      </button>
    </form>
  );
}
