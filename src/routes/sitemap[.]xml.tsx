import { createFileRoute } from "@tanstack/react-router";
import { sitemapEntries } from "@/lib/sitemap";
import { SITE } from "@/data/site";
import { sitePath } from "@/lib/base";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE.url || new URL(request.url).origin;
        const urls = sitemapEntries()
          .map(
            (e) =>
              `<url><loc>${origin}${sitePath(e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
          )
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
