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

export function joinSubject(name: string) {
  return `Query to join first class — ${name}`;
}

export async function sendJoinViaFormsubmit(inbox: string, input: JoinBooking) {
  const subject = joinSubject(input.name);
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _url: typeof window !== "undefined" ? window.location.origin : "",
      title: subject,
      name: input.name,
      phone: input.phone,
      age: input.age,
      gender: input.gender,
      kid_or_adult: input.who,
      activity_level: input.level,
      date_to_start: input.startDate,
      time: input.time,
    }),
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
  const ok = data?.success === true || data?.success === "true";
  const activating = typeof data?.message === "string" && /activat/i.test(data.message);
  if (!ok && !activating) {
    throw new Error("Could not send the booking email");
  }
}
