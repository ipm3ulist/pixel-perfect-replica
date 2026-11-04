import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    basepath: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
    routeTree,
    context: { queryClient },
    // Слэш в конце: каждая страница — папка с index.html, как ждёт GitHub Pages.
    trailingSlash: "always" as "always" | "never" | "preserve",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
