import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import {
  deleteUploadIfUnused,
  getSiteData,
  newId,
  saveSiteData,
  saveUpload,
} from "@/lib/store";
import type { EventCategory, EventPerk, SiteEvent } from "@/lib/types";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = 8 * 1024 * 1024;

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

function parseList(raw: string, kind: "category" | "perk") {
  return raw
    .split(/\n|,/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((label) =>
      kind === "category"
        ? ({ id: newId(), label } as EventCategory)
        : ({ id: newId(), label } as EventPerk),
    );
}

function bool(value: FormDataEntryValue | null, fallback = false) {
  if (value == null || value === "") return fallback;
  return value === "true" || value === "on" || value === "1";
}

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data.events);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const title = clean(form.get("title"), 120);
  const slogan = clean(form.get("slogan"), 160);
  const date = clean(form.get("date"), 40);
  const time = clean(form.get("time"), 40);
  const venue = clean(form.get("venue"), 120);
  const merchNote = clean(form.get("merchNote"), 240);
  const ctaLabel = clean(form.get("ctaLabel"), 40) || "Register now";
  const categories = parseList(clean(form.get("categories"), 400), "category");
  const perks = parseList(clean(form.get("perks"), 400), "perk");
  const file = form.get("file");

  if (!title) return NextResponse.json({ error: "Add an event title" }, { status: 400 });
  if (!date) return NextResponse.json({ error: "Add the event date" }, { status: 400 });
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a banner image" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WEBP, or GIF" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Banner must be under 8MB" }, { status: 400 });
  }

  try {
    const bannerUrl = await saveUpload(file);
    const data = await getSiteData();
    const featured = bool(form.get("featured"));
    if (featured) {
      for (const event of data.events) event.featured = false;
    }

    const event: SiteEvent = {
      id: newId(),
      title,
      slogan,
      date,
      time,
      venue,
      bannerUrl,
      categories,
      perks,
      merchNote,
      ctaLabel,
      registrationOpen: bool(form.get("registrationOpen"), true),
      published: bool(form.get("published")),
      featured,
      createdAt: new Date().toISOString(),
    };
    data.events.unshift(event);
    await saveSiteData(data);
    return NextResponse.json({ ok: true, events: data.events });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const id = clean(form.get("id"), 80);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  const event = data.events.find((item) => item.id === id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const title = clean(form.get("title"), 120);
  const slogan = clean(form.get("slogan"), 160);
  const date = clean(form.get("date"), 40);
  const time = clean(form.get("time"), 40);
  const venue = clean(form.get("venue"), 120);
  const merchNote = clean(form.get("merchNote"), 240);
  const ctaLabel = clean(form.get("ctaLabel"), 40);
  const categoriesRaw = form.get("categories");
  const perksRaw = form.get("perks");
  const file = form.get("file");

  if (title) event.title = title;
  if (slogan || form.has("slogan")) event.slogan = slogan;
  if (date) event.date = date;
  if (time || form.has("time")) event.time = time;
  if (venue || form.has("venue")) event.venue = venue;
  if (merchNote || form.has("merchNote")) event.merchNote = merchNote;
  if (ctaLabel) event.ctaLabel = ctaLabel;
  if (typeof categoriesRaw === "string") {
    event.categories = parseList(clean(categoriesRaw, 400), "category");
  }
  if (typeof perksRaw === "string") {
    event.perks = parseList(clean(perksRaw, 400), "perk");
  }
  if (form.has("registrationOpen")) event.registrationOpen = bool(form.get("registrationOpen"));
  if (form.has("published")) event.published = bool(form.get("published"));
  if (form.has("featured")) {
    const featured = bool(form.get("featured"));
    if (featured) {
      for (const item of data.events) item.featured = item.id === id;
    } else {
      event.featured = false;
    }
  }

  if (file instanceof File) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Use JPG, PNG, WEBP, or GIF" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "Banner must be under 8MB" }, { status: 400 });
    }
    try {
      const previous = event.bannerUrl;
      event.bannerUrl = await saveUpload(file);
      await deleteUploadIfUnused(data, previous);
    } catch (error) {
      return fail(error);
    }
  }

  try {
    await saveSiteData(data);
    return NextResponse.json({ ok: true, events: data.events });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  const event = data.events.find((item) => item.id === id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  data.events = data.events.filter((item) => item.id !== id);
  try {
    await saveSiteData(data);
    await deleteUploadIfUnused(data, event.bannerUrl);
    return NextResponse.json({ ok: true, events: data.events });
  } catch (error) {
    return fail(error);
  }
}
