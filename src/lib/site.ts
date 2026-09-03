// URL pública del sitio. Se usa en metadatos, robots.txt y sitemap.xml, así que
// el fallback apunta a producción: un fallback a localhost emitiría URLs rotas
// en el sitemap si la variable faltara en el deploy.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.angiebot.com";
