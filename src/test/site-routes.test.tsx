import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { search } from "@/lib/search";

const PATHS = [
  "/kvartiry",
  "/doma",
  "/stroitelstvo",
  "/remont",
  "/materialy",
  "/kalkulyatory",
  "/kalkulyatory/oboi",
  "/instruktsii",
  "/instruktsii/kak-pokleit-oboi",
  "/spravochnik",
  "/poisk",
  "/o-proekte",
  "/stati",
  "/stati/vybor-fundamenta",
  "/kvartiry/steny",
  "/doma/fundament",
  "/materialy/gazobeton",
  "/kalkulyatory/kraska",
  "/kalkulyatory/beton",
];

describe("site routes", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  it.each(PATHS)("%s has its own page", (p) => {
    expect(router.matchRoutes(p).at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("search finds the wallpaper term regardless of ё", () => {
    expect(search("раппорт").some((h) => h.title === "Раппорт")).toBe(true);
    expect(search("штукатурка")[0]?.title).toBe("Штукатурка");
  });
  it("search filters by direction and type", () => {
    const houses = search("фундамент", { direction: "doma" });
    expect(houses.length).toBeGreaterThan(0);
    expect(houses.every((h) => h.directions.includes("doma"))).toBe(true);
    expect(search("фундамент", { type: "calculator" }).every((h) => h.type === "calculator")).toBe(
      true,
    );
  });
});
