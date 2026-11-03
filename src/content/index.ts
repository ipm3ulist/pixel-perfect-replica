import {
  ARTICLE_ENTRIES,
  CALCULATOR_ENTRIES,
  GUIDE_ENTRIES,
  MATERIAL_ENTRIES,
  TERM_ENTRIES,
} from "./entries";
import { CATEGORIES, TAGS } from "./taxonomy";
import type { Category, CategoryId, Content, ContentId, DirectionId } from "./types";

export * from "./types";
export { CATEGORIES, DIRECTIONS, TAGS } from "./taxonomy";
export { urlFor } from "./urls";

export const ALL_CONTENT: Content[] = [
  ...ARTICLE_ENTRIES,
  ...GUIDE_ENTRIES,
  ...MATERIAL_ENTRIES,
  ...TERM_ENTRIES,
  ...CALCULATOR_ENTRIES,
];

export const isPublished = (c: { status: string }) => c.status === "published";
export const PUBLISHED: Content[] = ALL_CONTENT.filter(isPublished);

const byId = new Map<string, Content>(ALL_CONTENT.map((c) => [c.id, c]));
const catById = new Map<string, Category>(CATEGORIES.map((c) => [c.id, c]));

export const getContent = (id: ContentId) => byId.get(id);
export const getCategory = (id: CategoryId) => catById.get(id);
export const categoriesOf = (d: DirectionId) => CATEGORIES.filter((c) => c.direction === d);
export const getTag = (id: string) => TAGS.find((t) => t.id === id);

/** Опубликованный контент, привязанный к категории (одна запись может быть в нескольких категориях). */
export const contentInCategory = (id: CategoryId) =>
  PUBLISHED.filter((c) => "categories" in c && (c.categories as string[]).includes(id));

export const relatedOf = (c: Content) =>
  (c.related ?? []).map((id) => byId.get(id)).filter((x): x is Content => !!x && isPublished(x));
