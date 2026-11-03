import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ContentRows, FeatureCard } from "@/components/content/ContentList";
import { HrefLink } from "@/components/site/HrefLink";
import { ARTICLES } from "@/content/articles";
import { CALCULATOR_ENTRIES, GUIDE_ENTRIES, TERM_ENTRIES } from "@/content/entries";
import { IMAGES } from "@/content/images";
import { MATERIALS } from "@/content/materials";
import {
  DIRECTIONS,
  PUBLISHED,
  TAGS,
  categoriesOf,
  getCategory,
  urlFor,
  type CategoryId,
  type DirectionId,
  type TagId,
} from "@/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "ДомКлючПро — ремонт квартиры и строительство частного дома",
      description:
        "Независимый справочник для владельцев квартир и частных домов: порядок решений, материалы, калькуляторы, инструкции и строительные термины.",
      path: "/",
    }),
  component: Index,
});

const POPULAR: CategoryId[] = [
  "kvartiry.planirovanie",
  "kvartiry.steny",
  "kvartiry.poly",
  "kvartiry.vannaya",
  "doma.fundament",
  "doma.steny",
  "doma.krovlya",
  "doma.uteplenie",
];

const COLLECTIONS: { tag: TagId; lead: string }[] = [
  { tag: "tag:mokrye-zony", lead: "Ванная, санузел и всё, что защищает от воды" },
  { tag: "tag:teplyy-dom", lead: "Утепление, окна и вентиляция как одна система" },
  { tag: "tag:podgotovka-sten", lead: "Основание решает, как будет выглядеть отделка" },
  { tag: "tag:oshibki", lead: "Что чаще всего переделывают и почему" },
];

function DirectionCard({
  d,
  image,
}: {
  d: DirectionId;
  image: (typeof IMAGES)[keyof typeof IMAGES];
}) {
  const cats = categoriesOf(d);
  return (
    <article className="group flex flex-col">
      <Link to={`/${d}`} className="relative block overflow-hidden rounded-sm bg-stone">
        <img
          src={image.src}
          alt={image.alt}
          width={1280}
          height={1600}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02] md:aspect-[5/6]"
        />
        <span className="absolute top-5 left-5 rounded-sm bg-background/90 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase backdrop-blur">
          {cats.length} категорий
        </span>
      </Link>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h3 className="text-3xl md:text-4xl">
          <Link to={`/${d}`} className="hover:text-primary">
            {d === "doma" ? "Частный дом" : "Квартира"}
          </Link>
        </h3>
        <ArrowUpRight className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
      </div>
      <p className="mt-3 max-w-md text-muted-foreground">{DIRECTIONS[d].description}</p>
      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {cats.slice(0, 5).map((c) => (
          <li key={c.id}>
            <HrefLink
              href={urlFor(c)!}
              className="underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary"
            >
              {c.title}
            </HrefLink>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SectionHead({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: {
    to: "/stati" | "/kalkulyatory" | "/instruktsii" | "/materialy" | "/spravochnik";
    label: string;
  };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl md:text-[2.75rem]">{title}</h2>
      </div>
      {link && (
        <Link
          to={link.to}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground hover:gap-3 transition-all"
        >
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Index() {
  const calcs = CALCULATOR_ENTRIES.filter((c) => c.status === "published");
  const latest = [...ARTICLES].reverse();
  const lead = latest.find((a) => a.image)!;
  const terms = TERM_ENTRIES.slice(-6);
  const family = IMAGES.familyHouseHero;

  return (
    <>
      {/* Первый экран: фото семьи во всю ширину сразу под шапкой, заголовок в небе над людьми */}
      <section className="relative isolate min-h-[820px] overflow-hidden border-b border-border bg-background md:min-h-[720px] lg:aspect-[16/9] lg:max-h-[1100px] lg:min-h-0">
        <img
          src={family.src}
          alt={family.alt}
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[26%_100%] lg:object-[50%_0%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-background/80 via-background/40 to-transparent"
        />
        <div className="container-page relative flex flex-col justify-start pb-10 pt-8 md:pt-12">
          <p className="eyebrow">Квартиры · Частные дома</p>
          <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.05] font-extrabold text-graphite md:text-[3.5rem]">
            Дом начинается с&nbsp;правильных решений
          </h1>
          <p className="mt-4 max-w-xl text-base text-graphite/75 md:mt-6 md:text-lg">
            Независимый справочник для тех, кто ремонтирует квартиру или строит дом: порядок
            работ, материалы, расчёты и инструкции — без рекламы под видом советов.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <a
              href="#napravlenie"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              Выбрать направление <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/kalkulyatory"
              className="inline-flex items-center gap-2 rounded-sm border border-graphite/20 bg-background/70 px-6 py-3.5 text-sm font-semibold text-graphite hover:bg-background"
            >
              Калькуляторы
            </Link>
          </div>
        </div>
      </section>

      {/* Показатели */}
      <div className="border-b border-border">
        <div className="container-page py-6">
          <dl className="grid max-w-md grid-cols-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Статей</dt>
              <dd className="font-display text-2xl font-bold">{ARTICLES.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Калькуляторов</dt>
              <dd className="font-display text-2xl font-bold">{calcs.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Терминов</dt>
              <dd className="font-display text-2xl font-bold">{TERM_ENTRIES.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Что вы планируете */}
      <section
        id="napravlenie"
        className="container-page scroll-mt-20 py-20 md:py-28"
        aria-labelledby="plan-h"
      >
        <div className="max-w-2xl">
          <p className="eyebrow">Два направления</p>
          <h2 id="plan-h" className="mt-3 text-4xl md:text-6xl">
            Что вы планируете?
          </h2>
        </div>
        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          <DirectionCard d="kvartiry" image={IMAGES.apartment} />
          <DirectionCard d="doma" image={IMAGES.house} />
        </div>
      </section>

      {/* Популярные категории */}
      <section className="border-y border-border bg-stone/50" aria-labelledby="pop-h">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Популярное</p>
            <h2 id="pop-h" className="mt-3 text-3xl md:text-[2.75rem]">
              Категории, с которых начинают
            </h2>
            <p className="mt-5 max-w-sm text-muted-foreground">
              Темы, где ошибки обходятся дороже всего, — и где лучше разобраться до покупки
              материалов.
            </p>
          </div>
          <ol className="grid border-t border-border sm:grid-cols-2">
            {POPULAR.map((id, i) => {
              const c = getCategory(id)!;
              return (
                <li
                  key={id}
                  className="border-b border-border sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                >
                  <HrefLink href={urlFor(c)!} className="group flex items-baseline gap-4 py-5">
                    <span className="font-display text-sm font-bold text-primary tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="text-xs text-muted-foreground">
                        {DIRECTIONS[c.direction].title}
                      </span>
                      <span className="block font-display text-xl font-bold group-hover:text-primary">
                        {c.title}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </HrefLink>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Новые статьи */}
      <section className="container-page py-20 md:py-28" aria-labelledby="new-h">
        <SectionHead
          eyebrow="Новое в редакции"
          title="Статьи, которые отвечают на реальные вопросы"
          link={{ to: "/stati", label: "Все статьи" }}
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <FeatureCard c={lead} large />
          <ContentRows items={latest.filter((a) => a.id !== lead.id).slice(0, 5)} />
        </div>
      </section>

      {/* Калькуляторы */}
      <section className="bg-graphite text-graphite-foreground" aria-labelledby="calc-h">
        <div className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] uppercase opacity-60">Калькуляторы</p>
            <h2 id="calc-h" className="mt-3 text-3xl md:text-[2.75rem]">
              Посчитайте материалы до покупки
            </h2>
            <p className="mt-5 max-w-sm opacity-75">
              Каждый расчёт показывает формулу и промежуточные значения. Данные материала вы вводите
              сами — с упаковки или из документации.
            </p>
          </div>
          <ul className="grid border-t border-graphite-foreground/15 sm:grid-cols-2">
            {calcs.map((c) => (
              <li
                key={c.id}
                className="border-b border-graphite-foreground/15 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
              >
                <HrefLink
                  href={urlFor(c)!}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span>
                    <span className="block font-display text-lg font-bold group-hover:text-primary-foreground">
                      {c.title.replace("Калькулятор ", "")}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-sm opacity-60">
                      {c.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-1" />
                </HrefLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Инструкции */}
      <section className="container-page py-20 md:py-28" aria-labelledby="guide-h">
        <SectionHead
          eyebrow="Пошагово"
          title="Инструкции для самостоятельной работы"
          link={{ to: "/instruktsii", label: "Все инструкции" }}
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {GUIDE_ENTRIES.map((g, i) => (
            <li key={g.id} className="bg-background">
              <HrefLink href={urlFor(g)!} className="group flex h-full flex-col p-7 hover:bg-card">
                <span className="font-display text-5xl font-extrabold text-primary/25 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl group-hover:text-primary">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.description}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                  {g.steps.length} шагов · {g.duration}
                </p>
              </HrefLink>
            </li>
          ))}
        </ol>
      </section>

      {/* Материалы и справочник */}
      <section className="border-y border-border" aria-labelledby="mat-h">
        <div className="grid lg:grid-cols-2">
          <img
            src={IMAGES.materials.src}
            alt={IMAGES.materials.alt}
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
          <div className="container-page grid gap-12 py-16 lg:max-w-none lg:px-14 xl:grid-cols-2">
            <div>
              <p className="eyebrow">Материалы</p>
              <h2 id="mat-h" className="mt-3 text-3xl">
                Из чего строят и чем отделывают
              </h2>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {MATERIALS.slice(0, 6).map((m) => (
                  <li key={m.id}>
                    <HrefLink
                      href={urlFor(m)!}
                      className="flex items-center justify-between py-3 font-semibold hover:text-primary"
                    >
                      {m.title} <ArrowRight className="h-4 w-4" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
              <Link
                to="/materialy"
                className="mt-5 inline-block text-sm font-semibold text-accent-foreground hover:underline"
              >
                Все материалы →
              </Link>
            </div>
            <div>
              <p className="eyebrow">Справочник</p>
              <h2 className="mt-3 text-3xl">Термины без жаргона</h2>
              <dl className="mt-6 space-y-4">
                {terms.map((t) => (
                  <div key={t.id}>
                    <dt className="font-semibold">
                      <HrefLink href={urlFor(t)!} className="hover:text-primary">
                        {t.title}
                      </HrefLink>
                    </dt>
                    <dd className="line-clamp-2 text-sm text-muted-foreground">{t.definition}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/spravochnik"
                className="mt-5 inline-block text-sm font-semibold text-accent-foreground hover:underline"
              >
                Весь справочник →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Тематические подборки */}
      <section className="container-page py-20 md:py-28" aria-labelledby="col-h">
        <SectionHead eyebrow="Подборки" title="Связанные темы из обоих направлений" />
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map(({ tag, lead: l }) => {
            const t = TAGS.find((x) => x.id === tag)!;
            const items = PUBLISHED.filter((c) => "tags" in c && c.tags?.includes(tag)).slice(0, 4);
            return (
              <div key={tag} className="border-t-2 border-foreground pt-5">
                <h3 className="text-xl">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l}</p>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {items.map((c) => (
                    <li key={c.id}>
                      <HrefLink href={urlFor(c)!} className="hover:text-primary">
                        {c.title}
                      </HrefLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
