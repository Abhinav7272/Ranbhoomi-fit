import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/api";
import { getSiteData, newId, saveSiteData } from "@/lib/store";
import type { ClassGroup, SlotKind } from "@/lib/types";

type Action =
  | "add-slot"
  | "remove-slot"
  | "update-slot"
  | "move-slot"
  | "update"
  | "move-group";

type Body = {
  classId?: string;
  action?: Action;
  slotId?: string;
  time?: string;
  kind?: SlotKind;
  name?: string;
  days?: string;
  note?: string;
  eitherOr?: boolean;
  direction?: "up" | "down";
};

function kindOf(value: unknown): SlotKind {
  return value === "evening" ? "evening" : "morning";
}

function swap<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return false;
  const copy = list[from];
  list[from] = list[to];
  list[to] = copy;
  return true;
}

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data.classes);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    days?: string;
    note?: string;
    eitherOr?: boolean;
  } | null;

  const name = body?.name?.trim();
  const days = body?.days?.trim();
  if (!name || !days) {
    return NextResponse.json({ error: "Name and days are required" }, { status: 400 });
  }

  const data = await getSiteData();
  data.classes.push({
    id: newId(),
    name,
    days,
    note: body?.note?.trim() ?? "",
    eitherOr: Boolean(body?.eitherOr),
    slots: [],
  });
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, classes: data.classes });
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as Body | null;
  const classId = body?.classId;
  const action = body?.action;
  if (!classId || !action) {
    return NextResponse.json({ error: "Missing classId or action" }, { status: 400 });
  }

  const data = await getSiteData();
  const groupIndex = data.classes.findIndex((item) => item.id === classId);
  if (groupIndex < 0) return NextResponse.json({ error: "Class not found" }, { status: 404 });
  const group = data.classes[groupIndex] as ClassGroup;

  if (action === "add-slot") {
    const time = body.time?.trim();
    if (!time) return NextResponse.json({ error: "Time is required" }, { status: 400 });
    group.slots.push({
      id: newId(),
      time,
      kind: kindOf(body.kind),
    });
  } else if (action === "remove-slot") {
    if (!body.slotId) return NextResponse.json({ error: "Missing slotId" }, { status: 400 });
    group.slots = group.slots.filter((slot) => slot.id !== body.slotId);
  } else if (action === "update-slot") {
    const slot = group.slots.find((item) => item.id === body.slotId);
    if (!slot) return NextResponse.json({ error: "Time not found" }, { status: 404 });
    if (typeof body.time === "string") {
      const time = body.time.trim();
      if (!time) return NextResponse.json({ error: "Time is required" }, { status: 400 });
      slot.time = time;
    }
    if (body.kind === "morning" || body.kind === "evening") slot.kind = body.kind;
  } else if (action === "move-slot") {
    const from = group.slots.findIndex((item) => item.id === body.slotId);
    if (from < 0) return NextResponse.json({ error: "Time not found" }, { status: 404 });
    const to = body.direction === "up" ? from - 1 : from + 1;
    if (!swap(group.slots, from, to)) {
      return NextResponse.json({ ok: true, classes: data.classes });
    }
  } else if (action === "update") {
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      group.name = name;
    }
    if (typeof body.days === "string") {
      const days = body.days.trim();
      if (!days) return NextResponse.json({ error: "Days are required" }, { status: 400 });
      group.days = days;
    }
    if (typeof body.note === "string") group.note = body.note.trim();
    if (typeof body.eitherOr === "boolean") group.eitherOr = body.eitherOr;
  } else if (action === "move-group") {
    const to = body.direction === "up" ? groupIndex - 1 : groupIndex + 1;
    if (!swap(data.classes, groupIndex, to)) {
      return NextResponse.json({ ok: true, classes: data.classes });
    }
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, classes: data.classes });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await getSiteData();
  data.classes = data.classes.filter((item) => item.id !== id);
  try {
    await saveSiteData(data);
  } catch (error) {
    return fail(error);
  }
  return NextResponse.json({ ok: true, classes: data.classes });
}
