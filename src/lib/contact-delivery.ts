import "server-only";
import type { ContactInput } from "./contact-schema";

type Deliver = (input: ContactInput, locale: string) => Promise<void>;

const env = (name: string) => process.env[name]?.trim() || undefined;

const asText = (input: ContactInput, locale: string) =>
  [
    `Name: ${input.name}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Industry: ${input.industry}`,
    `Language: ${locale}`,
    "",
    input.message,
  ].join("\n");

/**
 * Picks the delivery channel from the environment, or returns null when none
 * is configured — the API then answers 503 and the form says so.
 *
 * 1. Resend (email): RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL
 * 2. Webhook (CRM, Slack, n8n, Zapier…): CONTACT_WEBHOOK_URL
 */
export function getDelivery(): Deliver | null {
  const resendKey = env("RESEND_API_KEY");
  const to = env("CONTACT_TO_EMAIL");
  const from = env("CONTACT_FROM_EMAIL");
  if (resendKey && to && from) {
    return async (input, locale) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: input.email,
          subject: `AIO9 — ${input.company} (${input.industry})`,
          text: asText(input, locale),
        }),
      });
      if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    };
  }

  const webhook = env("CONTACT_WEBHOOK_URL");
  if (webhook) {
    return async (input, locale) => {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "aio9-landing", locale, ...input, text: asText(input, locale) }),
      });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    };
  }

  return null;
}
