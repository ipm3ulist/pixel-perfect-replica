import type { HouseConfig } from "./model";

/**
 * Геометрия прямоугольного дома в плане. Все формулы — точная геометрия
 * для принятых упрощений (прямоугольник, равные скаты, без эркеров и мансард).
 * Это ориентировочная геометрическая оценка, а не проектный расчёт.
 */
export const SLAB = 0.3; // м, условная толщина перекрытия между этажами

const r2 = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

export interface Geometry {
  footprint: number; // м² — площадь застройки по наружным граням
  floorArea: number; // м² — суммарно по этажам, по наружному контуру
  perimeter: number; // м
  wallHeight: number; // м — высота наружных стен до верха перекрытия последнего этажа
  wallGross: number; // м² — наружные стены без вычета проёмов
  openings: number; // м² — окна и двери
  wallNet: number; // м² — стены за вычетом проёмов
  gables: number; // м² — фронтоны двускатной крыши
  facade: number; // м² — стены + фронтоны − проёмы
  roofPlan: number; // м² — проекция кровли со свесами
  roof: number; // м² — площадь скатов
  ridge: number; // м — высота конька над стенами
  insulationVolume: number; // м³ — утеплитель стен
}

export const DOOR_AREA = 2.1; // м², наружная дверь 1,0 × 2,1 м

export function geometry(c: HouseConfig): Geometry {
  const footprint = c.length * c.width;
  const floorArea = footprint * c.floors;
  const perimeter = 2 * (c.length + c.width);
  const wallHeight = c.floors * c.ceiling + (c.floors - 1) * SLAB + SLAB;
  const wallGross = perimeter * wallHeight;
  const openings = Math.min(wallGross, c.windows * c.windowArea + c.doors * DOOR_AREA);
  const wallNet = wallGross - openings;

  const pitched = c.roofShape !== "flat";
  const pitch = pitched ? rad(c.roofPitch) : 0;
  // Конёк вдоль длинной стороны: подъём = половина пролёта × tg(уклона).
  const span = Math.min(c.length, c.width);
  const ridge = pitched ? (span / 2) * Math.tan(pitch) : 0;
  // Двускатная: два треугольных фронтона 0,5 × пролёт × подъём. У вальмовой фронтонов нет.
  const gables = c.roofShape === "gable" ? span * ridge : 0;

  const roofPlan = (c.length + 2 * c.overhang) * (c.width + 2 * c.overhang);
  // Для скатов с одинаковым уклоном площадь = проекция / cos(уклона) — и для двускатной, и для вальмовой.
  const roof = pitched ? roofPlan / Math.cos(pitch) : roofPlan;

  const facade = wallNet + gables;
  const insulationVolume = wallNet * (c.insulation / 1000);

  return {
    footprint: r2(footprint),
    floorArea: r2(floorArea),
    perimeter: r2(perimeter),
    wallHeight: r2(wallHeight),
    wallGross: r2(wallGross),
    openings: r2(openings),
    wallNet: r2(wallNet),
    gables: r2(gables),
    facade: r2(facade),
    roofPlan: r2(roofPlan),
    roof: r2(roof),
    ridge: r2(ridge),
    insulationVolume: r2(insulationVolume),
  };
}

/** Предупреждения о неполных или нетипичных исходных данных. */
export function warnings(c: HouseConfig, g: Geometry): string[] {
  const w: string[] = [];
  if (c.length / c.width > 3 || c.width / c.length > 3)
    w.push("Дом сильно вытянут: проверьте пропорции и пролёты перекрытий со специалистом.");
  if (Math.min(c.length, c.width) > 12 && c.roofShape !== "flat")
    w.push(
      "Пролёт больше 12 м: стропильная система потребует промежуточных опор — это влияет на проект кровли.",
    );
  if (g.wallGross > 0 && g.openings / g.wallGross > 0.35)
    w.push(
      "Окна и двери занимают больше 35% стен: проверьте теплопотери и несущую способность простенков.",
    );
  if (c.purpose === "permanent" && c.heating === "none")
    w.push("Для постоянного проживания не выбрано отопление.");
  if (c.purpose === "permanent" && c.insulation < 150)
    w.push(
      "Тонкое утепление для постоянного дома: толщину определяет теплотехнический расчёт для вашего региона.",
    );
  if (c.sewer && !c.septic) w.push("Канализация без септика: уточните, есть ли центральная сеть.");
  if (c.bathrooms > 0 && !c.water)
    w.push("Санузлы без водоснабжения — проверьте инженерные параметры.");
  if (
    c.floors === 2 &&
    c.foundation === "piles" &&
    c.structure !== "frame" &&
    c.structure !== "timber"
  )
    w.push("Тяжёлые стены на сваях: тип и шаг свай подбирают по геологии и нагрузкам.");
  return w;
}
