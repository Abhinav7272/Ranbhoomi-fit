import { SITE } from "@/lib/site";

export type JoinBooking = {
  name: string;
  phone: string;
  age: number;
  gender: string;
  who: string;
  level: string;
  startDate: string;
  time: string;
};

export async function sendJoinMail(input: JoinBooking) {
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

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ranbhoomi <beth.t@example.com>",
        to: [SITE.email],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      throw new Error("Could not send the booking email");
    }
    return;
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: subject,
      name: input.name,
      phone: input.phone,
      age: input.age,
      gender: input.gender,
      kid_or_adult: input.who,
      activity_level: input.level,
      date_to_start: input.startDate,
      time: input.time,
      _subject: subject,
      _template: "table",
      _captcha: "false",
    }),
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
  const ok = data?.success === true || data?.success === "true";
  if (!res.ok || !ok) {
    throw new Error("Could not send the booking email");
  }
}
