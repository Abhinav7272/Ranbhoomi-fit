import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { getSiteData, saveSiteData } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as { joinEmail?: string } | null;
  const joinEmail = String(body?.joinEmail ?? "").trim();
  if (!EMAIL.test(joinEmail)) {
    return NextResponse.json({ error: "Add a valid email" }, { status: 400 });
  }

  const data = await getSiteData();
  data.joinEmail = joinEmail;

  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, joinEmail: data.joinEmail });
}
