import type { CalculatorId, CategoryId, ContentId, MaterialId } from "@/content";

/**
 * Партнёрское предложение на реальный товар. Добавляется только по факту
 * заключённого договора с реальным магазином. Для рекламы в РФ обязательна
 * маркировка: пометка «Реклама», рекламодатель и токен erid.
 */
export type PartnerOffer = {
  id: string;
  title: string;
  /** Название реального рекламодателя для пометки. */
  advertiser: string;
  url: string;
  /** Идентификатор рекламы (erid) из ОРД. Без него предложение не показывается. */
  erid: string;
  note?: string;
  content?: ContentId[];
  categories?: CategoryId[];
  /** Дата окончания размещения (ISO). */
  until?: string;
};

/** Слот под рекламный блок. Выключен, пока нет договора с рекламной сетью. */
export type AdSlotId = "article-inline" | "article-aside" | "category-bottom";

/* ---------- Каталог ---------- */

export type CatalogSectionId =
  | "oboi"
  | "kraski"
  | "napolnye"
  | "plitka"
  | "utepliteli"
  | "krovlya"
  | "bloki"
  | "instrumenty"
  | "smesi";

export type CatalogSection = {
  id: CatalogSectionId;
  title: string;
  description: string;
  /** Что проверять при выборе — общие редакционные советы без норм и цифр. */
  howToChoose: string[];
  materials?: MaterialId[];
  calculators?: CalculatorId[];
  /** Статьи и инструкции, где этот раздел уместен в блоке «Материалы для работы». */
  content?: ContentId[];
};

/** Статус подключения магазина к партнёрской программе. */
export type StoreStatus = "not_connected" | "applied" | "connected";

export type Store = {
  id: string;
  name: string;
  site: string;
  /** Через какую программу/сеть подключён (например, «прямая», «Admitad»). */
  program?: string;
  status: StoreStatus;
  /** Юр. наименование рекламодателя для маркировки. */
  advertiserLegal?: string;
  inn?: string;
};

/** Цена выводится только с источником и датой проверки. */
export type VerifiedPrice = {
  amount: number;
  currency: "RUB";
  unit?: string;
  source: string;
  checkedAt: string;
};

export type Product = {
  id: string;
  title: string;
  section: CatalogSectionId;
  storeId: string;
  description: string;
  url: string;
  /** erid из ОРД. Обязателен для реального предложения. */
  erid?: string;
  image?: { src: string; alt: string };
  price?: VerifiedPrice;
  /** Демонстрационная запись для проверки вёрстки. Никогда не выдаётся за предложение. */
  demo?: boolean;
  until?: string;
};

/* ---------- Сравнение ---------- */

export type ComparisonRow = {
  label: string;
  /** Значение по каждому материалу; отсутствие = «нет данных». */
  values: Partial<Record<MaterialId, string>>;
};

export type Comparison = {
  slug: string;
  title: string;
  description: string;
  section: CatalogSectionId;
  materials: MaterialId[];
  /** Дополнительные строки, введённые редакцией по проверенным источникам. */
  extraRows?: ComparisonRow[];
};

/* ---------- Заявки ---------- */

export type LeadObject = "kvartira" | "dom";
export type LeadWork = "remont" | "otdelka" | "stroitelstvo" | "inzhenernye" | "krovlya" | "drugoe";

/** Будущая заявка. Передача исполнителям — только с отдельного явного согласия. */
export type LeadRequest = {
  object: LeadObject;
  work: LeadWork;
  city: string;
  timing: string;
  description: string;
  name: string;
  contact: string;
  consentProcessing: boolean;
  consentShare: boolean;
};

export type Placement = "article" | "material" | "calculator" | "catalog" | "comparison";
