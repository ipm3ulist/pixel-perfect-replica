import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { sitemapEntries } from "./sitemap";
import { sitePath } from "./base";
import pages from "./prerender-pages.json";

/**
 * Список страниц для статической сборки (GitHub Pages) хранится в JSON, потому что
 * vite.config не может импортировать модель контента. Этот тест держит его в синхронизации
 * с sitemap. Обновить: PRERENDER_WRITE=1 bunx vitest run src/lib/prerender-pages.test.ts
 */
const expected = [
  ...sitemapEntries().map((e) => e.path),
  "/poisk",
  "/sitemap.xml",
  "/robots.txt",
].filter((p, i, a) => a.indexOf(p) === i);

describe("prerender pages", () => {
  it("совпадает с sitemap (все страницы попадают в статическую сборку)", () => {
    if (process.env["PRERENDER_WRITE"]) {
      writeFileSync(
        `${process.cwd()}/src/lib/prerender-pages.json`,
        JSON.stringify(expected, null, 2) + "\n",
      );
      return;
    }
    expect(pages).toEqual(expected);
  });

  it("страницы получают слэш в конце, файлы — нет", () => {
    expect(sitePath("/kvartiry")).toBe("/kvartiry/");
    expect(sitePath("/")).toBe("/");
    expect(sitePath("/sitemap.xml")).toBe("/sitemap.xml");
    expect(sitePath("/spravochnik#lag")).toBe("/spravochnik/#lag");
  });
});
