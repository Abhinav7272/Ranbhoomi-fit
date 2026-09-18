import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { deleteUploadIfUnused, getSiteData, newId, saveSiteData, saveUpload } from "@/lib/store";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = 8 * 1024 * 1024;

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data.coaches);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const line = String(form.get("line") || "").trim();
  const file = form.get("file");

  if (!name || !line) {
    return NextResponse.json({ error: "Name and one line are required" }, { status: 400 });
  }
  if (line.length > 90) {
    return NextResponse.json({ error: "Keep the line under 90 characters" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photo" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WEBP, or GIF" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  try {
    const photoUrl = await saveUpload(file);
    const data = await getSiteData();
    data.coaches.push({
      id: newId(),
      name,
      line,
      photoUrl,
    });
    await saveSiteData(data);
    return NextResponse.json({ ok: true, coaches: data.coaches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const id = String(form.get("id") || "").trim();
  const file = form.get("file");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photo" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WEBP, or GIF" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const data = await getSiteData();
  const coach = data.coaches.find((item) => item.id === id);
  if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

  try {
    const photoUrl = await saveUpload(file);
    const previous = coach.photoUrl;
    coach.photoUrl = photoUrl;
    await deleteUploadIfUnused(data, previous);
    await saveSiteData(data);
    return NextResponse.json({ ok: true, coaches: data.coaches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  const coach = data.coaches.find((item) => item.id === id);
  data.coaches = data.coaches.filter((item) => item.id !== id);
  try {
    if (coach) await deleteUploadIfUnused(data, coach.photoUrl);
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, coaches: data.coaches });
}
