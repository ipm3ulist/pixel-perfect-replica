import { CATALOG, COMPARISONS } from "@/monetization/data/catalog";
import { ALL_CONTENT, CATEGORIES } from "@/content";
import { publishedUrls } from "@/content/validate";
import { LEGAL_DOCS, LEGAL_UPDATED } from "@/data/legal";
import { REGIONS, isRegionIndexable } from "@/data/regions";

/** Статические страницы со своим содержимым. /poisk исключён: это noindex-страница результатов. */
export const STATIC_PATHS = [
  "/",
  "/kvartiry",
  "/doma",
  "/stroitelstvo",
  "/remont",
  "/materialy",
  "/stati",
  "/kalkulyatory",
  "/kalkulyatory/oboi",
  "/instruktsii",
  "/spravochnik",
  "/o-proekte",
  "/katalog",
  ...CATALOG.map((c) => `/katalog/${c.id}`),
  ...COMPARISONS.map((c) => `/sravnenie/${c.slug}`),
  "/zayavka",
  "/reklama",
  "/doma/konfigurator",
  "/doma/smeta",
  "/doma/proekty",
  "/region",
  ...REGIONS.filter(isRegionIndexable).map((r) => `/region/${r.slug}`),
  "/dokumenty",
  ...LEGAL_DOCS.map((d) => `/dokumenty/${d.slug}`),
];

/**
 * Все URL для sitemap: статические + опубликованный контент из модели.
 * lastmod — только из реальной даты изменения материала (updatedAt), никогда не дата сборки.
 */
export function sitemapEntries(): { path: string; lastmod?: string | undefined }[] {
  const dates = new Map<string, string>();
  for (const c of ALL_CONTENT)
    if ("updatedAt" in c && c.updatedAt) {
      const kind = c.kind === "article" ? "stati" : c.kind === "material" ? "materialy" : null;
      if (kind) dates.set(`/${kind}/${c.slug}`, c.updatedAt);
    }
  for (const r of REGIONS) if (isRegionIndexable(r)) dates.set(`/region/${r.slug}`, r.updatedAt);
  for (const d of LEGAL_DOCS) dates.set(`/dokumenty/${d.slug}`, LEGAL_UPDATED);
  const all = [...new Set([...STATIC_PATHS, ...publishedUrls(ALL_CONTENT, CATEGORIES)])];
  return all.map((path) => ({ path, ...(dates.has(path) ? { lastmod: dates.get(path) } : {}) }));
}
