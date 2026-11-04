import { describe, expect, it } from "vitest";
import { getCategory, getContent } from "@/content";
import { sitemapEntries } from "@/lib/sitemap";
import { ROOMS, getRoom } from "./index";

describe("помещения квартиры", () => {
  it("21 помещение: 10 основных и 11 дополнительных", () => {
    expect(ROOMS).toHaveLength(21);
    expect(ROOMS.filter((r) => r.group === "main")).toHaveLength(10);
    expect(ROOMS.filter((r) => r.group === "extra")).toHaveLength(11);
  });

  it("slug и SEO-заголовки уникальны", () => {
    expect(new Set(ROOMS.map((r) => r.slug)).size).toBe(21);
    expect(new Set(ROOMS.map((r) => r.seo.title)).size).toBe(21);
  });

  it("тексты не копируются между страницами", () => {
    const fields = ROOMS.flatMap((r) => [r.purpose, r.floor, r.wallsCeiling, r.lighting, r.furniture, ...r.mistakes]);
    expect(new Set(fields).size).toBe(fields.length);
  });

  it("все ссылки на материалы, категории и соседей существуют", () => {
    for (const r of ROOMS) {
      for (const id of [...r.content, ...r.calcs]) expect(getContent(id), `${r.slug} → ${id}`).toBeTruthy();
      for (const id of r.categories) expect(getCategory(id), `${r.slug} → ${id}`).toBeTruthy();
      for (const n of r.neighbours) expect(getRoom(n), `${r.slug} → ${n}`).toBeTruthy();
    }
  });

  it("в текстах нет цен в рублях", () => {
    const s = JSON.stringify(ROOMS);
    expect(s.includes("₽")).toBe(false);
    const words = s.toLowerCase().split(/[^а-яё]+/u);
    expect(words.filter((w) => w.startsWith("руб"))).toEqual([]);
  });

  it("каждое помещение есть в sitemap", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain("/kvartiry/pomeshcheniya");
    for (const r of ROOMS) expect(paths).toContain(`/kvartiry/pomeshcheniya/${r.slug}`);
  });
});
