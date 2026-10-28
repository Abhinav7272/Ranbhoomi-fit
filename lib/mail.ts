import { SITE } from "@/lib/site";
import type { JoinBooking } from "@/lib/booking";
import type { EventRegistration } from "@/lib/booking";

async function sendResend(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const inbox = to.trim() || SITE.email;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Ranbhoomi <beth.t@example.com>",
      to: [inbox],
      subject,
      text,
    }),
  });
  if (!res.ok) {
    throw new Error("Could not send the booking email");
  }
}

export async function sendJoinMail(to: string, input: JoinBooking) {
  const subject = `Query to join first class — ${input.name}`;
  const text = [
    "Query to join first class",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Age: ${input.age}`,
    `Gender: ${input.gender}`,
    `Kid or adult: ${input.who}`,
    `Activity level: ${input.level}`,
    `Date to start: ${input.startDate}`,
    `Time: ${input.time}`,
    "",
    "Please confirm this first class with them after you receive the request.",
  ].join("\n");

  await sendResend(to, subject, text);
}

export async function sendEventRegistrationMail(to: string, input: EventRegistration) {
  const subject = `Event registration — ${input.eventTitle} — ${input.name}`;
  const text = [
    "Event registration",
    "",
    `Event: ${input.eventTitle}`,
    `Category: ${input.category}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Age: ${input.age}`,
    `Email: ${input.email || "—"}`,
    `Emergency contact: ${input.emergency || "—"}`,
    `Notes: ${input.notes || "—"}`,
    "",
    "Confirm this registration with them after you receive the request.",
  ].join("\n");

  await sendResend(to, subject, text);
}
