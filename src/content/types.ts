/**
 * Единая модель контента ДомКлючПро.
 * Связи между сущностями — только через ID (строки с префиксом типа),
 * URL вычисляются из slug в `urls.ts`, а не хранятся вручную.
 */

export type Status = "draft" | "published";

/** SEO-поля. Обязательны для опубликованных страниц (проверяется в validate.ts). */
export type Seo = { title: string; description: string };

/** Главные направления и сквозные разделы. */
export type DirectionId = "kvartiry" | "doma";
export type HubId = DirectionId | "stroitelstvo" | "remont" | "materialy";

/** ID категории: "<направление>.<slug>", например "kvartiry.steny". */
export type CategoryId = `${DirectionId}.${string}`;
/** ID подкатегории: "<категория>.<slug>" — якорь внутри страницы категории. */
export type SubcategoryId = `${CategoryId}.${string}`;

export type TagId = `tag:${string}`;
export type ArticleId = `article:${string}`;
export type GuideId = `guide:${string}`;
export type MaterialId = `material:${string}`;
export type TermId = `term:${string}`;
export type CalculatorId = `calc:${string}`;
export type ContentId = ArticleId | GuideId | MaterialId | TermId | CalculatorId;

export type Image = { src: string; alt: string };

export type Subcategory = {
  id: SubcategoryId;
  slug: string;
  title: string;
  description: string;
};

export type Category = {
  id: CategoryId;
  direction: DirectionId;
  slug: string;
  title: string;
  description: string;
  status: Status;
  seo: Seo;
  image?: Image;
  subcategories: Subcategory[];
  /** Связанные категории (в т.ч. из другого направления). */
  related?: CategoryId[];
};

export type Tag = { id: TagId; slug: string; title: string };

/**
 * Привязка материала к категориям. Сам материал существует в одном экземпляре
 * с одним URL; `categories` лишь указывает, на каких страницах категорий его показывать.
 */
export type Placement = {
  /** Основная категория — для хлебных крошек. Должна входить в `categories`. */
  primaryCategory: CategoryId;
  categories: CategoryId[];
  subcategories?: SubcategoryId[];
  tags?: TagId[];
};

/** Блоки содержимого статьи — без HTML-строк, чтобы рендер был типобезопасным. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2" | "h3"; id: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; tone: "info" | "warning"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "image"; image: Image; caption?: string };

type Base = {
  slug: string;
  title: string;
  description: string;
  status: Status;
  seo: Seo;
  image?: Image;
  related?: ContentId[];
  /** ISO-дата реального изменения содержимого; не подставлять дату сборки. */
  updatedAt?: string;
};

export type Article = Base & Placement & { id: ArticleId; kind: "article"; content: Block[] };

export type GuideStep = { title: string; text: string };
export type Guide = Base &
  Placement & {
    id: GuideId;
    kind: "guide";
    duration: string;
    tools: string[];
    steps: GuideStep[];
    mistakes: string[];
    calculator?: CalculatorId;
  };

export type MaterialGroup = "steny" | "uteplenie" | "otdelka" | "poly";
export const MATERIAL_GROUPS: Record<MaterialGroup, string> = {
  steny: "Стеновые материалы",
  uteplenie: "Утеплители",
  otdelka: "Отделка",
  poly: "Напольные покрытия",
};
export type Material = Base &
  Placement & {
    id: MaterialId;
    kind: "material";
    group: MaterialGroup;
    /** Короткие тезисы для карточки: где применяют. */
    uses: string[];
    pros: string[];
    limits: string[];
    content: Block[];
  };

export type Term = {
  id: TermId;
  kind: "term";
  slug: string;
  title: string;
  definition: string;
  status: Status;
  related?: ContentId[];
};

export type Calculator = Base & {
  id: CalculatorId;
  kind: "calculator";
  /** published — рабочий инструмент со своей страницей; draft — только «в планах», без URL. */
  categories: CategoryId[];
};

export type Content = Article | Guide | Material | Term | Calculator;
