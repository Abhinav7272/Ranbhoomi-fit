import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { getSiteData, newId, saveSiteData } from "@/lib/store";

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
  data.achievements.push({ id: newId(), title, body: text });
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, achievements: data.achievements });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  data.achievements = data.achievements.filter((item) => item.id !== id);
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, achievements: data.achievements });
}
