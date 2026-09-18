import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { moveById } from "@/lib/order";
import { getSiteData, newId, saveSiteData } from "@/lib/store";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data.announcements);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as { title?: string; body?: string } | null;
  const title = body?.title?.trim();
  const text = body?.body?.trim();
  if (!title || !text) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }

  const data = await getSiteData();
  data.announcements.unshift({
    id: newId(),
    title,
    body: text,
    createdAt: new Date().toISOString(),
  });
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, announcements: data.announcements });
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    action?: "update" | "move";
    title?: string;
    body?: string;
    direction?: "up" | "down";
  } | null;

  const id = body?.id;
  const action = body?.action;
  if (!id || !action) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  const data = await getSiteData();

  if (action === "update") {
    const item = data.announcements.find((announcement) => announcement.id === id);
    if (!item) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
      item.title = title;
    }
    if (typeof body.body === "string") {
      const text = body.body.trim();
      if (!text) return NextResponse.json({ error: "Body is required" }, { status: 400 });
      item.body = text;
    }
  } else if (action === "move") {
    const result = moveById(data.announcements, id, body.direction === "up" ? "up" : "down");
    if (!result.found) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, announcements: data.announcements });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  data.announcements = data.announcements.filter((item) => item.id !== id);
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, announcements: data.announcements });
}
