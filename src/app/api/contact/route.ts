import { validateContact } from "@/lib/contact-schema";
import { getDelivery } from "@/lib/contact-delivery";

const json = (body: unknown, status: number) => Response.json(body, { status });

/**
 * POST /api/contact
 * 200 sent · 400 malformed · 422 invalid fields · 502 delivery failed ·
 * 503 no delivery channel configured (see .env.example)
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  // Honeypot field: real visitors never fill it.
  if (typeof body.website === "string" && body.website.length > 0) {
    return json({ error: "rejected" }, 400);
  }

  const result = validateContact(body);
  if (!result.ok) return json({ error: "invalid", errors: result.errors }, 422);

  const deliver = getDelivery();
  if (!deliver) return json({ error: "not_configured" }, 503);

  try {
    await deliver(result.data, body.locale === "en" ? "en" : "es");
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return json({ error: "delivery_failed" }, 502);
  }
}
