import type { Product } from "../types";

/**
 * Реальные товары партнёров. Пусто, пока нет подключённых программ.
 * Цена — только с источником и датой проверки (VerifiedPrice).
 */
export const PRODUCTS: Product[] = [];

/**
 * Демо-записи для проверки вёрстки. Без цен, без магазинов, без ссылок наружу.
 * Видны только в режиме разработки и всегда с плашкой «Демонстрационный пример».
 */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-oboi",
    title: "Пример: флизелиновые обои",
    section: "oboi",
    storeId: "demo",
    description: "Карточка-пример. Здесь будет описание реального товара партнёра.",
    url: "#",
    demo: true,
  },
  {
    id: "demo-kraska",
    title: "Пример: интерьерная краска",
    section: "kraski",
    storeId: "demo",
    description: "Карточка-пример. Здесь будет описание реального товара партнёра.",
    url: "#",
    demo: true,
  },
  {
    id: "demo-plitka",
    title: "Пример: керамогранит",
    section: "plitka",
    storeId: "demo",
    description: "Карточка-пример. Здесь будет описание реального товара партнёра.",
    url: "#",
    demo: true,
  },
];
