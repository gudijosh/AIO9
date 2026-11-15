import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Search engines and AI agents are welcome on every page. They are named
 * explicitly so a future catch-all rule can't shut them out by accident.
 * Only the API stays out (a crawler hint, not access control).
 */
const crawlers = [
  // Search
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  // AI search and assistants
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: crawlers, allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
