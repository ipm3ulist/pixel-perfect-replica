import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import prerenderPages from "./src/lib/prerender-pages.json";

/**
 * GitHub Pages публикует сайт в подпапке репозитория. Путь берётся из BASE_PATH
 * (его выставляет workflow из настроек Pages), иначе — имя репозитория по умолчанию.
 * В Lovable сайт живёт в корне.
 */
const BASE =
  process.env["GITHUB_PAGES"] === "true"
    ? `/${(process.env["BASE_PATH"] ?? "/pixel-perfect-replica").replace(/^\/+|\/+$/g, "")}/`.replace(
        /^\/\/$/,
        "/",
      )
    : "/";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Роутер и пререндер должны знать подпапку, иначе страницы уходят в цикл перенаправлений.
    router: { basepath: BASE },
    // Полный список из модели контента (синхронизируется тестом prerender-pages.test.ts).
    pages: prerenderPages.map((path) => ({ path })),
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      failOnError: true,
    },
  },
  vite: {
    base: BASE,
    optimizeDeps: {
      include: ["lucide-react", "@radix-ui/react-label"],
    },
  },
});
