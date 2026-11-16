import { validateContact } from "@/lib/contact-schema";
import { DeliveryError, getDelivery } from "@/lib/contact-delivery";
import { clientIp, createRateLimit } from "@/lib/rate-limit";

const json = (body: unknown, status: number, headers?: HeadersInit) => Response.json(body, { status, headers });

/** Largest body accepted. A full form with a 2,000-character message is ~3 KB. */
const MAX_BODY_BYTES = 16 * 1024;

/** Any request to this endpoint, valid or not. */
const anyRequest = createRateLimit({ limit: 30, windowMs: 60_000 });
/** Valid inquiries, the ones that would be delivered. */
const inquiries = createRateLimit({ limit: 5, windowMs: 10 * 60_000 });

/**
 * Only the site's own pages may post here. Browsers always send Origin on a
 * POST from fetch; a request with another origin, or with neither Origin nor
 * Sec-Fetch-Site (scripts, other servers), is refused.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    try {
      return !!host && new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

/**
 * POST /api/contact
 * 200 sent · 400 malformed or honeypot · 403 other origin · 413 too large ·
 * 415 not JSON · 422 invalid fields · 429 too many requests ·
 * 502 delivery failed · 503 no delivery channel configured (see .env.example)
 * Never reports a success that did not happen.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!anyRequest(ip)) return json({ error: "rate_limited" }, 429, { "Retry-After": "60" });

  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);

  const type = request.headers.get("content-type") ?? "";
  if (!/^application\/json\s*(;|$)/i.test(type)) return json({ error: "unsupported_media_type" }, 415);

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
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

  if (!inquiries(ip)) return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });

  const deliver = getDelivery();
  if (!deliver) return json({ error: "not_configured" }, 503);

  try {
    await deliver(result.data, body.locale === "en" ? "en" : "es");
    return json({ ok: true }, 200);
  } catch (error) {
    // Our own errors carry only a status code; anything else (a network
    // error, a timeout) is logged by name, since its message could include
    // the webhook URL.
    const detail = error instanceof DeliveryError ? error.message : error instanceof Error ? error.name : "unknown";
    console.error("[contact] delivery failed:", detail);
    return json({ error: "delivery_failed" }, 502);
  }
}
