import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/app-icon";

/** PNG icons for the web app manifest (Android home screen): /icons/192 and /icons/512. */
const sizes = ["192", "512"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return sizes.map((size) => ({ size }));
}

export async function GET(_request: Request, { params }: RouteContext<"/icons/[size]">) {
  const { size } = await params;
  const px = Number(size);
  if (!sizes.includes(size as (typeof sizes)[number])) return new Response("Not found", { status: 404 });
  return new ImageResponse(<AppIcon size={px} />, {
    width: px,
    height: px,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
