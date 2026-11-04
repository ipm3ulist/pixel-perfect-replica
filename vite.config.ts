import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import prerenderPages from "./src/lib/prerender-pages.json";

const BASE = "/";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    router: { basepath: BASE },
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
