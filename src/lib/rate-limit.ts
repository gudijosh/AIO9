import "server-only";

/**
 * Fixed-window counters per key, kept in this server instance's memory.
 *
 * On Vercel each function instance has its own memory, so this is a partial
 * defence: it stops a single client hammering one instance, not a
 * distributed flood. The firm limit is a Vercel Firewall rate-limit rule on
 * /api/contact (docs/SECURITY.md).
 */
export function createRateLimit({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function take(key: string, now = Date.now()): boolean {
    // Bound memory: drop expired windows once the map grows.
    if (hits.size > 2000) {
      for (const [k, entry] of hits) if (entry.resetAt <= now) hits.delete(k);
      if (hits.size > 5000) hits.clear();
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/** The client's IP as seen by the platform's proxy, or "unknown". */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}
