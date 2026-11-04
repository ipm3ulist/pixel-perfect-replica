import { IMAGES } from "./images";
import type {
  Category,
  CategoryId,
  DirectionId,
  Image,
  Status,
  Subcategory,
  Tag,
  TagId,
} from "./types";

export const DIRECTIONS: Record<DirectionId, { title: string; description: string }> = {
  kvartiry: {
    title: "Квартиры",
    description: "Ремонт, отделка, планировка, инженерия и обустройство квартиры.",
  },
  doma: {
    title: "Дома",
    description:
      "Участок, проектирование, строительство, инженерия, фасад, кровля, отделка и обслуживание частного дома.",
  },
};

type Def = [
  slug: string,
  title: string,
  description: string,
  subs: [string, string][],
  related?: CategoryId[],
];

/**
 * Все категории сейчас в статусе draft: у них ещё нет своих страниц (этап 3).
 * Переводите в "published" вместе с наполнением страницы.
 */
function build(direction: DirectionId, defs: Def[], status: Status = "published"): Category[] {
  return defs.map(([slug, title, description, subs, related]) => {
    const id = `${direction}.${slug}` as CategoryId;
    const subcategories: Subcategory[] = subs.map(([s, t]) => ({
      id: `${id}.${s}`,
      slug: s,
      title: t,
      description: "",
    }));
    return {
      id,
      direction,
      slug,
      title,
      description,
      status,
      seo: {
        title: `${title} — ${direction === "kvartiry" ? "ремонт квартиры" : "частный дом"}`,
        description,
      },
      subcategories,
      ...(related ? { related } : {}),
    };
  });
}

const KVARTIRY: Def[] = [
  [
    "planirovanie",
    "Планирование ремонта",
    "Этапы, обмеры, план помещения, бюджет и выбор подрядчиков.",
    [
      ["etapy", "Этапы"],
      ["obmery", "Обмеры"],
      ["plan", "План помещения"],
      ["byudzhet", "Бюджет"],
      ["podryadchiki", "Подрядчики"],
    ],
  ],
  [
    "steny",
    "Стены",
    "Обои, покраска, штукатурка, шпаклёвка, грунтовка и подготовка основания.",
    [
      ["oboi", "Обои"],
      ["pokraska", "Покраска"],
      ["shtukaturka", "Штукатурка"],
      ["shpaklevka", "Шпаклёвка"],
      ["gruntovka", "Грунтовка"],
      ["podgotovka", "Подготовка"],
    ],
    ["doma.otdelka"],
  ],
  [
    "poly",
    "Полы",
    "Ламинат, кварц-винил, паркет, плитка, линолеум, стяжка и плинтусы.",
    [
      ["laminat", "Ламинат"],
      ["kvarts-vinil", "Кварц-винил"],
      ["parket", "Паркет"],
      ["plitka", "Плитка"],
      ["linoleum", "Линолеум"],
      ["styazhka", "Стяжка"],
      ["plintusy", "Плинтусы"],
    ],
    ["doma.otdelka"],
  ],
  [
    "potolki",
    "Потолки",
    "Натяжные, гипсокартонные и окрашенные потолки, подготовка и освещение.",
    [
      ["natyazhnye", "Натяжные"],
      ["gipsokarton", "Гипсокартон"],
      ["pokraska", "Покраска"],
      ["podgotovka", "Подготовка"],
      ["osveshchenie", "Освещение"],
    ],
  ],
  [
    "elektrika-i-svet",
    "Электрика и свет",
    "Розетки, выключатели, сценарии освещения и электробезопасность.",
    [
      ["rozetki", "Розетки"],
      ["vyklyuchateli", "Выключатели"],
      ["stsenarii-sveta", "Сценарии освещения"],
      ["bezopasnost", "Безопасность"],
    ],
    ["doma.elektrika-i-ventilyatsiya"],
  ],
  [
    "vannaya",
    "Ванная и санузел",
    "Гидроизоляция, плитка, сантехника и вентиляция мокрых зон.",
    [
      ["gidroizolyatsiya", "Гидроизоляция"],
      ["plitka", "Плитка"],
      ["santehnika", "Сантехника"],
      ["ventilyatsiya", "Вентиляция"],
    ],
  ],
  [
    "kuhnya",
    "Кухня",
    "Планировка, фартук, столешница, свет, хранение и вентиляция.",
    [
      ["planirovka", "Планировка"],
      ["fartuk", "Фартук"],
      ["stoleshnitsa", "Столешница"],
      ["svet", "Свет"],
      ["hranenie", "Хранение"],
      ["ventilyatsiya", "Вентиляция"],
    ],
  ],
  [
    "komnaty",
    "Комнаты и интерьер",
    "Гостиная, спальня, детская, прихожая и рабочее место.",
    [
      ["gostinaya", "Гостиная"],
      ["spalnya", "Спальня"],
      ["detskaya", "Детская"],
      ["prihozhaya", "Прихожая"],
      ["rabochee-mesto", "Рабочее место"],
    ],
  ],
  [
    "okna-i-dveri",
    "Окна и двери",
    "Выбор окон, монтажные узлы, откосы, межкомнатные и входные двери.",
    [
      ["okna", "Окна"],
      ["montazh", "Монтажные узлы"],
      ["otkosy", "Откосы"],
      ["mezhkomnatnye", "Межкомнатные двери"],
      ["vhodnye", "Входные двери"],
    ],
  ],
  [
    "shumoizolyatsiya",
    "Шумоизоляция и комфорт",
    "Шумоизоляция стен и пола, балкон, вентиляция и сквозняки.",
    [
      ["steny", "Стены"],
      ["pol", "Пол"],
      ["balkon", "Балкон"],
      ["ventilyatsiya", "Вентиляция"],
      ["skvoznyaki", "Сквозняки"],
    ],
  ],
];

const DOMA: Def[] = [
  [
    "uchastok",
    "Участок и подготовка",
    "Рельеф, подъезд, геология, геодезия и водоотведение.",
    [
      ["relef", "Рельеф"],
      ["podezd", "Подъезд"],
      ["geologiya", "Геология"],
      ["geodeziya", "Геодезия"],
      ["vodootvedenie", "Водоотведение"],
    ],
  ],
  [
    "proektirovanie",
    "Проектирование",
    "Выбор проекта, планировка, этажность, ориентация и площадь.",
    [
      ["vybor-proekta", "Выбор проекта"],
      ["planirovka", "Планировка"],
      ["etazhnost", "Этажность"],
      ["orientatsiya", "Ориентация"],
      ["ploshchad", "Площадь"],
    ],
  ],
  [
    "fundament",
    "Фундамент",
    "Типы фундаментов, основание, гидроизоляция, утепление, дренаж и контроль.",
    [
      ["tipy", "Типы"],
      ["osnovanie", "Основание"],
      ["gidroizolyatsiya", "Гидроизоляция"],
      ["uteplenie", "Утепление"],
      ["drenazh", "Дренаж"],
      ["kontrol", "Контроль"],
    ],
  ],
  [
    "steny",
    "Стены и конструкции",
    "Газобетон, кирпич, керамические блоки, каркас и дерево.",
    [
      ["gazobeton", "Газобетон"],
      ["kirpich", "Кирпич"],
      ["keramicheskie-bloki", "Керамические блоки"],
      ["karkas", "Каркас"],
      ["derevo", "Дерево"],
    ],
  ],
  [
    "krovlya",
    "Кровля",
    "Металлочерепица, мягкая и фальцевая кровля, стропила, кровельный пирог и водостоки.",
    [
      ["metallocherepitsa", "Металлочерепица"],
      ["myagkaya", "Мягкая кровля"],
      ["faltsevaya", "Фальцевая кровля"],
      ["stropila", "Стропила"],
      ["pirog", "Кровельный пирог"],
      ["vodostoki", "Водостоки"],
    ],
  ],
  [
    "fasad",
    "Фасад",
    "Штукатурка, вентфасад, кирпич, панели, дерево и цоколь.",
    [
      ["shtukaturka", "Штукатурка"],
      ["ventfasad", "Вентфасад"],
      ["kirpich", "Кирпич"],
      ["paneli", "Панели"],
      ["derevo", "Дерево"],
      ["tsokol", "Цоколь"],
    ],
  ],
  [
    "uteplenie",
    "Утепление и влага",
    "Утепление стен, крыши, перекрытий и фундамента, пароизоляция.",
    [
      ["steny", "Стены"],
      ["krysha", "Крыша"],
      ["perekrytiya", "Перекрытия"],
      ["fundament", "Фундамент"],
      ["paroizolyatsiya", "Пароизоляция"],
    ],
  ],
  [
    "otoplenie",
    "Отопление",
    "Радиаторы, тёплый пол, котельная и тепловые насосы.",
    [
      ["radiatory", "Радиаторы"],
      ["teplyy-pol", "Тёплый пол"],
      ["kotelnaya", "Котельная"],
      ["teplovye-nasosy", "Тепловые насосы"],
    ],
  ],
  [
    "voda-i-kanalizatsiya",
    "Вода и канализация",
    "Скважина, колодец, фильтрация, водонагрев и септик.",
    [
      ["skvazhina", "Скважина"],
      ["kolodets", "Колодец"],
      ["filtratsiya", "Фильтрация"],
      ["vodonagrev", "Водонагрев"],
      ["septik", "Септик"],
    ],
  ],
  [
    "elektrika-i-ventilyatsiya",
    "Электрика и вентиляция",
    "Электроснабжение, вентиляция, рекуперация и автоматика.",
    [
      ["elektrosnabzhenie", "Электроснабжение"],
      ["ventilyatsiya", "Вентиляция"],
      ["rekuperatsiya", "Рекуперация"],
      ["avtomatika", "Автоматика"],
    ],
    ["kvartiry.elektrika-i-svet"],
  ],
  [
    "otdelka",
    "Внутренняя отделка",
    "Стены, полы, потолки, лестницы и двери в частном доме.",
    [
      ["steny", "Стены"],
      ["poly", "Полы"],
      ["potolki", "Потолки"],
      ["lestnitsy", "Лестницы"],
      ["dveri", "Двери"],
    ],
    ["kvartiry.steny", "kvartiry.poly"],
  ],
  [
    "obsluzhivanie",
    "Участок и обслуживание",
    "Отмостка, дренаж, дорожки, террасы, забор и сезонный осмотр.",
    [
      ["otmostka", "Отмостка"],
      ["drenazh", "Дренаж"],
      ["dorozhki", "Дорожки"],
      ["terrasy", "Террасы"],
      ["zabor", "Забор"],
      ["osmotr", "Сезонный осмотр"],
    ],
  ],
  [
    "smety",
    "Сметы и расчёты",
    "Объёмы материалов для фундамента, стен и утепления, структура сметы и порядок расчёта.",
    [
      ["obemy", "Объёмы материалов"],
      ["smeta", "Структура сметы"],
      ["byudzhet", "Бюджет стройки"],
    ],
    ["doma.fundament", "doma.steny", "doma.uteplenie"],
  ],
  [
    "materialy",
    "Строительные материалы",
    "Блоки, кирпич, утеплители, листовые и отделочные материалы: свойства, ограничения, выбор.",
    [
      ["stenovye", "Стеновые"],
      ["teploizolyatsiya", "Теплоизоляция"],
      ["otdelochnye", "Отделочные"],
    ],
    ["doma.steny", "doma.uteplenie", "doma.otdelka"],
  ],
  [
    "instrumenty",
    "Инструменты и оборудование",
    "Измерительный, ручной и электроинструмент, леса и техника для стройки.",
    [
      ["izmeritelnye", "Измерительные"],
      ["elektroinstrument", "Электроинструмент"],
      ["oborudovanie", "Оборудование"],
    ],
  ],
];

/** Категории без наполнения — скрыты до появления материалов. */
const DRAFT_CATEGORIES: CategoryId[] = ["doma.instrumenty"];

const CATEGORY_IMAGES: Partial<Record<CategoryId, Image>> = {
  "kvartiry.planirovanie": IMAGES.apartment,
  "kvartiry.steny": IMAGES.wallpaper,
  "kvartiry.poly": IMAGES.floor,
  "kvartiry.vannaya": IMAGES.bathroom,
  "kvartiry.komnaty": IMAGES.apartment,
  "doma.uchastok": IMAGES.house,
  "doma.proektirovanie": IMAGES.house,
  "doma.fundament": IMAGES.foundation,
  "doma.steny": IMAGES.blocks,
  "doma.krovlya": IMAGES.roof,
  "doma.otdelka": IMAGES.heroInterior,
  "doma.fasad": IMAGES.heroHouse,
};

export const CATEGORIES: Category[] = [...build("kvartiry", KVARTIRY), ...build("doma", DOMA)].map(
  (c) => ({
    ...(CATEGORY_IMAGES[c.id] ? { ...c, image: CATEGORY_IMAGES[c.id]! } : c),
    ...(DRAFT_CATEGORIES.includes(c.id) ? { status: "draft" as const } : {}),
  }),
);

export const TAGS: Tag[] = (
  [
    ["oboi", "Обои"],
    ["podgotovka-sten", "Подготовка стен"],
    ["obmery", "Обмеры"],
    ["gidroizolyatsiya", "Гидроизоляция"],
    ["uteplenie", "Утепление"],
    ["mokrye-zony", "Мокрые зоны"],
    ["byudzhet", "Бюджет"],
    ["teplyy-dom", "Тёплый дом"],
    ["shum", "Тишина и акустика"],
    ["inzheneriya", "Инженерные системы"],
    ["vybor-materiala", "Выбор материала"],
    ["oshibki", "Частые ошибки"],
  ] as const
).map(([slug, title]) => ({ id: `tag:${slug}` as TagId, slug, title }));
