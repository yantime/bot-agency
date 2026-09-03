import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Sólo las rutas públicas. /login y /dashboard van con noindex, así que no
// entran acá: un sitemap que lista URLs no indexables es una señal contradictoria.
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/registro`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
