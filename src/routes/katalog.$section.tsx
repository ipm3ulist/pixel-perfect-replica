import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ContentRows } from "@/components/content/ContentList";
import { PageHeader } from "@/components/site/PageHeader";
import { getContent, isPublished, type Content } from "@/content";
import { CATALOG, COMPARISONS } from "@/monetization/data/catalog";
import { ProductList } from "@/monetization/components/ProductCard";
import { productsFor } from "@/monetization/select";
import type { CatalogSectionId } from "@/monetization/types";
import { pageHead } from "@/lib/seo";

const find = (id: string) => CATALOG.find((s) => s.id === id);

export const Route = createFileRoute("/katalog/$section")({
  loader: ({ params }) => {
    if (!find(params.section)) throw notFound();
    return { id: params.section as CatalogSectionId };
  },
  head: ({ loaderData }) => {
    const s = loaderData && find(loaderData.id);
    if (!s)
      return {
        meta: [{ title: "Раздел недоступен — ДомКлючПро" }, { name: "robots", content: "noindex" }],
      };
    const path = `/katalog/${s.id}`;
    return pageHead({
      title: `${s.title}: как выбрать`,
      description: s.description,
      path,
      crumbs: [
        { to: "/katalog", label: "Каталог материалов" },
        { to: path, label: s.title },
      ],
    });
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Раздел не найден</h1>
      <Link to="/katalog" className="mt-6 inline-block font-semibold underline">
        Весь каталог
      </Link>
    </div>
  ),
});

function Page() {
  const s = find(Route.useLoaderData().id)!;
  const items = productsFor(s.id);
  const linked = [...(s.materials ?? []), ...(s.calculators ?? []), ...(s.content ?? [])]
    .map((id) => getContent(id))
    .filter((c): c is Content => !!c && isPublished(c));
  const cmp = COMPARISONS.filter((c) => c.section === s.id);
  return (
    <>
      <PageHeader
        eyebrow="Каталог"
        title={s.title}
        lead={s.description}
        crumbs={[
          { to: "/katalog", label: "Каталог материалов" },
          { to: `/katalog/${s.id}`, label: s.title },
        ]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl">Что проверить при выборе</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5">
              {s.howToChoose.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="offers">
            <h2 id="offers" className="text-2xl">
              Предложения магазинов
            </h2>
            {items.length ? (
              <div className="mt-6">
                <ProductList items={items} placement="catalog" />
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                Пока нет: мы не показываем товары без подтверждённого партнёрства, реальной ссылки и
                маркировки рекламы.
              </p>
            )}
          </section>
        </div>
        <aside className="space-y-8">
          {cmp.map((c) => (
            <Link
              key={c.slug}
              to="/sravnenie/$slug"
              params={{ slug: c.slug }}
              className="block border border-border bg-card p-5 hover:border-primary"
            >
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Сравнение
              </span>
              <span className="mt-1 block font-semibold">{c.title}</span>
            </Link>
          ))}
        </aside>
      </div>
      {linked.length > 0 && (
        <section className="border-t border-border bg-stone/50">
          <div className="container-page py-14">
            <h2 className="mb-6 text-2xl">Статьи, материалы и калькуляторы</h2>
            <ContentRows items={linked} />
          </div>
        </section>
      )}
    </>
  );
}
