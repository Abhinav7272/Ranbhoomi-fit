import { put, list, del } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { ClassGroup, ClassSlot, GalleryImage, SiteData, SlotKind } from "./types";
import seed from "../data/site.json";

const LOCAL_FILE = path.join(process.cwd(), "data", "site.json");
const BLOB_KEY = "rfc/site.json";
const LOCAL_UPLOADS = path.join(process.cwd(), "public", "uploads");

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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

function normalizeImages(
  items: GalleryImage[] | undefined,
  fallback: GalleryImage[],
): GalleryImage[] {
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
  };
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

async function readBlob(): Promise<SiteData> {
  const result = await list({ prefix: BLOB_KEY });
  const file = result.blobs.find((b) => b.pathname === BLOB_KEY);
  if (!file) return cloneSeed();
  const res = await fetch(file.url, { cache: "no-store" });
  if (!res.ok) return cloneSeed();
  return normalize((await res.json()) as Partial<SiteData>);
}

async function writeBlob(data: SiteData) {
  await put(BLOB_KEY, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getSiteData(): Promise<SiteData> {
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
    data.coaches.some((item) => item.photoUrl === url)
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
