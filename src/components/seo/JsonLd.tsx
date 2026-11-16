import { headers } from "next/headers";

/**
 * Renders schema.org data as a JSON-LD script, the way the Next.js guide
 * recommends (node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
 * The data is our own, never visitor input, and "<" is escaped so the JSON
 * can't close the script tag. It carries the request's CSP nonce.
 */
export async function JsonLd({ data }: { data: object }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
