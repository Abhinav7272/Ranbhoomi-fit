import { NextResponse } from "next/server";
import { fail } from "@/lib/api";
import { sendEventRegistrationMail } from "@/lib/mail";
import { getSiteData } from "@/lib/store";

const PHONE = /^[+0-9][0-9\s-]{8,18}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const eventId = clean(body.eventId, 80);
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const age = Number(body.age);
  const email = clean(body.email, 120);
  const emergency = clean(body.emergency, 80);
  const notes = clean(body.notes, 300);
  const category = clean(body.category, 80);
  const extrasRaw =
    body.extras && typeof body.extras === "object" && !Array.isArray(body.extras)
      ? (body.extras as Record<string, unknown>)
      : {};

  if (!eventId) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Add your name" }, { status: 400 });
  }
  if (!PHONE.test(phone)) {
    return NextResponse.json({ error: "Add a valid phone number" }, { status: 400 });
  }
  if (!Number.isInteger(age) || age < 5 || age > 90) {
    return NextResponse.json({ error: "Add a valid age" }, { status: 400 });
  }
  if (email && !EMAIL.test(email)) {
    return NextResponse.json({ error: "Add a valid email" }, { status: 400 });
  }

  try {
    const data = await getSiteData();
    const event = data.events.find((item) => item.id === eventId);
    if (!event || !event.published) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!event.registrationOpen) {
      return NextResponse.json({ error: "Registration is closed for this event" }, { status: 400 });
    }

    const categoryLabel =
      event.categories.find((item) => item.label === category || item.id === category)?.label ||
      category;
    if (event.categories.length && !categoryLabel) {
      return NextResponse.json({ error: "Choose a category" }, { status: 400 });
    }
    if (event.categories.length && !event.categories.some((item) => item.label === categoryLabel)) {
      return NextResponse.json({ error: "Choose a category" }, { status: 400 });
    }

    const extras: Record<string, string> = {};
    const formFields = Array.isArray(event.formFields) ? event.formFields : [];
    for (const field of formFields) {
      const value = clean(extrasRaw[field.id] ?? extrasRaw[field.label], 120);
      if (field.required && !value) {
        return NextResponse.json({ error: `Add ${field.label}` }, { status: 400 });
      }
      if (field.type === "select" && value && field.options.length && !field.options.includes(value)) {
        return NextResponse.json({ error: `Choose a valid ${field.label}` }, { status: 400 });
      }
      extras[field.label] = value;
    }

    const payload = {
      eventTitle: event.title,
      category: categoryLabel || "General",
      name,
      phone,
      age,
      email,
      emergency,
      notes,
      extras,
    };

    if (process.env.RESEND_API_KEY) {
      await sendEventRegistrationMail(data.joinEmail, payload);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, inbox: data.joinEmail, registration: payload });
  } catch (error) {
    return fail(error);
  }
}
