import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ROOMS } from "@/data/rooms";
import { ContentRows, FeatureCard } from "@/components/content/ContentList";
import {
  DIRECTIONS,
  PUBLISHED,
  categoriesOf,
  contentInCategory,
  urlFor,
  type Content,
  type DirectionId,
} from "@/content";
import { IMAGES } from "@/content/images";
import { SECTIONS } from "@/data/sections";
import { pageHead } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { HrefLink } from "./HrefLink";

const META: Record<
  DirectionId,
  {
    title: string;
    description: string;
    lead: string;
    image: keyof typeof IMAGES;
    other: DirectionId;
  }
> = {
  kvartiry: {
    title: "Квартиры: ремонт, отделка и обустройство",
    description:
      "Всё о ремонте квартиры: планирование, стены, полы, потолки, электрика, ванная, кухня, шумоизоляция — статьи, инструкции и калькуляторы.",
    lead: SECTIONS.kvartiry.lead,
    image: "apartment",
    other: "doma",
  },
  doma: {
    title: "Частные дома: от участка до обслуживания",
    description:
      "Частный дом от выбора участка до эксплуатации: проект, фундамент, стены, кровля, фасад, утепление, инженерия и отделка.",
    lead: SECTIONS.doma.lead,
    image: "house",
    other: "kvartiry",
  },
};

export const directionHead = (d: DirectionId) =>
  pageHead({
    title: META[d].title,
    description: META[d].description,
    path: `/${d}`,
    crumbs: [{ to: `/${d}`, label: DIRECTIONS[d].title }],
  });

export function DirectionPage({ direction }: { direction: DirectionId }) {
  const m = META[direction];
  const cats = categoriesOf(direction);
  const img = IMAGES[m.image];
  const inDirection = PUBLISHED.filter(
    (c): c is Extract<Content, { categories: unknown }> =>
      "categories" in c && c.categories.some((id) => id.startsWith(direction + ".")),
  );
  const featured = inDirection.filter((c) => c.kind === "article" && c.image).slice(0, 3);
  const calcs = inDirection.filter((c) => c.kind === "calculator");
  const guides = inDirection.filter((c) => c.kind === "guide");
  const section = SECTIONS[direction];

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page grid gap-10 py-10 md:py-14 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div className="lg:pb-6">
            <Breadcrumbs crumbs={[{ to: `/${direction}`, label: DIRECTIONS[direction].title }]} />
            <p className="eyebrow">Направление</p>
            <h1 className="mt-3 text-5xl md:text-7xl">{DIRECTIONS[direction].title}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{m.lead}</p>
            <p className="mt-8 text-sm text-muted-foreground">
              {cats.length} категорий · {inDirection.filter((c) => c.kind === "article").length}{" "}
              статей · {calcs.length} калькуляторов
            </p>
          </div>
          <img
            src={img.src}
            alt={img.alt}
            width={1280}
            height={1600}
            className="aspect-[4/3] w-full rounded-sm object-cover lg:aspect-[5/4]"
          />
        </div>
      </section>

      <section className="container-page py-16 md:py-20" aria-labelledby="cats">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Категории</p>
            <h2 id="cats" className="mt-3 text-3xl md:text-4xl">
              Из чего состоит {direction === "kvartiry" ? "ремонт квартиры" : "частный дом"}
            </h2>
          </div>
          <ol className="grid border-t border-border sm:grid-cols-2">
            {cats.map((c, i) => {
              const count = contentInCategory(c.id).length;
              return (
                <li
                  key={c.id}
                  className="border-b border-border sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                >
                  <HrefLink href={urlFor(c)!} className="group flex gap-4 py-5">
                    <span className="font-display text-sm font-bold text-primary tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-3 font-display text-lg font-bold group-hover:text-primary">
                        {c.title}
                        <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {c.description}
                      </span>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        {count} материалов
                      </span>
                    </span>
                  </HrefLink>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {direction === "kvartiry" && (
        <section className="container-page pb-16 md:pb-20" aria-labelledby="rooms">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">Помещения</p>
              <h2 id="rooms" className="mt-3 text-3xl md:text-4xl">Ремонт по комнатам</h2>
              <Link to="/kvartiry/pomeshcheniya" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                Все помещения <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="flex flex-wrap content-start gap-2">
              {ROOMS.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/kvartiry/pomeshcheniya/$room"
                    params={{ room: r.slug }}
                    className="inline-block rounded-sm border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {direction === "doma" && (
        <section className="container-page pb-16 md:pb-20" aria-labelledby="house-tools">
          <p className="eyebrow">Инструменты</p>
          <h2 id="house-tools" className="mt-3 text-3xl md:text-4xl">
            Соберите параметры своего дома
          </h2>
          <div className="mt-8 grid border-t border-border md:grid-cols-3 md:border-t-0">
            {(
              [
                [
                  "/doma/konfigurator",
                  "Конфигуратор дома",
                  "Девять шагов: габариты, стены, кровля, инженерия. Площади и карточка конфигурации.",
                ],
                [
                  "/doma/smeta",
                  "Структура сметы",
                  "Какие работы войдут в стройку и от чего зависят объёмы.",
                ],
                [
                  "/doma/proekty",
                  "Примеры конфигураций",
                  "Три сценария дома, которые можно открыть и изменить.",
                ],
              ] as const
            ).map(([href, t, d]) => (
              <HrefLink
                key={href}
                href={href}
                className="group block border-b border-border py-6 md:border-t md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
              >
                <p className="flex items-center justify-between font-display text-xl font-bold group-hover:text-primary">
                  {t} <ArrowRight className="h-4 w-4" />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </HrefLink>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="border-y border-border bg-stone/50">
          <div className="container-page py-16 md:py-20">
            <p className="eyebrow">Главное в направлении</p>
            <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
              {featured.map((c, i) => (
                <FeatureCard key={c.id} c={c} large={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="eyebrow">Порядок решений</p>
          <h2 className="mt-3 text-3xl">{section.title}: ключевые темы</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {section.topics.map((t, i) => (
              <details key={t.id} id={t.id} className="group scroll-mt-28 py-5">
                <summary className="flex cursor-pointer list-none items-baseline gap-4">
                  <span className="font-display text-sm font-bold text-primary tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-xl font-bold">{t.title}</span>
                  <span
                    className="text-muted-foreground transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-4 pl-9">
                  <p className="text-muted-foreground">{t.text}</p>
                  <ul className="mt-4 grid gap-2 text-[0.95rem]">
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
        <aside className="space-y-10">
          {calcs.length > 0 && (
            <div>
              <p className="eyebrow">Калькуляторы</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {calcs.map((c) => (
                  <li key={c.id}>
                    <HrefLink
                      href={urlFor(c)!}
                      className="flex items-center justify-between py-3 font-semibold hover:text-primary"
                    >
                      {c.title} <ArrowRight className="h-4 w-4" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {guides.length > 0 && (
            <div>
              <p className="eyebrow">Инструкции</p>
              <div className="mt-4">
                <ContentRows items={guides} />
              </div>
            </div>
          )}
          <HrefLink
            href={`/${m.other}`}
            className="group block rounded-sm bg-graphite p-6 text-graphite-foreground"
          >
            <span className="text-xs tracking-wider uppercase opacity-70">Другое направление</span>
            <span className="mt-2 flex items-center justify-between font-display text-2xl font-bold">
              {DIRECTIONS[m.other].title}{" "}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </HrefLink>
        </aside>
      </section>
    </>
  );
}
