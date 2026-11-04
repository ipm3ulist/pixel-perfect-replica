import type { CategoryId, ContentId } from "@/content";

/**
 * Страница помещения квартиры. Весь текст уникален для комнаты;
 * цены в рублях не указываются — только состав расходов и уровни бюджета.
 */
export type Room = {
  slug: string;
  title: string;
  /** Родительный падеж для заголовков: «ремонт гостиной». */
  genitive: string;
  group: "main" | "extra";
  lead: string;
  seo: { title: string; description: string };
  purpose: string;
  layout: string[];
  floor: string;
  wallsCeiling: string;
  lighting: string;
  furniture: string;
  engineering?: string;
  ventilationNoise?: string;
  mistakes: string[];
  budget: { drivers: string[]; basic: string; mid: string; upper: string };
  content: ContentId[];
  calcs: ContentId[];
  categories: CategoryId[];
  neighbours: string[];
};
