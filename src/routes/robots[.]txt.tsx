import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/site";
import { sitePath } from "@/lib/base";

/** robots.txt: открыт весь публичный контент, закрыты результаты поиска и служебные адреса. */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE.url || new URL(request.url).origin;
        const body = [
          "User-agent: *",
          "Allow: /",
          `Disallow: ${sitePath("/poisk")}`,
          "",
          `Sitemap: ${origin}${sitePath("/sitemap.xml")}`,
          "",
        ].join("\n");
        return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
