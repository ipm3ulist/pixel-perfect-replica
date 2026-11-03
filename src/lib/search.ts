import {
  CATEGORIES,
  DIRECTIONS,
  PUBLISHED,
  getCategory,
  urlFor,
  type CategoryId,
  type Content,
  type DirectionId,
} from "@/content";
import { SECTIONS } from "@/data/sections";

export type HitType =
  "category" | "article" | "guide" | "material" | "term" | "calculator" | "section";

export const HIT_LABEL: Record<HitType, string> = {
  category: "Категория",
  article: "Статья",
  guide: "Инструкция",
  material: "Материал",
  term: "Термин",
  calculator: "Калькулятор",
  section: "Раздел",
};

export type SearchHit = {
  type: HitType;
  /** Сохранено для совместимости: человекочитаемая метка типа. */
  kind: string;
  title: string;
  text: string;
  href: string;
  directions: DirectionId[];
};

const dirsOf = (cats: CategoryId[] = []) => [
  ...new Set(cats.map((c) => getCategory(c)?.direction).filter((d): d is DirectionId => !!d)),
];

function contentHit(c: Content): SearchHit | null {
  const href = urlFor(c);
  if (!href) return null;
  const cats = "categories" in c ? c.categories : [];
  let text = c.kind === "term" ? c.definition : c.description;
  if (c.kind === "article" || c.kind === "material")
    text +=
      " " +
      c.content
        .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
        .join(" ");
  if (c.kind === "guide") text += " " + c.steps.map((s) => `${s.title} ${s.text}`).join(" ");
  return {
    type: c.kind,
    kind: HIT_LABEL[c.kind],
    title: c.title,
    text,
    href,
    directions: c.kind === "term" ? ["kvartiry", "doma"] : dirsOf(cats),
  };
}

function buildIndex(): SearchHit[] {
  const out: SearchHit[] = [];
  for (const c of CATEGORIES.filter((c) => c.status === "published"))
    out.push({
      type: "category",
      kind: HIT_LABEL.category,
      title: `${c.title} · ${DIRECTIONS[c.direction].title}`,
      text: `${c.description} ${c.subcategories.map((s) => s.title).join(" ")}`,
      href: urlFor(c)!,
      directions: [c.direction],
    });
  for (const s of Object.values(SECTIONS))
    for (const t of s.topics)
      out.push({
        type: "section",
        kind: HIT_LABEL.section,
        title: `${s.title}: ${t.title}`,
        text: `${t.text} ${t.points.join(" ")}`,
        href: `/${s.slug}#${t.id}`,
        directions:
          s.slug === "kvartiry" || s.slug === "remont"
            ? ["kvartiry"]
            : s.slug === "materialy"
              ? ["kvartiry", "doma"]
              : ["doma"],
      });
  for (const c of PUBLISHED) {
    const h = contentHit(c);
    if (h) out.push(h);
  }
  return out;
}

const INDEX = buildIndex();

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

export type SearchFilters = { direction?: DirectionId | "all"; type?: HitType | "all" };

/** Каждое слово запроса должно встретиться; совпадения в заголовке весят больше, точное совпадение — больше всего. */
export function search(query: string, filters: SearchFilters = {}): SearchHit[] {
  const q = norm(query.trim());
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return INDEX.filter(
    (h) =>
      (!filters.type || filters.type === "all" || h.type === filters.type) &&
      (!filters.direction ||
        filters.direction === "all" ||
        h.directions.includes(filters.direction)),
  )
    .map((h) => {
      const title = norm(h.title);
      const body = norm(h.text);
      let score = title === q ? 10 : 0;
      for (const w of words) {
        if (title.includes(w)) score += 3;
        else if (body.includes(w)) score += 1;
        else return null;
      }
      return { h, score };
    })
    .filter((x): x is { h: SearchHit; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.h);
}
