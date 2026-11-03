import type { Category, Content } from "./types";

/** Единственное место, где из slug строится URL. Возвращает null, если у сущности нет своей страницы. */
export function urlFor(c: Content | Category): string | null {
  if ("direction" in c) return `/${c.direction}/${c.slug}`;
  switch (c.kind) {
    case "article":
      return `/stati/${c.slug}`;
    case "guide":
      return `/instruktsii/${c.slug}`;
    case "material":
      return `/materialy/${c.slug}`;
    case "term":
      return `/spravochnik#${c.slug}`;
    case "calculator":
      return c.status === "published" ? `/kalkulyatory/${c.slug}` : null;
  }
}
