import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { ALL_CONTENT, CATEGORIES, categoriesOf, contentInCategory } from "./index";
import type { Article, ContentId } from "./types";
import { publishedUrls, validateContent } from "./validate";

const article = (over: Partial<Article>): Article => ({
  id: "article:test",
  kind: "article",
  slug: "test",
  title: "Тест",
  description: "d",
  status: "published",
  seo: { title: "Тест SEO", description: "d" },
  primaryCategory: "kvartiry.steny",
  categories: ["kvartiry.steny", "doma.otdelka"],
  content: [],
  ...over,
});

describe("content model", () => {
  it("current data has no errors", () => {
    expect(validateContent()).toEqual([]);
  });

  it("показывает только опубликованные категории", () => {
    expect(categoriesOf("kvartiry")).toHaveLength(10);
    expect(categoriesOf("doma")).toHaveLength(14);
    expect(categoriesOf("doma").some((c) => c.id === "doma.instrumenty")).toBe(false);
  });

  it("one article in two directions keeps a single URL", () => {
    const a = article({});
    const urls = publishedUrls([a], []);
    expect(urls).toEqual(["/stati/test"]);
  });

  it("detects duplicate URLs", () => {
    const errs = validateContent([article({}), article({ id: "article:test2" })], CATEGORIES);
    expect(errs.some((e) => e.includes("URL /stati/test"))).toBe(true);
  });

  it("detects broken links and unknown categories", () => {
    const errs = validateContent(
      [
        article({
          related: ["guide:net-takoy"] as ContentId[],
          categories: ["kvartiry.net"],
          primaryCategory: "kvartiry.net",
        }),
      ],
      CATEGORIES,
    );
    expect(errs.some((e) => e.includes("guide:net-takoy"))).toBe(true);
    expect(errs.some((e) => e.includes("kvartiry.net"))).toBe(true);
  });

  it("requires SEO fields on published pages", () => {
    const errs = validateContent([article({ seo: { title: "", description: "" } })], CATEGORIES);
    expect(errs.some((e) => e.includes("SEO"))).toBe(true);
  });

  it("drafts stay out of published URLs and category listings", () => {
    expect(publishedUrls()).not.toContain("/stati/gidroizolyatsiya-mokryh-zon");
    expect(contentInCategory("kvartiry.vannaya").map((c) => c.id)).not.toContain(
      "article:gidroizolyatsiya-mokryh-zon",
    );
  });

  it("existing guides appear in both directions", () => {
    expect(contentInCategory("kvartiry.steny").map((c) => c.id)).toContain(
      "guide:kak-pokleit-oboi",
    );
    expect(contentInCategory("doma.otdelka").map((c) => c.id)).toContain("guide:kak-pokleit-oboi");
  });

  it("every published URL that should have a page resolves to a route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const u of publishedUrls())
      expect(router.matchRoutes(u).at(-1)?.routeId, u).not.toBe(rootRouteId);
    expect(ALL_CONTENT.length).toBeGreaterThan(0);
  });
});
