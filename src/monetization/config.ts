import type { AdSlotId, PartnerOffer } from "./types";

/**
 * Все коммерческие функции выключены по умолчанию.
 * - PARTNER_OFFERS пуст: вымышленные магазины и ссылки не добавляются.
 * - ADS: включайте слот только после подключения реальной рекламной сети.
 * - LEADS_ENABLED: приём заявок включается после подключения хранилища
 *   и публикации политики обработки персональных данных.
 * - SHOW_DEMO: демо-товары видны только в режиме разработки и всегда с плашкой.
 */
export const PARTNER_OFFERS: PartnerOffer[] = [];

export const ADS: Record<AdSlotId, boolean> = {
  "article-inline": false,
  "article-aside": false,
  "category-bottom": false,
};

export const LEADS_ENABLED = false;
export const AFFILIATE_ENABLED = false;
export const SHOW_DEMO = import.meta.env.DEV;
