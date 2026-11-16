import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy with a fresh nonce on every page view.
 *
 * Next.js reads the nonce from the request's CSP header while rendering and
 * puts it on its own scripts; `'strict-dynamic'` lets those scripts load the
 * rest of the app's chunks (the bot, for instance). Any other script, inline
 * or from another origin, is blocked. Because the nonce changes per request,
 * the pages render on demand instead of being prebuilt
 * (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 *
 * Styles: elements (<style>, <link>) need the nonce or this origin; the
 * `style=""` attributes that Motion and a few components set are allowed.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV === "development";
  const https = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";

  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    // Browsers without style-src-elem/-attr fall back to this line.
    "style-src 'self' 'unsafe-inline'",
    `style-src-elem 'self' 'nonce-${nonce}'${dev ? " 'unsafe-inline'" : ""}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self'",
    "font-src 'self'",
    `connect-src 'self'${dev ? " ws:" : ""}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: not the API, Next's assets, public files or metadata routes.
      source:
        "/((?!api/|_next/static|_next/image|images/|videos/|fonts/|favicon|icon|apple-icon|robots.txt|sitemap.xml|llms|.*opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
