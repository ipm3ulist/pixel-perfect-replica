import type { CalculatorId, ContentId, MaterialId } from "@/content";
import type { CatalogSection, CatalogSectionId, Comparison } from "../types";

const m = (s: string) => `material:${s}` as MaterialId;
const a = (s: string) => `article:${s}` as ContentId;
const c = (s: string) => `calc:${s}` as CalculatorId;

/** Разделы каталога. Редактируйте здесь — страницы и блоки строятся из этих данных. */
export const CATALOG: CatalogSection[] = [
  {
    id: "oboi",
    title: "Обои и настенные покрытия",
    description:
      "Флизелиновые, виниловые, бумажные обои и покраска под обои: что подходит для разных комнат.",
    howToChoose: [
      "Тип основы и допустимость влажной уборки — по маркировке на рулоне.",
      "Раппорт рисунка: от него зависит расход.",
      "Номер партии: для одной комнаты берите одну партию.",
    ],
    calculators: [c("oboi")],
    content: [a("kak-vybrat-oboi")],
  },
  {
    id: "kraski",
    title: "Краски и грунтовки",
    description:
      "Интерьерные и фасадные краски, грунтовки под них и что проверить на банке перед покупкой.",
    howToChoose: [
      "Назначение: интерьер, фасад, влажные помещения.",
      "Расход и число слоёв — по данным производителя.",
      "Совместимость грунтовки и краски одной системы.",
    ],
    calculators: [c("kraska")],
    content: [a("pokraska-sten-v-kvartire"), a("otdelka-fasada")],
  },
  {
    id: "napolnye",
    title: "Напольные покрытия",
    description: "Ламинат, кварц-винил, инженерная доска и подложки.",
    howToChoose: [
      "Класс износостойкости под нагрузку помещения.",
      "Требования к основанию и подложке из инструкции.",
      "Совместимость с тёплым полом — только по документации.",
    ],
    materials: [m("laminat")],
    calculators: [c("laminat")],
    content: [a("laminat-ili-kvarts-vinil"), a("kak-podgotovit-osnovanie-pod-laminat")],
  },
  {
    id: "plitka",
    title: "Плитка и керамогранит",
    description: "Настенная плитка, керамогранит, клей и затирка.",
    howToChoose: [
      "Назначение: стена, пол, улица.",
      "Калибр и тон одной партии.",
      "Клей и затирка — под формат и основание.",
    ],
    materials: [m("keramogranit")],
    calculators: [c("plitka")],
    content: [a("plitka-v-vannoy-raskladka"), a("gidroizolyatsiya-vannoy")],
  },
  {
    id: "utepliteli",
    title: "Утеплители",
    description: "Минеральная вата, экструдированный пенополистирол и где их применяют.",
    howToChoose: [
      "Место применения: стена, кровля, фундамент.",
      "Теплотехнический расчёт для вашего региона.",
      "Пароизоляция и защита — по системе производителя.",
    ],
    materials: [m("mineralnaya-vata"), m("ekstrudirovannyy-penopolistirol")],
    calculators: [c("uteplitel")],
    content: [a("uteplenie-doma-oshibki"), a("shumoizolyatsiya-kvartiry")],
  },
  {
    id: "krovlya",
    title: "Кровельные материалы",
    description: "Металлочерепица, гибкая черепица, фальц и комплектующие кровли.",
    howToChoose: [
      "Допустимый уклон по инструкции производителя.",
      "Комплект доборных элементов одной системы.",
      "Снеговая нагрузка региона — к проектировщику.",
    ],
    content: [a("vybor-krovli")],
  },
  {
    id: "bloki",
    title: "Стеновые блоки и кирпич",
    description: "Газобетон, керамический блок, кирпич и кладочные смеси.",
    howToChoose: [
      "Марка по плотности и прочности — по проекту.",
      "Кладочный раствор или клей под тип блока.",
      "Геометрия партии и наличие паспорта качества.",
    ],
    materials: [m("gazobeton"), m("keramicheskiy-blok"), m("kirpich")],
    calculators: [c("bloki")],
    content: [a("gazobeton-kirpich-ili-karkas")],
  },
  {
    id: "instrumenty",
    title: "Инструменты",
    description: "Ручной и электроинструмент для ремонта и стройки.",
    howToChoose: [
      "Задача и объём работ: покупка или аренда.",
      "Совместимость расходников и аккумуляторов.",
      "Гарантия и сервис в вашем городе.",
    ],
  },
  {
    id: "smesi",
    title: "Сухие строительные смеси",
    description: "Штукатурки, шпаклёвки, стяжки, плиточный клей.",
    howToChoose: [
      "Тип основания и толщина слоя по инструкции.",
      "Время работы смеси и условия высыхания.",
      "Совместимость со следующим слоем отделки.",
    ],
    calculators: [c("beton")],
    content: [a("shtukaturka-ili-shpaklevka"), a("styazhka-pola-vidy")],
  },
];

export const getSection = (id: CatalogSectionId) => CATALOG.find((s) => s.id === id);

/** Разделы, уместные для данной статьи/материала/калькулятора. */
export const sectionsFor = (id: ContentId) =>
  CATALOG.filter(
    (s) =>
      s.content?.includes(id) ||
      s.materials?.includes(id as MaterialId) ||
      s.calculators?.includes(id as CalculatorId),
  );

/** Сравнения строятся из существующих страниц материалов — без новых характеристик. */
export const COMPARISONS: Comparison[] = [
  {
    slug: "stenovye-materialy",
    title: "Газобетон, керамический блок и кирпич",
    description:
      "Применение, сильные стороны и ограничения стеновых материалов по нашим страницам материалов.",
    section: "bloki",
    materials: [m("gazobeton"), m("keramicheskiy-blok"), m("kirpich")],
  },
  {
    slug: "utepliteli",
    title: "Минеральная вата и ЭППС",
    description: "Где применяют и какие ограничения у двух распространённых утеплителей.",
    section: "utepliteli",
    materials: [m("mineralnaya-vata"), m("ekstrudirovannyy-penopolistirol")],
  },
  {
    slug: "napolnye-pokrytiya",
    title: "Ламинат и керамогранит",
    description: "Сравнение напольных покрытий по применению и ограничениям.",
    section: "napolnye",
    materials: [m("laminat"), m("keramogranit")],
  },
];
