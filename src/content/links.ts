import { PUBLISHED, getCategory } from "./index";
import type { Category, Content } from "./types";

/**
 * «Следующий шаг» для материала: калькуляторы и материалы из тех же категорий,
 * связанные разделы (технологии) и категория для поиска исполнителя.
 * Чистая функция — покрыта тестом.
 */
export function nextSteps(item: Content, limit = 4) {
  const cats = "categories" in item ? (item.categories as string[]) : [];
  const shares = (x: Content) =>
    x.id !== item.id && "categories" in x && (x.categories as string[]).some((c) => cats.includes(c));
  const pick = (kind: Content["kind"]) => PUBLISHED.filter((x) => x.kind === kind && shares(x)).slice(0, limit);

  const own = new Set(cats);
  const technologies: Category[] = [];
  for (const id of cats) {
    for (const r of getCategory(id as Category["id"])?.related ?? []) {
      const c = getCategory(r);
      if (c && c.status === "published" && !own.has(c.id) && !technologies.some((t) => t.id === c.id))
        technologies.push(c);
    }
  }
  return {
    calculators: pick("calculator"),
    materials: pick("material"),
    technologies: technologies.slice(0, limit),
    /** Направление работ для заявки исполнителю. */
    workType: cats[0]?.startsWith("doma.") ? ("stroitelstvo" as const) : ("remont" as const),
  };
}
