import { track as vercelTrack } from "@vercel/analytics";

/**
 * Single entry point for product analytics: Vercel Web Analytics, which
 * uses no cookies and identifies no one. Events carry no personal data.
 * Nothing is recorded unless <Analytics /> is mounted, which the layout
 * does only on Vercel with ENABLE_ANALYTICS=1 (see README); otherwise
 * Vercel's `track` is a no-op.
 */
export type AnalyticsEvent =
  | { name: "industry_view"; industry: string }
  | { name: "demo_replay"; industry: string }
  | { name: "contact_submit"; outcome: "sent" | "error" | "not_configured" };

export function track(event: AnalyticsEvent): void {
  const { name, ...properties } = event;
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
  vercelTrack(name, properties);
}
