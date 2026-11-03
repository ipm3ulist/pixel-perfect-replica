import { blocks, concrete, insulation, laminate, paint, tile } from "./formulas";

export type Field =
  | { key: string; label: string; unit?: string; value: number; step?: number; hint?: string }
  | { key: string; label: string; options: { value: string; label: string }[]; value: string };

type FieldKey =
  | "area"
  | "openings"
  | "layers"
  | "consumption"
  | "canVolume"
  | "reservePct"
  | "tileW"
  | "tileH"
  | "perBox"
  | "packArea"
  | "length"
  | "height"
  | "blockL"
  | "blockH"
  | "blockT"
  | "shape"
  | "width"
  | "thickness"
  | "plateThickness";
export type Vals = Partial<Record<FieldKey, number | string>>;

export type ResultRow = { label: string; value: number | string; unit?: string; primary?: boolean };

export type CalcConfig = {
  slug: "kraska" | "plitka" | "laminat" | "bloki" | "beton" | "uteplitel";
  fields: Field[];
  compute: (v: Vals) => ResultRow[];
  method: string[];
  note: string;
};

const n = (v: number | string | undefined) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(",", ".")) || 0;

/**
 * Значения по умолчанию — только пример заполнения формы, а не норма.
 * Пользователь заменяет их данными конкретного помещения и материала.
 */
export const CALC_CONFIGS: Record<CalcConfig["slug"], CalcConfig> = {
  kraska: {
    slug: "kraska",
    fields: [
      {
        key: "area",
        label: "Площадь стен или потолка",
        unit: "м²",
        value: 40,
        hint: "Периметр × высота или площадь потолка",
      },
      { key: "openings", label: "Площадь окон и дверей", unit: "м²", value: 4 },
      { key: "layers", label: "Количество слоёв", value: 2, step: 1 },
      {
        key: "consumption",
        label: "Расход на один слой",
        unit: "л/м²",
        value: 0.1,
        step: 0.01,
        hint: "Указан на банке; если дан в м²/л, разделите 1 на это число",
      },
      { key: "canVolume", label: "Объём банки", unit: "л", value: 2.5, step: 0.1 },
      { key: "reservePct", label: "Запас", unit: "%", value: 10 },
    ],
    compute: (v) => {
      const r = paint({
        area: n(v.area),
        openings: n(v.openings),
        layers: n(v.layers),
        consumption: n(v.consumption),
        canVolume: n(v.canVolume),
        reservePct: n(v.reservePct),
      });
      return [
        { label: "Банок", value: r.cans, unit: "шт", primary: true },
        { label: "Краски с запасом", value: r.liters, unit: "л" },
        { label: "Окрашиваемая площадь", value: r.net, unit: "м²" },
      ];
    },
    method: [
      "Площадь = площадь поверхности − проёмы",
      "Литры = площадь × слои × расход × (1 + запас)",
      "Банки = литры ÷ объём банки, округление вверх",
    ],
    note: "Реальный расход зависит от впитываемости основания, инструмента и цвета. Сверяйтесь с рекомендациями производителя краски.",
  },
  plitka: {
    slug: "plitka",
    fields: [
      { key: "area", label: "Площадь облицовки", unit: "м²", value: 6 },
      { key: "tileW", label: "Ширина плитки", unit: "см", value: 30 },
      { key: "tileH", label: "Длина плитки", unit: "см", value: 60 },
      {
        key: "perBox",
        label: "Штук в упаковке",
        unit: "шт",
        value: 8,
        step: 1,
        hint: "0 — не считать упаковки",
      },
      {
        key: "reservePct",
        label: "Запас на подрезку и бой",
        unit: "%",
        value: 10,
        hint: "Больше при диагональной раскладке и крупном формате",
      },
    ],
    compute: (v) => {
      const r = tile({
        area: n(v.area),
        tileW: n(v.tileW),
        tileH: n(v.tileH),
        perBox: n(v.perBox),
        reservePct: n(v.reservePct),
      });
      return [
        { label: "Плиток", value: r.tiles, unit: "шт", primary: true },
        { label: "Упаковок", value: r.boxes, unit: "шт" },
        { label: "Площадь одной плитки", value: r.tileArea, unit: "м²" },
      ];
    },
    method: [
      "Площадь плитки = ширина × длина",
      "Плиток = площадь × (1 + запас) ÷ площадь плитки, вверх",
      "Упаковок = плиток ÷ штук в упаковке, вверх",
    ],
    note: "Расчёт не учитывает ширину шва и конкретную раскладку. Для сложных помещений точнее посчитать по раскладке.",
  },
  laminat: {
    slug: "laminat",
    fields: [
      { key: "area", label: "Площадь пола", unit: "м²", value: 18 },
      {
        key: "packArea",
        label: "Площадь в упаковке",
        unit: "м²",
        value: 2.2,
        step: 0.01,
        hint: "Указана на упаковке",
      },
      {
        key: "reservePct",
        label: "Запас на подрезку",
        unit: "%",
        value: 5,
        hint: "Больше при укладке по диагонали или ёлочкой",
      },
    ],
    compute: (v) => {
      const r = laminate({ area: n(v.area), packArea: n(v.packArea), reservePct: n(v.reservePct) });
      return [
        { label: "Упаковок", value: r.packs, unit: "шт", primary: true },
        { label: "Нужно с запасом", value: r.need, unit: "м²" },
        { label: "Будет куплено", value: r.bought, unit: "м²" },
      ];
    },
    method: [
      "Нужно = площадь × (1 + запас)",
      "Упаковок = нужно ÷ площадь упаковки, округление вверх",
    ],
    note: "Подложку, плинтус и пороги считайте отдельно. Покупайте покрытие одной партии.",
  },
  bloki: {
    slug: "bloki",
    fields: [
      { key: "length", label: "Суммарная длина стен", unit: "м", value: 40 },
      { key: "height", label: "Высота стен", unit: "м", value: 3, step: 0.1 },
      { key: "openings", label: "Площадь проёмов", unit: "м²", value: 12 },
      { key: "blockL", label: "Длина блока", unit: "мм", value: 625 },
      { key: "blockH", label: "Высота блока", unit: "мм", value: 250 },
      { key: "blockT", label: "Толщина блока (стены)", unit: "мм", value: 300 },
      { key: "reservePct", label: "Запас", unit: "%", value: 5 },
    ],
    compute: (v) => {
      const r = blocks({
        length: n(v.length),
        height: n(v.height),
        openings: n(v.openings),
        blockL: n(v.blockL),
        blockH: n(v.blockH),
        blockT: n(v.blockT),
        reservePct: n(v.reservePct),
      });
      return [
        { label: "Блоков", value: r.count, unit: "шт", primary: true },
        { label: "Объём кладки", value: r.volume, unit: "м³" },
        { label: "Площадь стен без проёмов", value: r.wallArea, unit: "м²" },
      ];
    },
    method: [
      "Площадь = длина × высота − проёмы",
      "Блоков = площадь ÷ (длина × высота блока) × (1 + запас), вверх",
      "Объём = площадь × толщина",
    ],
    note: "Подходит для газобетона, керамических блоков и кирпича — введите размеры своего изделия. Толщину шва и армопояс расчёт не учитывает.",
  },
  beton: {
    slug: "beton",
    fields: [
      {
        key: "shape",
        label: "Конструкция",
        value: "strip",
        options: [
          { value: "strip", label: "Ленточный фундамент" },
          { value: "slab", label: "Плита" },
        ],
      },
      { key: "length", label: "Длина (для ленты — суммарная длина)", unit: "м", value: 50 },
      { key: "width", label: "Ширина", unit: "м", value: 0.4, step: 0.05 },
      {
        key: "thickness",
        label: "Высота ленты или толщина плиты",
        unit: "м",
        value: 1,
        step: 0.05,
      },
      { key: "reservePct", label: "Запас", unit: "%", value: 5 },
    ],
    compute: (v) => {
      const r = concrete({
        shape: v.shape === "slab" ? "slab" : "strip",
        length: n(v.length),
        width: n(v.width),
        thickness: n(v.thickness),
        reservePct: n(v.reservePct),
      });
      return [
        { label: "Бетона с запасом", value: r.volume, unit: "м³", primary: true },
        { label: "Геометрический объём", value: r.base, unit: "м³" },
      ];
    },
    method: ["Объём = длина × ширина × высота", "С запасом = объём × (1 + запас)"],
    note: "Расчёт геометрический. Размеры, класс бетона и армирование определяет проект фундамента.",
  },
  uteplitel: {
    slug: "uteplitel",
    fields: [
      { key: "area", label: "Площадь утепления", unit: "м²", value: 100 },
      {
        key: "thickness",
        label: "Требуемая толщина",
        unit: "мм",
        value: 150,
        hint: "По теплотехническому расчёту",
      },
      { key: "plateThickness", label: "Толщина одной плиты", unit: "мм", value: 50 },
      {
        key: "packArea",
        label: "Площадь плит в упаковке",
        unit: "м²",
        value: 3,
        step: 0.01,
        hint: "Указана на упаковке",
      },
      { key: "reservePct", label: "Запас", unit: "%", value: 5 },
    ],
    compute: (v) => {
      const r = insulation({
        area: n(v.area),
        thickness: n(v.thickness),
        plateThickness: n(v.plateThickness),
        packArea: n(v.packArea),
        reservePct: n(v.reservePct),
      });
      return [
        { label: "Упаковок", value: r.packs, unit: "шт", primary: true },
        { label: "Слоёв", value: r.layers, unit: "шт" },
        { label: "Площадь плит с запасом", value: r.need, unit: "м²" },
        { label: "Объём утеплителя", value: r.volume, unit: "м³" },
      ];
    },
    method: [
      "Слоёв = толщина ÷ толщина плиты, вверх",
      "Площадь плит = площадь × слои × (1 + запас)",
      "Упаковок = площадь плит ÷ площадь в упаковке, вверх",
    ],
    note: "Калькулятор не подбирает толщину — её определяет расчёт для вашего региона и конструкции.",
  },
};
