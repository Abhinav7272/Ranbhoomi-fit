import { unstable_noStore as noStore } from "next/cache";
import { put, list, del } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type {
  ClassGroup,
  ClassSlot,
  EventCategory,
  EventFormField,
  EventPerk,
  GalleryImage,
  SiteData,
  SiteEvent,
  SlotKind,
} from "./types";
import seed from "../data/site.json";
import { SITE } from "./site";

const LOCAL_FILE = path.join(process.cwd(), "data", "site.json");
const BLOB_PREFIX = "rfc/site/";
const BLOB_LEGACY = "rfc/site.json";
const LOCAL_UPLOADS = path.join(process.cwd(), "public", "uploads");

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL && process.env.BLOB_STORE_ID));
}

function cloneSeed(): SiteData {
  return JSON.parse(JSON.stringify(seed)) as SiteData;
}

function slotKind(kind: unknown): SlotKind {
  return kind === "evening" ? "evening" : "morning";
}

function normalizeSlots(slots: ClassSlot[] | undefined): ClassSlot[] {
  if (!Array.isArray(slots)) return [];
  return slots
    .filter((slot) => slot && slot.id && String(slot.time ?? "").trim())
    .map((slot) => ({
      id: slot.id,
      time: String(slot.time).trim(),
      kind: slotKind(slot.kind),
    }));
}

function normalizeClasses(classes: ClassGroup[] | undefined, fallback: ClassGroup[]): ClassGroup[] {
  const source = Array.isArray(classes) ? classes : fallback;
  return source
    .filter((group) => group && group.id)
    .map((group) => ({
      id: group.id,
      name: String(group.name ?? "").trim() || "Class",
      days: String(group.days ?? "").trim() || "Days TBA",
      note: String(group.note ?? "").trim(),
      eitherOr: Boolean(group.eitherOr),
      slots: normalizeSlots(group.slots),
    }));
}

function normalizeAnnouncements(
  items: SiteData["announcements"] | undefined,
  fallback: SiteData["announcements"],
): SiteData["announcements"] {
  const source = Array.isArray(items) ? items : fallback;
  return source
    .filter((item) => item && item.id)
    .map((item) => ({
      id: item.id,
      title: String(item.title ?? "").trim() || "Announcement",
      body: String(item.body ?? "").trim(),
      createdAt: item.createdAt || new Date().toISOString(),
    }))
    .filter((item) => item.body);
}

function normalizeImages(items: GalleryImage[] | undefined, fallback: GalleryImage[]): GalleryImage[] {
  const source = Array.isArray(items) ? items : fallback;
  return source
    .filter((item) => item && item.id && item.url)
    .map((item) => ({
      id: item.id,
      url: item.url,
      alt: String(item.alt ?? "").trim(),
      createdAt: item.createdAt || new Date().toISOString(),
    }));
}

function normalizeEmail(value: unknown, fallback: string) {
  const email = String(value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : fallback;
}

function normalizeCategories(items: EventCategory[] | undefined): EventCategory[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.id && String(item.label ?? "").trim())
    .map((item) => ({ id: item.id, label: String(item.label).trim() }));
}

function normalizePerks(items: EventPerk[] | undefined): EventPerk[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.id && String(item.label ?? "").trim())
    .map((item) => ({ id: item.id, label: String(item.label).trim() }));
}

function normalizeFormFields(items: EventFormField[] | undefined): EventFormField[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.id && String(item.label ?? "").trim())
    .map((item) => {
      const options = Array.isArray(item.options)
        ? item.options.map((option) => String(option ?? "").trim()).filter(Boolean).slice(0, 24)
        : [];
      return {
        id: item.id,
        label: String(item.label).trim(),
        type: item.type === "select" || options.length ? "select" : "text",
        options,
        required: item.required !== false,
      };
    });
}

function normalizeEvents(items: SiteEvent[] | undefined, fallback: SiteEvent[]): SiteEvent[] {
  const source = Array.isArray(items) ? items : fallback;
  return source
    .filter((item) => item && item.id && String(item.title ?? "").trim())
    .map((item) => ({
      id: item.id,
      title: String(item.title ?? "").trim(),
      slogan: String(item.slogan ?? "").trim(),
      date: String(item.date ?? "").trim(),
      time: String(item.time ?? "").trim(),
      venue: String(item.venue ?? "").trim(),
      bannerUrl: String(item.bannerUrl ?? "").trim(),
      categories: normalizeCategories(item.categories),
      perks: normalizePerks(item.perks),
      formFields: normalizeFormFields(item.formFields),
      merchNote: String(item.merchNote ?? "").trim(),
      ctaLabel: String(item.ctaLabel ?? "").trim() || "Register now",
      successMessage:
        String(item.successMessage ?? "").trim() ||
        "Registration is done. We will connect with you soon.",
      registrationOpen: item.registrationOpen !== false,
      published: Boolean(item.published),
      featured: Boolean(item.featured),
      createdAt: item.createdAt || new Date().toISOString(),
    }));
}

function normalize(data: Partial<SiteData> | null | undefined): SiteData {
  const s = cloneSeed();
  return {
    announcements: normalizeAnnouncements(data?.announcements, s.announcements),
    classes: normalizeClasses(data?.classes, s.classes),
    gallery: normalizeImages(data?.gallery, s.gallery),
    highlights: normalizeImages(data?.highlights, s.highlights),
    coaches: data?.coaches ?? s.coaches,
    mission: data?.mission ?? s.mission,
    vision: data?.vision ?? s.vision,
    achievements: data?.achievements ?? s.achievements,
    joinEmail: normalizeEmail(data?.joinEmail ?? s.joinEmail, SITE.email),
    events: normalizeEvents(data?.events, s.events ?? []),
  };
}

export function publishedEvents(events: SiteEvent[]) {
  return [...events]
    .filter((event) => event.published)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.date.localeCompare(b.date) || b.createdAt.localeCompare(a.createdAt);
    });
}

export function featuredEvent(events: SiteEvent[]) {
  const list = publishedEvents(events);
  return list.find((event) => event.featured) ?? list[0] ?? null;
}

async function readLocal(): Promise<SiteData> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return normalize(JSON.parse(raw) as Partial<SiteData>);
  } catch {
    return cloneSeed();
  }
}

async function writeLocal(data: SiteData) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2));
}

async function fetchSite(url: string): Promise<SiteData | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return normalize((await res.json()) as Partial<SiteData>);
}

async function newestBlob(prefix: string) {
  const result = await list({ prefix });
  return [...result.blobs].sort(
    (a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt),
  );
}

async function readBlob(): Promise<SiteData> {
  const versioned = await newestBlob(BLOB_PREFIX);
  if (versioned[0]) {
    const data = await fetchSite(versioned[0].downloadUrl || versioned[0].url);
    if (data) return data;
  }
  const legacy = await newestBlob(BLOB_LEGACY);
  const file = legacy.find((b) => b.pathname === BLOB_LEGACY) ?? legacy[0];
  if (file) {
    const data = await fetchSite(file.downloadUrl || file.url);
    if (data) return data;
  }
  return cloneSeed();
}

async function writeBlob(data: SiteData) {
  const pathname = `${BLOB_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  const blobs = await newestBlob(BLOB_PREFIX);
  const stale = blobs.filter((b) => b.pathname !== pathname).slice(3);
  if (stale.length) await del(stale.map((b) => b.url));
}

export async function getSiteData(): Promise<SiteData> {
  noStore();
  if (hasBlob()) return readBlob();
  return readLocal();
}

export async function saveSiteData(data: SiteData) {
  if (hasBlob()) {
    await writeBlob(data);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("Add BLOB_READ_WRITE_TOKEN so admin changes can persist on Vercel.");
  }
  await writeLocal(data);
}

export async function saveUpload(file: File) {
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}${ext}`;

  if (hasBlob()) {
    const blob = await put(`rfc/gallery/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Add BLOB_READ_WRITE_TOKEN so image uploads persist on Vercel.");
  }

  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(LOCAL_UPLOADS, filename), buf);
  return `/uploads/${filename}`;
}

export function imageUrlInUse(data: SiteData, url: string) {
  return (
    data.gallery.some((item) => item.url === url) ||
    data.highlights.some((item) => item.url === url) ||
    data.coaches.some((item) => item.photoUrl === url) ||
    data.events.some((item) => item.bannerUrl === url)
  );
}

export async function deleteUpload(url: string) {
  if (hasBlob() && url.includes("blob.vercel-storage.com")) {
    await del(url);
    return;
  }
  if (url.startsWith("/uploads/")) {
    const file = path.join(LOCAL_UPLOADS, path.basename(url));
    await fs.unlink(file).catch(() => undefined);
  }
}

export async function deleteUploadIfUnused(data: SiteData, url: string) {
  if (!imageUrlInUse(data, url)) await deleteUpload(url);
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
