/**
 * Single entry point for product analytics. No provider is installed yet:
 * connect one here (and document it in the README) instead of sprinkling
 * vendor snippets through components.
 */
export type AnalyticsEvent =
  | { name: "industry_view"; industry: string }
  | { name: "demo_replay"; industry: string }
  | { name: "contact_submit"; outcome: "sent" | "error" | "not_configured" };

export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
}
