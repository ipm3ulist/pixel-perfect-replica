/**
 * Субъекты Центрального федерального округа.
 * Хранятся только проверяемые справочные сведения (название, административный центр).
 * Региональные цены, нормы, климат и грунты сюда НЕ вносятся без источника.
 *
 * status:
 *  - "planned"   — уникального содержания ещё нет: страница открывается, но закрыта от индексации
 *                  (noindex) и не попадает в sitemap.
 *  - "published" — есть проверенное содержание (content + sources); страница индексируется.
 */
export type FederalDistrict =
  | "ЦФО"
  | "СЗФО"
  | "ЮФО"
  | "СКФО"
  | "ПФО"
  | "УФО"
  | "СФО"
  | "ДФО";

export type RegionSource = { title: string; url: string };

export type RegionContent = {
  intro: string;
  building: string[];
  climate?: { text: string; sources: RegionSource[] };
  materials: string[];
};

export type Region = {
  slug: string;
  name: string;
  /** Падеж для заголовков: «в Тверской области». */
  inName: string;
  center: string;
  kind: "city" | "oblast";
  federalDistrict: FederalDistrict;
  /** Позиция в схеме-картограмме (колонка, ряд). Не географическая проекция. */
  tile: [number, number];
  status: "planned" | "published";
  updatedAt: string;
  content?: RegionContent;
};

const D = "2026-11-03";

export const REGIONS: Region[] = [
  {
    slug: "tverskaya-oblast",
    name: "Тверская область",
    inName: "в Тверской области",
    center: "Тверь",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [1, 0],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "yaroslavskaya-oblast",
    name: "Ярославская область",
    inName: "в Ярославской области",
    center: "Ярославль",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [3, 0],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "kostromskaya-oblast",
    name: "Костромская область",
    inName: "в Костромской области",
    center: "Кострома",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [4, 0],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "smolenskaya-oblast",
    name: "Смоленская область",
    inName: "в Смоленской области",
    center: "Смоленск",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [0, 1],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "moskovskaya-oblast",
    name: "Московская область",
    inName: "в Московской области",
    center: "Красногорск",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [1, 1],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "moskva",
    name: "Москва",
    inName: "в Москве",
    center: "Москва",
    kind: "city",
    federalDistrict: "ЦФО",
    tile: [2, 1],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "vladimirskaya-oblast",
    name: "Владимирская область",
    inName: "во Владимирской области",
    center: "Владимир",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [3, 1],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "ivanovskaya-oblast",
    name: "Ивановская область",
    inName: "в Ивановской области",
    center: "Иваново",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [4, 1],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "bryanskaya-oblast",
    name: "Брянская область",
    inName: "в Брянской области",
    center: "Брянск",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [0, 2],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "kaluzhskaya-oblast",
    name: "Калужская область",
    inName: "в Калужской области",
    center: "Калуга",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [1, 2],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "tulskaya-oblast",
    name: "Тульская область",
    inName: "в Тульской области",
    center: "Тула",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [2, 2],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "ryazanskaya-oblast",
    name: "Рязанская область",
    inName: "в Рязанской области",
    center: "Рязань",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [3, 2],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "kurskaya-oblast",
    name: "Курская область",
    inName: "в Курской области",
    center: "Курск",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [0, 3],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "orlovskaya-oblast",
    name: "Орловская область",
    inName: "в Орловской области",
    center: "Орёл",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [1, 3],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "lipetskaya-oblast",
    name: "Липецкая область",
    inName: "в Липецкой области",
    center: "Липецк",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [2, 3],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "tambovskaya-oblast",
    name: "Тамбовская область",
    inName: "в Тамбовской области",
    center: "Тамбов",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [3, 3],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "belgorodskaya-oblast",
    name: "Белгородская область",
    inName: "в Белгородской области",
    center: "Белгород",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [1, 4],
    status: "planned",
    updatedAt: D,
  },
  {
    slug: "voronezhskaya-oblast",
    name: "Воронежская область",
    inName: "в Воронежской области",
    center: "Воронеж",
    kind: "oblast",
    federalDistrict: "ЦФО",
    tile: [2, 4],
    status: "planned",
    updatedAt: D,
  },
];

export const regionBySlug = (slug: string) => REGIONS.find((r) => r.slug === slug);

export const FEDERAL_DISTRICTS: FederalDistrict[] = [
  "ЦФО", "СЗФО", "ЮФО", "СКФО", "ПФО", "УФО", "СФО", "ДФО",
];

export const FEDERAL_DISTRICT_NAMES: Record<FederalDistrict, string> = {
  "ЦФО": "Центральный федеральный округ",
  "СЗФО": "Северо-Западный федеральный округ",
  "ЮФО": "Южный федеральный округ",
  "СКФО": "Северо-Кавказский федеральный округ",
  "ПФО": "Приволжский федеральный округ",
  "УФО": "Уральский федеральный округ",
  "СФО": "Сибирский федеральный округ",
  "ДФО": "Дальневосточный федеральный округ",
};

export const regionsByDistrict = (district: FederalDistrict) =>
  REGIONS.filter((r) => r.federalDistrict === district);

/** Индексируется только регион с проверенным содержанием. */
export const isRegionIndexable = (r: Region) => r.status === "published" && !!r.content;

export const REGION_KEY = "dk-region";

export function readSavedRegion(): string | null {
  try {
    const v = window.localStorage.getItem(REGION_KEY);
    return v && regionBySlug(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveRegion(slug: string | null) {
  try {
    if (slug) window.localStorage.setItem(REGION_KEY, slug);
    else window.localStorage.removeItem(REGION_KEY);
  } catch {
    /* ignore */
  }
}
