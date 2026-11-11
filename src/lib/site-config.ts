/**
 * Public, optional contact channels. Nothing is rendered for a value that is
 * not configured, so the page never shows an invented address or number.
 */
const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const siteConfig = {
  name: "AIO9",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  contactEmail: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** Digits only, international format, e.g. 50212345678 */
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
} as const;
