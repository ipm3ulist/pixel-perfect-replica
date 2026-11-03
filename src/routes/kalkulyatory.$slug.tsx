import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ContentRows } from "@/components/content/ContentList";
import { PageHeader } from "@/components/site/PageHeader";
import { CALCULATOR_ENTRIES } from "@/content/entries";
import { PUBLISHED } from "@/content";
import { CALC_CONFIGS, type CalcConfig } from "@/features/calculators/configs";
import { GenericCalculator } from "@/features/calculators/GenericCalculator";
import { pageHead } from "@/lib/seo";
import type { CatalogSectionId } from "@/monetization/types";

const NEXT: Partial<Record<string, CatalogSectionId>> = {
  kraska: "kraski",
  plitka: "plitka",
  laminat: "napolnye",
};

const getCalc = (slug: string) => {
  const entry = CALCULATOR_ENTRIES.find((c) => c.slug === slug && c.status === "published");
  const config = CALC_CONFIGS[slug as CalcConfig["slug"]];
  return entry && config ? { entry, config } : undefined;
};

export const Route = createFileRoute("/kalkulyatory/$slug")({
  loader: ({ params }) => {
    if (!getCalc(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData && getCalc(loaderData.slug);
    if (!c)
      return {
        meta: [
          { title: "Калькулятор недоступен — ДомКлючПро" },
          { name: "robots", content: "noindex" },
        ],
      };
    const path = `/kalkulyatory/${c.entry.slug}`;
    return pageHead({
      title: c.entry.seo.title,
      description: c.entry.seo.description,
      path,
      crumbs: [
        { to: "/kalkulyatory", label: "Калькуляторы" },
        { to: path, label: c.entry.title },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: c.entry.title,
          description: c.entry.description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          inLanguage: "ru",
          isAccessibleForFree: true,
        },
      ],
    });
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Калькулятор не найден</h1>
      <Link
        to="/kalkulyatory"
        className="mt-6 inline-block font-semibold text-accent-foreground underline"
      >
        Все калькуляторы
      </Link>
    </div>
  ),
});

function Page() {
  const { entry, config } = getCalc(Route.useLoaderData().slug)!;
  const related = PUBLISHED.filter((c) => c.related?.includes(entry.id));
  return (
    <>
      <PageHeader
        eyebrow="Калькулятор"
        title={entry.title}
        lead={entry.description}
        crumbs={[
          { to: "/kalkulyatory", label: "Калькуляторы" },
          { to: `/kalkulyatory/${entry.slug}`, label: entry.title },
        ]}
      />
      <div className="container-page py-12">
        <GenericCalculator key={entry.slug} config={config} nextSection={NEXT[entry.slug]} />
      </div>
      {related.length > 0 && (
        <section className="border-t border-border bg-stone/50">
          <div className="container-page py-14">
            <h2 className="mb-6 text-2xl">Перед расчётом прочитайте</h2>
            <ContentRows items={related} />
          </div>
        </section>
      )}
    </>
  );
}
