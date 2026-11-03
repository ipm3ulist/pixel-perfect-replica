import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { COMPARISONS, getSection } from "@/monetization/data/catalog";
import { ComparisonTable } from "@/monetization/components/ComparisonTable";
import { pageHead } from "@/lib/seo";

const find = (slug: string) => COMPARISONS.find((c) => c.slug === slug);

export const Route = createFileRoute("/sravnenie/$slug")({
  loader: ({ params }) => {
    if (!find(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData && find(loaderData.slug);
    if (!c)
      return {
        meta: [
          { title: "Сравнение недоступно — ДомКлючПро" },
          { name: "robots", content: "noindex" },
        ],
      };
    const path = `/sravnenie/${c.slug}`;
    return pageHead({
      title: `Сравнение: ${c.title}`,
      description: c.description,
      path,
      crumbs: [
        { to: "/katalog", label: "Каталог материалов" },
        { to: path, label: c.title },
      ],
    });
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Сравнение не найдено</h1>
      <Link to="/katalog" className="mt-6 inline-block font-semibold underline">
        Каталог
      </Link>
    </div>
  ),
});

function Page() {
  const c = find(Route.useLoaderData().slug)!;
  const s = getSection(c.section);
  return (
    <>
      <PageHeader
        eyebrow="Сравнение"
        title={c.title}
        lead={c.description}
        crumbs={[
          { to: "/katalog", label: "Каталог материалов" },
          { to: `/sravnenie/${c.slug}`, label: c.title },
        ]}
      />
      <div className="container-page py-14">
        <ComparisonTable c={c} />
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          Численные характеристики и цены зависят от конкретного продукта и продавца, поэтому мы их
          не приводим. Сверяйтесь с документацией производителя и проектом.
        </p>
        {s && (
          <Link
            to="/katalog/$section"
            params={{ section: s.id }}
            className="mt-8 inline-block font-semibold text-accent-foreground underline underline-offset-4"
          >
            Раздел каталога: {s.title}
          </Link>
        )}
      </div>
    </>
  );
}
