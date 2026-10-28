"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { PhotoPick } from "@/components/photo-pick";
import type { EventFormField, SiteEvent } from "@/lib/types";

type Run = (fn: () => Promise<Response>) => Promise<void>;

const input =
  "mt-2 w-full rounded-2xl border border-line bg-plum-mid px-4 py-3 text-sm text-cream outline-none";

const DEFAULT_FORM_FIELDS = "T-shirt size: XS, S, M, L, XL, XXL";

function labels(items: { label: string }[]) {
  return items.map((item) => item.label).join(", ");
}

function formFieldsText(fields: EventFormField[]) {
  return fields
    .map((field) => {
      const optional = field.required ? "" : "?";
      if (field.type === "select" && field.options.length) {
        return `${field.label}${optional}: ${field.options.join(", ")}`;
      }
      return `${field.label}${optional}`;
    })
    .join("\n");
}

export function EventsPanel({
  items,
  busy,
  run,
}: {
  items: SiteEvent[];
  busy: boolean;
  run: Run;
}) {
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [categories, setCategories] = useState("5 KM, 10 KM, 21 KM");
  const [perks, setPerks] = useState(
    "Prizes for winners, Finisher medals, Refreshments, Physio support, Professional photos & video, Fun community vibe",
  );
  const [merchNote, setMerchNote] = useState("");
  const [formFields, setFormFields] = useState(DEFAULT_FORM_FIELDS);
  const [ctaLabel, setCtaLabel] = useState("Register now");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-2xl font-semibold">Events</h2>
      <p className="mt-2 max-w-[62ch] text-sm text-cream-dim">
        Create race days and open events. Published events show on the site. Registrations land in
        the join inbox by email.
      </p>

      <form
        className="mt-6 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          const form = new FormData();
          form.append("title", title);
          form.append("slogan", slogan);
          form.append("date", date);
          form.append("time", time);
          form.append("venue", venue);
          form.append("categories", categories);
          form.append("perks", perks);
          form.append("merchNote", merchNote);
          form.append("formFields", formFields);
          form.append("ctaLabel", ctaLabel);
          form.append("published", String(published));
          form.append("featured", String(featured));
          form.append("registrationOpen", String(registrationOpen));
          form.append("file", file);
          run(() => fetch("/api/events", { method: "POST", body: form })).then(() => {
            setTitle("");
            setSlogan("");
            setDate("");
            setTime("");
            setVenue("");
            setMerchNote("");
            setFormFields(DEFAULT_FORM_FIELDS);
            setCtaLabel("Register now");
            setPublished(false);
            setFeatured(false);
            setRegistrationOpen(true);
            setFile(null);
          });
        }}
      >
        <label className="text-sm text-cream-dim">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} required />
        </label>
        <label className="text-sm text-cream-dim">
          Slogan
          <input value={slogan} onChange={(e) => setSlogan(e.target.value)} className={input} />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-cream-dim">
            Date
            <input value={date} onChange={(e) => setDate(e.target.value)} className={input} required placeholder="29 Nov 2026" />
          </label>
          <label className="text-sm text-cream-dim">
            Time
            <input value={time} onChange={(e) => setTime(e.target.value)} className={input} placeholder="6:00 AM" />
          </label>
          <label className="text-sm text-cream-dim">
            Venue
            <input value={venue} onChange={(e) => setVenue(e.target.value)} className={input} placeholder="RFC Grounds, Dehradun" />
          </label>
        </div>
        <label className="text-sm text-cream-dim">
          Categories
          <textarea
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className={`${input} min-h-24`}
            placeholder="5 KM, 10 KM, 21 KM"
          />
        </label>
        <label className="text-sm text-cream-dim">
          Perks
          <textarea
            value={perks}
            onChange={(e) => setPerks(e.target.value)}
            className={`${input} min-h-24`}
            placeholder="Medals, Refreshments, Physio"
          />
        </label>
        <label className="text-sm text-cream-dim">
          Merch note
          <input value={merchNote} onChange={(e) => setMerchNote(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-cream-dim">
          Extra form columns
          <textarea
            value={formFields}
            onChange={(e) => setFormFields(e.target.value)}
            className={`${input} min-h-28`}
            placeholder={"T-shirt size: XS, S, M, L, XL, XXL\nCity?\nBlood group"}
          />
          <span className="mt-1 block text-xs text-cream/50">
            One field per line. Add options after a colon for a dropdown. End with ? to make it optional.
          </span>
        </label>
        <label className="text-sm text-cream-dim">
          Button label
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={input} />
        </label>
        <PhotoPick file={file} onFile={setFile} disabled={busy} />
        {preview ? (
          <div className="relative h-40 w-full max-w-xl overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="flex flex-wrap gap-4 text-sm text-cream-dim">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured on homepage
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
            />
            Registration open
          </label>
        </div>
        <button
          disabled={busy || !file}
          className="w-fit rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
        >
          Add event
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-cream-dim">No events yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <EventEditor key={item.id} item={item} busy={busy} run={run} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EventEditor({
  item,
  busy,
  run,
}: {
  item: SiteEvent;
  busy: boolean;
  run: Run;
}) {
  const [title, setTitle] = useState(item.title);
  const [slogan, setSlogan] = useState(item.slogan);
  const [date, setDate] = useState(item.date);
  const [time, setTime] = useState(item.time);
  const [venue, setVenue] = useState(item.venue);
  const [categories, setCategories] = useState(labels(item.categories));
  const [perks, setPerks] = useState(labels(item.perks));
  const [merchNote, setMerchNote] = useState(item.merchNote);
  const [formFields, setFormFields] = useState(formFieldsText(item.formFields || []));
  const [ctaLabel, setCtaLabel] = useState(item.ctaLabel);
  const [published, setPublished] = useState(item.published);
  const [featured, setFeatured] = useState(item.featured);
  const [registrationOpen, setRegistrationOpen] = useState(item.registrationOpen);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle(item.title);
    setSlogan(item.slogan);
    setDate(item.date);
    setTime(item.time);
    setVenue(item.venue);
    setCategories(labels(item.categories));
    setPerks(labels(item.perks));
    setMerchNote(item.merchNote);
    setFormFields(formFieldsText(item.formFields || []));
    setCtaLabel(item.ctaLabel);
    setPublished(item.published);
    setFeatured(item.featured);
    setRegistrationOpen(item.registrationOpen);
    setFile(null);
  }, [item]);

  return (
    <li className="rounded-3xl border border-line p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{item.title}</p>
          <p className="mt-1 text-sm text-cream-dim">
            {item.date}
            {item.time ? ` · ${item.time}` : ""}
            {item.venue ? ` · ${item.venue}` : ""}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cream/55">
            {item.published ? "Published" : "Draft"}
            {item.featured ? " · Featured" : ""}
            {item.registrationOpen ? " · Registration open" : " · Registration closed"}
          </p>
        </div>
        {item.bannerUrl ? (
          <Image
            src={item.bannerUrl}
            alt=""
            width={180}
            height={100}
            unoptimized={item.bannerUrl.startsWith("http")}
            className="h-20 w-36 rounded-2xl object-cover"
          />
        ) : null}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="text-sm text-cream-dim">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-cream-dim">
          Slogan
          <input value={slogan} onChange={(e) => setSlogan(e.target.value)} className={input} />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-cream-dim">
            Date
            <input value={date} onChange={(e) => setDate(e.target.value)} className={input} />
          </label>
          <label className="text-sm text-cream-dim">
            Time
            <input value={time} onChange={(e) => setTime(e.target.value)} className={input} />
          </label>
          <label className="text-sm text-cream-dim">
            Venue
            <input value={venue} onChange={(e) => setVenue(e.target.value)} className={input} />
          </label>
        </div>
        <label className="text-sm text-cream-dim">
          Categories
          <textarea value={categories} onChange={(e) => setCategories(e.target.value)} className={`${input} min-h-20`} />
        </label>
        <label className="text-sm text-cream-dim">
          Perks
          <textarea value={perks} onChange={(e) => setPerks(e.target.value)} className={`${input} min-h-20`} />
        </label>
        <label className="text-sm text-cream-dim">
          Merch note
          <input value={merchNote} onChange={(e) => setMerchNote(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-cream-dim">
          Extra form columns
          <textarea
            value={formFields}
            onChange={(e) => setFormFields(e.target.value)}
            className={`${input} min-h-28`}
            placeholder={"T-shirt size: XS, S, M, L, XL, XXL\nCity?"}
          />
          <span className="mt-1 block text-xs text-cream/50">
            One field per line. Add options after a colon for a dropdown. End with ? to make it optional.
          </span>
        </label>
        <label className="text-sm text-cream-dim">
          Button label
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={input} />
        </label>
        <PhotoPick file={file} onFile={setFile} disabled={busy} />
        <div className="flex flex-wrap gap-4 text-sm text-cream-dim">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
            />
            Registration open
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            className="rounded-full bg-cream px-5 py-2 text-sm font-semibold text-plum disabled:opacity-60"
            onClick={() => {
              const form = new FormData();
              form.append("id", item.id);
              form.append("title", title);
              form.append("slogan", slogan);
              form.append("date", date);
              form.append("time", time);
              form.append("venue", venue);
              form.append("categories", categories);
              form.append("perks", perks);
              form.append("merchNote", merchNote);
              form.append("formFields", formFields);
              form.append("ctaLabel", ctaLabel || "Register now");
              form.append("published", String(published));
              form.append("featured", String(featured));
              form.append("registrationOpen", String(registrationOpen));
              if (file) form.append("file", file);
              run(() => fetch("/api/events", { method: "PATCH", body: form }));
            }}
          >
            Save event
          </button>
          <button
            type="button"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-coral disabled:opacity-60"
            onClick={() => {
              if (!confirm("Delete this event?")) return;
              run(() => fetch(`/api/events?id=${item.id}`, { method: "DELETE" }));
            }}
          >
            <Trash size={16} />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
