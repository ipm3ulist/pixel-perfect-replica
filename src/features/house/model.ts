/**
 * Модель конфигурации частного дома. Чистые типы и данные без интерфейса.
 * Значения по умолчанию — пример заполнения, а не рекомендация.
 */
export type Purpose = "seasonal" | "permanent" | "guest";
export type Structure = "frame" | "aerated" | "brick" | "timber";
export type Foundation = "piles" | "strip" | "slab";
export type RoofShape = "gable" | "hip" | "flat";
export type RoofCover = "metal" | "seam" | "soft" | "ceramic" | "membrane";
export type Facade = "plaster" | "wood" | "brick" | "fibercement";
export type Finish = "none" | "rough" | "fine";
export type Package = "shell" | "finish" | "living";
export type Heating = "none" | "electric" | "gas" | "heatpump" | "solid";

export interface HouseConfig {
  length: number; // м, по наружным граням стен
  width: number; // м
  floors: 1 | 2;
  ceiling: number; // м, чистая высота этажа
  purpose: Purpose;
  bedrooms: number;
  bathrooms: number;
  structure: Structure;
  foundation: Foundation;
  insulation: number; // мм, толщина утеплителя стен
  roofShape: RoofShape;
  roofPitch: number; // градусы, для скатных крыш
  overhang: number; // м, свес кровли
  roofCover: RoofCover;
  facade: Facade;
  windows: number; // шт
  windowArea: number; // м² одного окна в среднем
  doors: number; // наружные двери, шт
  terrace: number; // м², 0 — нет
  porch: boolean;
  canopy: boolean;
  finish: Finish;
  power: boolean;
  water: boolean;
  sewer: boolean;
  septic: boolean;
  heating: Heating;
  ventilation: boolean;
  sitePrep: boolean;
  wasteRemoval: boolean;
  deliveryKm: number;
  package: Package;
}

export const DEFAULT_CONFIG: HouseConfig = {
  length: 12,
  width: 9,
  floors: 1,
  ceiling: 2.7,
  purpose: "permanent",
  bedrooms: 2,
  bathrooms: 1,
  structure: "frame",
  foundation: "piles",
  insulation: 200,
  roofShape: "gable",
  roofPitch: 30,
  overhang: 0.5,
  roofCover: "metal",
  facade: "wood",
  windows: 8,
  windowArea: 1.5,
  doors: 1,
  terrace: 0,
  porch: true,
  canopy: false,
  finish: "rough",
  power: true,
  water: true,
  sewer: true,
  septic: true,
  heating: "electric",
  ventilation: false,
  sitePrep: true,
  wasteRemoval: true,
  deliveryKm: 50,
  package: "shell",
};

export const LABELS = {
  purpose: { seasonal: "Сезонный", permanent: "Постоянное проживание", guest: "Гостевой" },
  structure: { frame: "Каркас", aerated: "Газобетон", brick: "Кирпич", timber: "Клеёный брус" },
  foundation: { piles: "Сваи", strip: "Ленточный", slab: "Монолитная плита" },
  roofShape: { gable: "Двускатная", hip: "Вальмовая", flat: "Плоская" },
  roofCover: {
    metal: "Металлочерепица",
    seam: "Фальцевая",
    soft: "Гибкая черепица",
    ceramic: "Керамическая черепица",
    membrane: "Мембрана (плоская)",
  },
  facade: {
    plaster: "Штукатурка",
    wood: "Дерево / планкен",
    brick: "Облицовочный кирпич",
    fibercement: "Фиброцементные панели",
  },
  finish: { none: "Без отделки", rough: "Черновая", fine: "Чистовая" },
  package: { shell: "Тёплый контур", finish: "С отделкой", living: "Для проживания" },
  heating: {
    none: "Не нужно",
    electric: "Электрическое",
    gas: "Газовое",
    heatpump: "Тепловой насос",
    solid: "Твёрдотопливное",
  },
} as const;

/** Ограничения ввода: за их пределами геометрическая оценка теряет смысл. */
export const LIMITS = {
  length: [4, 30],
  width: [4, 20],
  ceiling: [2.2, 4],
  roofPitch: [10, 50],
  overhang: [0, 1.2],
  insulation: [0, 400],
  windows: [0, 60],
  windowArea: [0.3, 8],
  doors: [0, 6],
  terrace: [0, 200],
  deliveryKm: [0, 1000],
  bedrooms: [0, 10],
  bathrooms: [0, 6],
} as const satisfies Partial<Record<keyof HouseConfig, readonly [number, number]>>;

const clamp = (v: number, [a, b]: readonly [number, number]) =>
  Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : a;

/** Приводит произвольный объект (например, из localStorage) к допустимой конфигурации. */
export function normalizeConfig(raw: Partial<HouseConfig> | null | undefined): HouseConfig {
  const c = { ...DEFAULT_CONFIG, ...(raw ?? {}) } as HouseConfig;
  for (const [k, lim] of Object.entries(LIMITS)) {
    (c as unknown as Record<string, number>)[k] = clamp(Number(c[k as keyof HouseConfig]), lim);
  }
  c.floors = c.floors === 2 ? 2 : 1;
  for (const [k, map] of Object.entries(LABELS)) {
    const key = k as keyof typeof LABELS;
    if (!(String(c[key]) in map))
      (c as unknown as Record<string, unknown>)[key] = DEFAULT_CONFIG[key];
  }
  if (c.roofShape === "flat" && c.roofCover !== "membrane") c.roofCover = "membrane";
  if (c.roofShape !== "flat" && c.roofCover === "membrane") c.roofCover = DEFAULT_CONFIG.roofCover;
  return c;
}
