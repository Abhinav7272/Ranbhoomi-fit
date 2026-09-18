import { NextResponse } from "next/server";
import { fail } from "@/lib/api";
import { sendJoinMail } from "@/lib/mail";
import { getSiteData } from "@/lib/store";

const PHONE = /^[+0-9][0-9\s-]{8,18}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const GENDERS = new Set(["Female", "Male", "Other"]);
const WHO = new Set(["Adult", "Kid"]);
const LEVELS = new Set(["Beginner", "Intermediate", "Advanced"]);

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (clean(body.website, 80)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const age = Number(body.age);
  const gender = clean(body.gender, 20);
  const who = clean(body.who, 20);
  const level = clean(body.level, 40);
  const startDate = clean(body.startDate, 10);
  const time = clean(body.time, 80) || "First available";

  if (name.length < 2) {
    return NextResponse.json({ error: "Add your name" }, { status: 400 });
  }
  if (!PHONE.test(phone)) {
    return NextResponse.json({ error: "Add a valid phone number" }, { status: 400 });
  }
  if (!Number.isInteger(age) || age < 3 || age > 80) {
    return NextResponse.json({ error: "Add a valid age" }, { status: 400 });
  }
  if (!GENDERS.has(gender)) {
    return NextResponse.json({ error: "Choose a gender" }, { status: 400 });
  }
  if (!WHO.has(who)) {
    return NextResponse.json({ error: "Choose kid or adult" }, { status: 400 });
  }
  if (!LEVELS.has(level)) {
    return NextResponse.json({ error: "Choose an activity level" }, { status: 400 });
  }
  if (!DATE.test(startDate)) {
    return NextResponse.json({ error: "Choose a start date" }, { status: 400 });
  }

  try {
    const data = await getSiteData();
    if (process.env.RESEND_API_KEY) {
      await sendJoinMail(data.joinEmail, { name, phone, age, gender, who, level, startDate, time });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, inbox: data.joinEmail });
  } catch (error) {
    return fail(error);
  }
}
