import { getContent } from "@/content";
import { AFFILIATE_ENABLED, SHOW_DEMO } from "./config";
import { CATALOG, COMPARISONS } from "./data/catalog";
import { DEMO_PRODUCTS, PRODUCTS } from "./data/products";
import { STORES } from "./data/stores";
import type { CatalogSectionId, Product, Store } from "./types";

type Opts = {
  products?: Product[];
  stores?: Store[];
  enabled?: boolean;
  showDemo?: boolean;
  today?: string;
};

/** Реальный товар показывается только: программа включена, магазин подключён, есть erid, не истёк. */
export function isLive(p: Product, stores: Store[], today: string) {
  const store = stores.find((s) => s.id === p.storeId);
  return (
    !p.demo && !!p.erid?.trim() && store?.status === "connected" && (!p.until || p.until >= today)
  );
}

export function productsFor(section: CatalogSectionId, o: Opts = {}) {
  const {
    products = PRODUCTS,
    stores = STORES,
    enabled = AFFILIATE_ENABLED,
    showDemo = SHOW_DEMO,
    today = new Date().toISOString().slice(0, 10),
  } = o;
  const live = enabled
    ? products.filter((p) => p.section === section && isLive(p, stores, today))
    : [];
  if (live.length || !showDemo) return live;
  return DEMO_PRODUCTS.filter((p) => p.section === section);
}

/** Цена выводится только с источником и датой проверки. */
export const displayPrice = (p: Product) =>
  p.price && p.price.source.trim() && p.price.checkedAt ? p.price : undefined;

/** Ошибки целостности коммерческих данных. Пустой массив = всё корректно. */
export function validateMonetization(products: Product[] = PRODUCTS, stores: Store[] = STORES) {
  const errors: string[] = [];
  const sections = new Set(CATALOG.map((s) => s.id));
  for (const p of products) {
    if (p.demo) errors.push(`${p.id}: демо-товар в списке реальных`);
    if (!stores.some((s) => s.id === p.storeId))
      errors.push(`${p.id}: неизвестный магазин ${p.storeId}`);
    if (!sections.has(p.section)) errors.push(`${p.id}: неизвестный раздел`);
    if (!p.erid?.trim()) errors.push(`${p.id}: нет erid`);
    if (!/^https:\/\//.test(p.url)) errors.push(`${p.id}: ссылка должна быть https`);
    if (p.price && (!p.price.source.trim() || !p.price.checkedAt))
      errors.push(`${p.id}: цена без источника`);
  }
  for (const s of CATALOG) {
    for (const id of [...(s.materials ?? []), ...(s.calculators ?? []), ...(s.content ?? [])])
      if (!getContent(id)) errors.push(`раздел ${s.id}: нет записи ${id}`);
  }
  for (const c of COMPARISONS)
    for (const id of c.materials)
      if (!getContent(id)) errors.push(`сравнение ${c.slug}: нет ${id}`);
  return errors;
}
