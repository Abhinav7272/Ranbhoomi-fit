import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { getSiteData, saveSiteData } from "@/lib/store";

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    mission?: { title?: string; body?: string };
    vision?: { title?: string; body?: string };
  } | null;

  const data = await getSiteData();
  if (body?.mission) {
    if (body.mission.title?.trim()) data.mission.title = body.mission.title.trim();
    if (body.mission.body?.trim()) data.mission.body = body.mission.body.trim();
  }
  if (body?.vision) {
    if (body.vision.title?.trim()) data.vision.title = body.vision.title.trim();
    if (body.vision.body?.trim()) data.vision.body = body.vision.body.trim();
  }

  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, mission: data.mission, vision: data.vision });
}
