import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },

    pages: [
      { path: "/" },
      { path: "/kvartiry" },
      { path: "/doma" },
      { path: "/stroitelstvo" },
      { path: "/remont" },
      { path: "/materialy" },
      { path: "/stati" },
      { path: "/kalkulyatory" },
      { path: "/instruktsii" },
      { path: "/spravochnik" },
      { path: "/o-proekte" },
      { path: "/katalog" },
      { path: "/region" },
      { path: "/dokumenty" },
    ],

    prerender: {
      enabled: true,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      failOnError: true,
    },
  },

  vite: {
    optimizeDeps: {
      include: ["lucide-react", "@radix-ui/react-label"],
    },
  },
});
