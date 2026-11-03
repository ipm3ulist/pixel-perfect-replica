import { ALL_CONTENT } from "./index";
import { CATEGORIES, TAGS } from "./taxonomy";
import type { Category, Content } from "./types";
import { urlFor } from "./urls";

/** Проверяет целостность модели. Возвращает список ошибок (пустой — всё в порядке). */
export function validateContent(
  content: Content[] = ALL_CONTENT,
  categories: Category[] = CATEGORIES,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const urls = new Map<string, string>();
  const seoTitles = new Map<string, string>();
  const catIds = new Set(categories.map((c) => c.id));
  const subIds = new Set(categories.flatMap((c) => c.subcategories.map((s) => s.id)));
  const tagIds = new Set(TAGS.map((t) => t.id));
  const allIds = new Set(content.map((c) => c.id));

  const claim = (id: string, url: string | null) => {
    if (ids.has(id)) errors.push(`Повтор ID: ${id}`);
    ids.add(id);
    if (!url) return;
    const prev = urls.get(url);
    if (prev) errors.push(`URL ${url} занят: ${prev} и ${id}`);
    urls.set(url, id);
  };
  const seo = (id: string, published: boolean, s?: { title: string; description: string }) => {
    if (!published) return;
    if (!s?.title.trim() || !s.description.trim()) errors.push(`${id}: нет SEO title/description`);
    else {
      const prev = seoTitles.get(s.title);
      if (prev) errors.push(`SEO title «${s.title}» повторяется: ${prev} и ${id}`);
      seoTitles.set(s.title, id);
    }
  };

  for (const c of categories) {
    claim(c.id, urlFor(c));
    seo(c.id, c.status === "published", c.seo);
    const subs = new Set<string>();
    for (const s of c.subcategories) {
      if (subs.has(s.slug)) errors.push(`${c.id}: повтор подкатегории ${s.slug}`);
      subs.add(s.slug);
    }
    for (const r of c.related ?? [])
      if (!catIds.has(r)) errors.push(`${c.id}: нет связанной категории ${r}`);
  }

  for (const c of content) {
    claim(c.id, urlFor(c));
    const published = c.status === "published";
    if (c.kind !== "term") seo(c.id, published, c.seo);
    if (c.kind !== "term" && !published && c.kind !== "calculator") continue;

    if ("categories" in c) {
      for (const cat of c.categories)
        if (!catIds.has(cat)) errors.push(`${c.id}: нет категории ${cat}`);
      if (c.kind !== "calculator" && c.categories.length === 0)
        errors.push(`${c.id}: не привязан ни к одной категории`);
    }
    if ("primaryCategory" in c && !c.categories.includes(c.primaryCategory))
      errors.push(`${c.id}: основная категория не входит в categories`);
    if ("subcategories" in c)
      for (const s of c.subcategories ?? []) {
        if (!subIds.has(s)) errors.push(`${c.id}: нет подкатегории ${s}`);
        else if (!c.categories.some((cat) => s.startsWith(cat + ".")))
          errors.push(`${c.id}: подкатегория ${s} вне её категорий`);
      }
    if ("tags" in c)
      for (const t of c.tags ?? []) if (!tagIds.has(t)) errors.push(`${c.id}: нет тега ${t}`);
    for (const r of c.related ?? []) {
      if (!allIds.has(r)) errors.push(`${c.id}: связь на несуществующий ${r}`);
      if (r === c.id) errors.push(`${c.id}: ссылается сам на себя`);
    }
    if (c.kind === "guide" && c.calculator && !allIds.has(c.calculator))
      errors.push(`${c.id}: нет калькулятора ${c.calculator}`);
  }
  return errors;
}

/** URL всех опубликованных страниц — источник для будущего sitemap. */
export function publishedUrls(
  content: Content[] = ALL_CONTENT,
  categories: Category[] = CATEGORIES,
): string[] {
  return [...categories, ...content]
    .filter((c) => c.status === "published" && !("kind" in c && c.kind === "term"))
    .map((c) => urlFor(c))
    .filter((u): u is string => !!u);
}
