/**
 * Записи контента. Существующие инструкции и термины берутся из src/data/*
 * без изменений текста и оборачиваются в общую модель.
 */
import { GLOSSARY } from "@/data/glossary";
import { GUIDES } from "@/data/guides";
import { ARTICLES } from "./articles";
import { MATERIALS } from "./materials";
import type { Article, Calculator, CategoryId, Guide, Material, Term } from "./types";

const translit: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .split("")
    .map((c) => translit[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Привязка существующих инструкций к категориям обоих направлений. */
const GUIDE_PLACEMENT: Record<string, CategoryId[]> = {
  "kak-zamerit-pomeshchenie": ["kvartiry.planirovanie", "doma.proektirovanie"],
  "podgotovka-sten-pod-oboi": ["kvartiry.steny", "doma.otdelka"],
  "kak-pokleit-oboi": ["kvartiry.steny", "doma.otdelka"],
};

export const GUIDE_ENTRIES: Guide[] = GUIDES.map((g) => {
  const categories = GUIDE_PLACEMENT[g.slug] ?? [];
  return {
    id: `guide:${g.slug}`,
    kind: "guide",
    slug: g.slug,
    title: g.title,
    description: g.description,
    status: "published",
    seo: { title: g.title, description: g.description },
    primaryCategory: categories[0] ?? "kvartiry.planirovanie",
    categories,
    duration: g.duration,
    tools: g.tools,
    steps: g.steps,
    mistakes: g.mistakes,
    ...(g.calculator ? { calculator: "calc:oboi" as const } : {}),
  };
});

export const TERM_ENTRIES: Term[] = GLOSSARY.map((t) => ({
  id: `term:${slugify(t.term)}`,
  kind: "term",
  slug: slugify(t.term),
  title: t.term,
  definition: t.definition,
  status: "published",
}));

/** Только oboi опубликован; остальные — очередь без собственных страниц. */
export const CALCULATOR_ENTRIES: Calculator[] = [
  {
    id: "calc:oboi",
    kind: "calculator",
    slug: "oboi",
    title: "Калькулятор обоев",
    description: "Расчёт количества рулонов обоев: стены, проёмы, раппорт, запас.",
    status: "published",
    seo: {
      title: "Калькулятор обоев — сколько рулонов нужно",
      description: "Расчёт количества рулонов обоев с учётом проёмов, раппорта и запаса.",
    },
    categories: ["kvartiry.steny", "doma.otdelka"],
  },
  ...(
    [
      [
        "kraska",
        "Калькулятор краски",
        "Сколько банок краски нужно для стен или потолка с учётом проёмов, слоёв и запаса.",
        "Калькулятор краски для стен и потолка",
        ["kvartiry.steny", "kvartiry.potolki", "doma.otdelka"],
      ],
      [
        "plitka",
        "Калькулятор плитки",
        "Количество плиток и упаковок по площади облицовки, формату плитки и запасу.",
        "Калькулятор плитки: сколько штук и упаковок",
        ["kvartiry.vannaya", "kvartiry.poly", "doma.otdelka"],
      ],
      [
        "laminat",
        "Калькулятор ламината",
        "Сколько упаковок ламината или кварц-винила нужно на комнату с учётом подрезки.",
        "Калькулятор ламината: сколько упаковок нужно",
        ["kvartiry.poly", "doma.otdelka"],
      ],
      [
        "bloki",
        "Калькулятор блоков и кирпича",
        "Количество газобетонных, керамических блоков или кирпича и объём кладки стен.",
        "Калькулятор газобетона, блоков и кирпича",
        ["doma.steny"],
      ],
      [
        "beton",
        "Калькулятор бетона",
        "Объём бетона для ленточного фундамента или плиты с запасом.",
        "Калькулятор бетона для фундамента",
        ["doma.fundament"],
      ],
      [
        "uteplitel",
        "Калькулятор утеплителя",
        "Количество упаковок утеплителя по площади, требуемой толщине и размеру плит.",
        "Калькулятор утеплителя: слои и упаковки",
        ["doma.uteplenie", "doma.fasad"],
      ],
    ] as [string, string, string, string, CategoryId[]][]
  ).map(([slug, title, description, seoTitle, categories]): Calculator => ({
    id: `calc:${slug}`,
    kind: "calculator",
    slug,
    title,
    description,
    status: "published",
    seo: { title: seoTitle, description },
    categories,
  })),
  ...(
    [
      ["krovlya", "Калькулятор кровли", ["doma.krovlya"]],
      ["obem-pomeshcheniya", "Объём помещения", ["kvartiry.planirovanie"]],
      ["ploshchad-sten", "Площадь стен", ["kvartiry.steny"]],
      ["styazhka", "Калькулятор стяжки", ["kvartiry.poly"]],
    ] as [string, string, CategoryId[]][]
  ).map(([slug, title, categories]): Calculator => ({
    id: `calc:${slug}`,
    kind: "calculator",
    slug,
    title,
    description: "",
    status: "draft",
    seo: { title: "", description: "" },
    categories,
  })),
];

/**
 * Статьи. Пример ниже — черновик: он проверяется валидатором, но не попадает
 * в sitemap, поиск и на страницы, пока status не станет "published".
 */
export const ARTICLE_ENTRIES: Article[] = [
  {
    id: "article:gidroizolyatsiya-mokryh-zon",
    kind: "article",
    slug: "gidroizolyatsiya-mokryh-zon",
    title: "Гидроизоляция мокрых зон: где она необходима",
    description:
      "Какие участки ванной, санузла и кухни защищают гидроизоляцией и почему это делают до плитки.",
    status: "draft",
    seo: {
      title: "Гидроизоляция ванной и санузла: где нужна",
      description:
        "Какие зоны гидроизолировать в квартире и частном доме и что проверить до укладки плитки.",
    },
    primaryCategory: "kvartiry.vannaya",
    categories: ["kvartiry.vannaya", "doma.otdelka"],
    subcategories: ["kvartiry.vannaya.gidroizolyatsiya"],
    tags: ["tag:gidroizolyatsiya", "tag:mokrye-zony"],
    related: ["term:gidroizolyatsiya", "guide:podgotovka-sten-pod-oboi"],
    content: [{ type: "p", text: "Черновик — текст будет написан на этапе наполнения." }],
  },
  ...ARTICLES,
];

export const MATERIAL_ENTRIES: Material[] = MATERIALS;
