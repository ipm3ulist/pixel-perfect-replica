export const SITE = {
  name: "ДомКлючПро",
  latin: "DOMKLUCHPRO",
  tagline: "Платформа о строительстве, ремонте и обустройстве жилья",
  /**
   * Коды подтверждения прав для Яндекс Вебмастера и Google Search Console.
   * Вставьте значение атрибута content из выданного мета-тега — тег появится в <head> всех страниц.
   */
  verification: { yandex: "", google: "" },
  disclaimer:
    "Все расчёты на сайте предварительные и не заменяют проект, смету или консультацию профильного специалиста.",
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
  | "/doma/proekty";

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
];
