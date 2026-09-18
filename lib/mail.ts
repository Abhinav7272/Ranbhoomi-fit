import { SITE } from "@/lib/site";
import type { JoinBooking } from "@/lib/booking";

export async function sendJoinMail(to: string, input: JoinBooking) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const inbox = to.trim() || SITE.email;
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
