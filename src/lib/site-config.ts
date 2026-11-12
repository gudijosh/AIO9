/**
 * Public, optional contact channels. Nothing is rendered for a value that is
 * not configured, so the page never shows an invented address or number.
 */
const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/**
 * Public origin of the site. An explicit NEXT_PUBLIC_SITE_URL wins; on Vercel
 * it falls back to the production domain (or the preview URL), so canonical
 * links, Open Graph and the sitemap are right even before it is configured.
 */
function resolveSiteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/+$/, "");
  const production = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (production && process.env.VERCEL_ENV === "production") return `https://${production}`;
  const deployment = clean(process.env.VERCEL_URL);
  if (deployment) return `https://${deployment}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "AIO9",
  url: resolveSiteUrl(),
  contactEmail: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** Digits only, international format, e.g. 50212345678 */
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
} as const;
