import { describe, expect, it } from "vitest";
import { REGIONS, FEDERAL_DISTRICTS, isRegionIndexable } from "./regions";
import { sitemapEntries } from "@/lib/sitemap";

describe("regions", () => {
  it("covers all 18 subjects of the Central Federal District", () => {
    expect(REGIONS).toHaveLength(18);
    expect(new Set(REGIONS.map((r) => r.slug)).size).toBe(18);
    expect(new Set(REGIONS.map((r) => r.tile.join())).size).toBe(18);
  });
  it("каждый регион относится к одному из восьми федеральных округов", () => {
    for (const r of REGIONS) {
      expect(FEDERAL_DISTRICTS).toContain(r.federalDistrict);
    }
  });

  it("regions without verified content stay out of the sitemap", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain("/region");
    for (const r of REGIONS) expect(paths.includes(`/region/${r.slug}`)).toBe(isRegionIndexable(r));
  });
  it("legal pages are in the sitemap", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain("/dokumenty/politika-konfidentsialnosti");
    expect(paths).toContain("/dokumenty/politika-cookies");
  });
});
