import { describe, expect, it } from "vitest";
import { sitemapEntries } from "./sitemap";
import { ARTICLES } from "@/content/articles";

describe("sitemap", () => {
  const paths = sitemapEntries().map((e) => e.path);
  it("includes categories, articles, materials and calculators", () => {
    expect(paths).toContain("/kvartiry/vannaya");
    expect(paths).toContain("/stati/vybor-fundamenta");
    expect(paths).toContain("/materialy/laminat");
    expect(paths).toContain("/kalkulyatory/plitka");
  });
  it("excludes drafts, search and planned calculators", () => {
    expect(paths).not.toContain("/stati/gidroizolyatsiya-mokryh-zon");
    expect(paths).not.toContain("/poisk");
    expect(paths).not.toContain("/kalkulyatory/krovlya");
  });
  it("has no duplicate URLs", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("first-wave content volume meets the brief", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(25);
  });
});
