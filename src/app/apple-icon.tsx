import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/app-icon";

/** Icon used when the site is added to an iPhone or iPad home screen. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<AppIcon size={size.width} />, size);
}
