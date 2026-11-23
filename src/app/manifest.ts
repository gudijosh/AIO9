import type { MetadataRoute } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";

/** Web app manifest: name, colours and icons when the site is saved to a home screen. */
export default function manifest(): MetadataRoute.Manifest {
  const { meta } = getDictionary("es");
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: meta.description,
    start_url: "/es",
    display: "browser",
    background_color: "#0a0a12",
    theme_color: "#0a0a12",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
