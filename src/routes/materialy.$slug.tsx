import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Blocks } from "@/components/content/Blocks";
import { ContentRows } from "@/components/content/ContentList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HrefLink } from "@/components/site/HrefLink";
import { MATERIALS } from "@/content/materials";
import {
  DIRECTIONS,
  MATERIAL_GROUPS,
  getCategory,
  relatedOf,
  urlFor,
  type Material,
} from "@/content";
import { PartnerBlock } from "@/monetization/PartnerBlock";
import { MaterialsForWork } from "@/monetization/components/MaterialsForWork";
import { articleLd, pageHead } from "@/lib/seo";

const getMaterial = (slug: string) =>
  MATERIALS.find((m) => m.slug === slug && m.status === "published");
const crumbsOf = (m: Material) => [
  { to: "/materialy", label: "Материалы" },
  { to: `/materialy/${m.slug}`, label: m.title },
];

export const Route = createFileRoute("/materialy/$slug")({
  loader: ({ params }) => {
    const m = getMaterial(params.slug);
    if (!m) throw notFound();
    return { slug: m.slug };
  },
  head: ({ loaderData }) => {
    const m = loaderData && getMaterial(loaderData.slug);
    if (!m)
      return {
        meta: [
          { title: "Материал недоступен — ДомКлючПро" },
          { name: "robots", content: "noindex" },
        ],
      };
    const path = `/materialy/${m.slug}`;
    return pageHead({
      title: m.seo.title,
      description: m.seo.description,
      path,
      type: "article",
      crumbs: crumbsOf(m),
      jsonLd: [
        articleLd({ title: m.title, description: m.description, path, updatedAt: m.updatedAt }),
      ],
    });
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Материал не найден</h1>
      <Link
        to="/materialy"
        className="mt-6 inline-block font-semibold text-accent-foreground underline"
      >
        Все материалы
      </Link>
    </div>
  ),
});

function Facts({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-border pt-4">
      <h2 className="font-display text-sm font-bold tracking-wider uppercase">{title}</h2>
      <ul className="mt-3 space-y-2 text-[0.95rem] text-muted-foreground">
        {items.map((x) => (
          <li key={x} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-primary" />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Page() {
  const m = getMaterial(Route.useLoaderData().slug)!;
  const related = relatedOf(m);
  return (
    <article>
      <header className="border-b border-border">
        <div
          className={`container-page grid gap-10 py-10 md:py-14 ${m.image ? "lg:grid-cols-[1.1fr_1fr] lg:items-end" : ""}`}
        >
          <div>
            <Breadcrumbs crumbs={crumbsOf(m)} />
            <p className="eyebrow">{MATERIAL_GROUPS[m.group]}</p>
            <h1 className="mt-3 text-4xl md:text-6xl">{m.title}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{m.description}</p>
          </div>
          {m.image && (
            <img
              src={m.image.src}
              alt={m.image.alt}
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
          )}
        </div>
      </header>
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <Facts title="Где применяют" items={m.uses} />
        <Facts title="Сильные стороны" items={m.pros} />
        <Facts title="Ограничения" items={m.limits} />
      </div>
      <div className="container-page grid gap-12 pb-14 lg:grid-cols-[1fr_18rem]">
        <div>
          <Blocks blocks={m.content} />
          <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            Конкретные характеристики — прочность, теплопроводность, расход — указывает
            производитель выбранного продукта в технической документации.
          </p>
        </div>
        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Где встречается</p>
            <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
              {m.categories.map((id) => {
                const c = getCategory(id)!;
                return (
                  <li key={id}>
                    <HrefLink href={urlFor(c)!} className="block py-3 hover:text-primary">
                      <span className="text-xs text-muted-foreground">
                        {DIRECTIONS[c.direction].title} ·{" "}
                      </span>
                      <span className="font-semibold">{c.title}</span>
                    </HrefLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <MaterialsForWork id={m.id} placement="material" title="Где выбрать" />
          <PartnerBlock content={m.id} categories={m.categories} />
        </aside>
      </div>
      {related.length > 0 && (
        <section className="border-t border-border bg-stone/50">
          <div className="container-page py-14">
            <h2 className="mb-6 text-2xl">По теме</h2>
            <ContentRows items={related} />
          </div>
        </section>
      )}
    </article>
  );
}
