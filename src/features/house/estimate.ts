import { LABELS, type HouseConfig } from "./model";
import { geometry, type Geometry } from "./geometry";

/**
 * Структура предварительной сметы: только физические объёмы и перечень работ.
 * Цены отключены, пока нет проверенного источника по региону и даты проверки.
 */
export type Stage = "box" | "finish" | "engineering" | "extra" | "logistics";
export type LineKind = "material" | "work";
export type PriceStatus = "demo" | "verified" | "needs_update" | "estimate";

export const STAGES: Record<Stage, string> = {
  box: "Коробка и кровля",
  finish: "Отделка",
  engineering: "Инженерные системы",
  extra: "Дополнительные работы",
  logistics: "Логистика и участок",
};

export interface Price {
  value: number; // ₽ за единицу
  region: string;
  source: string;
  checkedAt: string; // ISO-дата проверки
  status: PriceStatus;
}

export interface EstimateLine {
  id: string;
  stage: Stage;
  kind: LineKind;
  title: string;
  unit: "м²" | "м³" | "м" | "шт" | "км" | "компл.";
  qty: number | null; // null — объём определяется проектом
  basis: string; // от чего считается количество
  price?: Price | undefined;
}

/** Цена показывается только если она проверена и у неё есть источник, регион и дата. */
export function isDisplayablePrice(p: Price | undefined): p is Price {
  return (
    !!p &&
    p.status === "verified" &&
    !!p.source &&
    !!p.region &&
    /^\d{4}-\d{2}-\d{2}$/.test(p.checkedAt) &&
    p.value > 0
  );
}

export const PRICES_ENABLED = false;

export function buildEstimate(c: HouseConfig, g: Geometry = geometry(c)): EstimateLine[] {
  const L: EstimateLine[] = [];
  const add = (l: EstimateLine) => L.push(l);
  const withFinish = c.package !== "shell";
  const living = c.package === "living";

  // Фундамент
  if (c.foundation === "slab")
    add({
      id: "found",
      stage: "box",
      kind: "work",
      title: "Фундамент: монолитная плита",
      unit: "м²",
      qty: g.footprint,
      basis: "Площадь застройки; толщина и армирование — по проекту",
    });
  else if (c.foundation === "strip")
    add({
      id: "found",
      stage: "box",
      kind: "work",
      title: "Фундамент: лента по наружному контуру",
      unit: "м",
      qty: g.perimeter,
      basis: "Периметр; внутренние несущие стены добавляются по планировке",
    });
  else
    add({
      id: "found",
      stage: "box",
      kind: "work",
      title: "Фундамент: сваи",
      unit: "шт",
      qty: null,
      basis: "Количество и шаг свай определяются по нагрузкам и геологии",
    });

  add({
    id: "walls",
    stage: "box",
    kind: "work",
    title: `Наружные стены: ${LABELS.structure[c.structure].toLowerCase()}`,
    unit: "м²",
    qty: g.wallNet,
    basis: "Периметр × высота стен − окна и двери",
  });
  if (c.floors === 2)
    add({
      id: "slab",
      stage: "box",
      kind: "work",
      title: "Междуэтажное перекрытие",
      unit: "м²",
      qty: g.footprint,
      basis: "Площадь застройки",
    });
  add({
    id: "ceil",
    stage: "box",
    kind: "work",
    title: "Перекрытие последнего этажа",
    unit: "м²",
    qty: g.footprint,
    basis: "Площадь застройки",
  });
  if (c.insulation > 0)
    add({
      id: "ins",
      stage: "box",
      kind: "material",
      title: `Утеплитель стен, ${c.insulation} мм`,
      unit: "м³",
      qty: g.insulationVolume,
      basis: "Площадь стен без проёмов × толщина; без запаса на подрезку",
    });
  add({
    id: "roof",
    stage: "box",
    kind: "work",
    title: `Кровля: ${LABELS.roofShape[c.roofShape].toLowerCase()}, ${LABELS.roofCover[c.roofCover].toLowerCase()}`,
    unit: "м²",
    qty: g.roof,
    basis:
      c.roofShape === "flat" ? "Проекция со свесами" : `Проекция со свесами ÷ cos ${c.roofPitch}°`,
  });
  add({
    id: "win",
    stage: "box",
    kind: "material",
    title: "Окна",
    unit: "шт",
    qty: c.windows,
    basis: `Средняя площадь окна ${c.windowArea} м²`,
  });
  add({
    id: "door",
    stage: "box",
    kind: "material",
    title: "Наружные двери",
    unit: "шт",
    qty: c.doors,
    basis: "По параметрам конфигурации",
  });
  add({
    id: "fac",
    stage: "box",
    kind: "work",
    title: `Фасад: ${LABELS.facade[c.facade].toLowerCase()}`,
    unit: "м²",
    qty: g.facade,
    basis: "Стены без проёмов + фронтоны",
  });

  if (withFinish && c.finish !== "none") {
    add({
      id: "floor",
      stage: "finish",
      kind: "work",
      title: `Полы, ${LABELS.finish[c.finish].toLowerCase()} отделка`,
      unit: "м²",
      qty: g.floorArea,
      basis: "Площадь по наружному контуру; чистая площадь меньше на толщину стен",
    });
    add({
      id: "intw",
      stage: "finish",
      kind: "work",
      title: "Внутренняя отделка стен и перегородок",
      unit: "м²",
      qty: null,
      basis: "Зависит от планировки перегородок",
    });
  }

  if (c.power)
    add({
      id: "pow",
      stage: "engineering",
      kind: "work",
      title: "Электроснабжение дома",
      unit: "компл.",
      qty: 1,
      basis: "Мощность и схема — по проекту электрики",
    });
  if (c.water)
    add({
      id: "wat",
      stage: "engineering",
      kind: "work",
      title: "Водоснабжение",
      unit: "компл.",
      qty: 1,
      basis: `Санузлов: ${c.bathrooms}`,
    });
  if (c.sewer)
    add({
      id: "sew",
      stage: "engineering",
      kind: "work",
      title: "Внутренняя канализация",
      unit: "компл.",
      qty: 1,
      basis: `Санузлов: ${c.bathrooms}`,
    });
  if (c.septic)
    add({
      id: "sep",
      stage: "engineering",
      kind: "work",
      title: "Септик или локальные очистные",
      unit: "компл.",
      qty: 1,
      basis: "Объём подбирают по числу проживающих и грунтам",
    });
  if (c.heating !== "none")
    add({
      id: "heat",
      stage: "engineering",
      kind: "work",
      title: `Отопление: ${LABELS.heating[c.heating].toLowerCase()}`,
      unit: "м²",
      qty: g.floorArea,
      basis: "Отапливаемая площадь; мощность — по теплотехническому расчёту",
    });
  if (c.ventilation)
    add({
      id: "vent",
      stage: "engineering",
      kind: "work",
      title: "Вентиляция",
      unit: "компл.",
      qty: 1,
      basis: "По проекту вентиляции",
    });

  if (c.terrace > 0)
    add({
      id: "ter",
      stage: "extra",
      kind: "work",
      title: "Терраса",
      unit: "м²",
      qty: c.terrace,
      basis: "Указанная площадь",
    });
  if (c.porch)
    add({
      id: "porch",
      stage: "extra",
      kind: "work",
      title: "Крыльцо",
      unit: "шт",
      qty: 1,
      basis: "По параметрам конфигурации",
    });
  if (c.canopy)
    add({
      id: "can",
      stage: "extra",
      kind: "work",
      title: "Навес",
      unit: "шт",
      qty: 1,
      basis: "По параметрам конфигурации",
    });
  if (living)
    add({
      id: "liv",
      stage: "extra",
      kind: "work",
      title: "Подготовка к проживанию: сантехприборы, освещение",
      unit: "компл.",
      qty: 1,
      basis: "Комплектация «для проживания»",
    });

  if (c.sitePrep)
    add({
      id: "site",
      stage: "logistics",
      kind: "work",
      title: "Подготовка участка",
      unit: "м²",
      qty: Math.round((c.length + 4) * (c.width + 4)),
      basis: "Пятно застройки плюс 2 м по периметру",
    });
  if (c.wasteRemoval)
    add({
      id: "waste",
      stage: "logistics",
      kind: "work",
      title: "Вывоз строительных отходов",
      unit: "компл.",
      qty: 1,
      basis: "Объём зависит от технологии",
    });
  if (c.deliveryKm > 0)
    add({
      id: "deliv",
      stage: "logistics",
      kind: "work",
      title: "Доставка материалов",
      unit: "км",
      qty: c.deliveryKm,
      basis: "Расстояние в одну сторону; число рейсов зависит от объёма",
    });
  return L;
}

export function groupByStage(lines: EstimateLine[]) {
  return (Object.keys(STAGES) as Stage[])
    .map((s) => ({ stage: s, title: STAGES[s], lines: lines.filter((l) => l.stage === s) }))
    .filter((g) => g.lines.length);
}
