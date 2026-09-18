import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { moveById } from "@/lib/order";
import {
  deleteUpload,
  deleteUploadIfUnused,
  getSiteData,
  newId,
  saveSiteData,
  saveUpload,
} from "@/lib/store";

export const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const IMAGE_MAX = 8 * 1024 * 1024;

export type ImageKey = "gallery" | "highlights";

function fileFromForm(form: FormData) {
  const file = form.get("file");
  if (!(file instanceof File)) {
    return { error: "Choose an image", status: 400 as const };
  }
  if (!IMAGE_TYPES.has(file.type)) {
    return { error: "Use JPG, PNG, WEBP, or GIF", status: 400 as const };
  }
  if (file.size > IMAGE_MAX) {
    return { error: "Image must be under 8MB", status: 400 as const };
  }
  return { file };
}

function altFromName(file: File) {
  return file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

export async function listImages(key: ImageKey) {
  const data = await getSiteData();
  return NextResponse.json(data[key]);
}

export async function postImage(key: ImageKey, req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const parsed = fileFromForm(form);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const replaceId = String(form.get("replaceId") || "").trim();
  const altInput = String(form.get("alt") || "").trim();

  try {
    const url = await saveUpload(parsed.file);
    const data = await getSiteData();

    if (replaceId) {
      const item = data[key].find((image) => image.id === replaceId);
      if (!item) {
        await deleteUpload(url);
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      const previous = item.url;
      item.url = url;
      if (altInput) item.alt = altInput;
      await deleteUploadIfUnused(data, previous);
    } else {
      data[key].unshift({
        id: newId(),
        url,
        alt: altInput || altFromName(parsed.file),
        createdAt: new Date().toISOString(),
      });
    }

    await saveSiteData(data);
    return NextResponse.json({ ok: true, [key]: data[key] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function patchImage(key: ImageKey, req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    action?: "update" | "move";
    alt?: string;
    direction?: "up" | "down";
  } | null;

  const id = body?.id;
  const action = body?.action;
  if (!id || !action) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  const data = await getSiteData();

  if (action === "update") {
    const item = data[key].find((image) => image.id === id);
    if (!item) return NextResponse.json({ error: "Image not found" }, { status: 404 });
    if (typeof body.alt === "string") item.alt = body.alt.trim();
  } else if (action === "move") {
    const direction = body.direction === "up" ? "up" : "down";
    const result = moveById(data[key], id, direction);
    if (!result.found) return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, [key]: data[key] });
}

export async function deleteImage(key: ImageKey, req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  const image = data[key].find((item) => item.id === id);
  data[key] = data[key].filter((item) => item.id !== id);

  try {
    if (image) await deleteUploadIfUnused(data, image.url);
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, [key]: data[key] });
}
