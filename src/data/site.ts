export const SITE = {
  name: "ДомКлючПро",
  latin: "DOMKLUCHPRO",
  tagline: "Платформа о строительстве, ремонте и обустройстве жилья",
  /**
   * Коды подтверждения прав для Яндекс Вебмастера и Google Search Console.
   * Вставьте значение атрибута content из выданного мета-тега — тег появится в <head> всех страниц.
   */
  verification: {
    yandex: (import.meta.env.VITE_YANDEX_VERIFICATION as string | undefined) ?? "",
    google: (import.meta.env.VITE_GOOGLE_VERIFICATION as string | undefined) ?? "",
  },
  /**
   * Постоянный адрес сайта без слэша в конце, например https://domkluchpro.ru.
   * Если не задан, canonical и og:url остаются относительными, а sitemap/robots берут домен из запроса.
   */
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) ?? "").replace(/\/$/, ""),
  disclaimer:
    "Все расчёты на сайте предварительные и не заменяют проект, смету или консультацию профильного специалиста.",
};

/** ID счётчиков. Пустое значение — система не подключается. Задаются переменными окружения при сборке. */
export const ANALYTICS = {
  ymId: (import.meta.env.VITE_YANDEX_METRIKA_ID as string | undefined) ?? "",
  gaId: (import.meta.env.VITE_GA4_ID as string | undefined) ?? "",
};

export type SitePath =
  | "/"
  | "/kvartiry"
  | "/doma"
  | "/stroitelstvo"
  | "/remont"
  | "/materialy"
  | "/kalkulyatory"
  | "/kalkulyatory/oboi"
  | "/instruktsii"
  | "/spravochnik"
  | "/poisk"
  | "/o-proekte"
  | "/stati"
  | "/katalog"
  | "/zayavka"
  | "/reklama"
  | "/doma/konfigurator"
  | "/doma/smeta"
  | "/doma/proekty"
  | "/region"
  | "/dokumenty";

export type NavItem = { to: SitePath; label: string };

export const MAIN_NAV: NavItem[] = [
  { to: "/kvartiry", label: "Квартиры" },
  { to: "/doma", label: "Дома" },
  { to: "/stroitelstvo", label: "Строительство" },
  { to: "/remont", label: "Ремонт" },
  { to: "/materialy", label: "Материалы" },
];

export const SERVICE_NAV: NavItem[] = [
  { to: "/stati", label: "Статьи" },
  { to: "/kalkulyatory", label: "Калькуляторы" },
  { to: "/instruktsii", label: "Инструкции" },
  { to: "/spravochnik", label: "Справочник" },
  { to: "/region", label: "География" },
];
