import { contactEmail } from "@/data/socials";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(payload: ContactPayload): Promise<string> {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      _replyto: payload.email,
      _subject: `Portfolio message from ${payload.name}`,
      message: payload.message,
      _template: "table",
      _captcha: false,
    }),
  });

  const data = (await response.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
  if (!response.ok) {
    throw new Error(data?.message ?? "Could not send the message.");
  }
  if (typeof data?.success === "string") return data.success;
  return "Message sent. Check your inbox for a reply.";
}

export function openMailtoDraft(payload: ContactPayload) {
  const body = [`Name: ${payload.name}`, `From: ${payload.email}`, "", payload.message].join("\n");
  const href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Portfolio message from ${payload.name}`)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}
