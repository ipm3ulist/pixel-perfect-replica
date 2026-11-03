import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CATALOG, COMPARISONS } from "@/monetization/data/catalog";
import { pageHead } from "@/lib/seo";

const DESC =
  "Разделы материалов для ремонта и строительства: что проверить при выборе, расчёт количества и сравнение. Без выдуманных цен и рейтингов.";
const crumbs = [{ to: "/katalog", label: "Каталог материалов" }];

export const Route = createFileRoute("/katalog/")({
  head: () =>
    pageHead({
      title: "Каталог материалов для ремонта и строительства",
      description: DESC,
      path: "/katalog",
      crumbs,
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Каталог"
        title="Материалы для работы"
        lead="Как выбрать, сколько взять и с чем сравнить. Товары партнёров появятся здесь только после подключения реальных магазинов и всегда с пометкой «Реклама»."
        crumbs={crumbs}
      />
      <div className="container-page py-14">
        <ol className="grid border-t border-border md:grid-cols-3">
          {CATALOG.map((s, i) => (
            <li
              key={s.id}
              className="border-b border-border md:border-r md:[&:nth-child(3n)]:border-r-0"
            >
              <Link
                to="/katalog/$section"
                params={{ section: s.id }}
                className="block h-full p-6 hover:bg-card"
              >
                <span className="text-xs tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-xl">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </Link>
            </li>
          ))}
        </ol>
        <section className="mt-16" aria-labelledby="cmp">
          <h2 id="cmp" className="text-2xl">
            Сравнения
          </h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {COMPARISONS.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/sravnenie/$slug"
                  params={{ slug: c.slug }}
                  className="block py-4 hover:text-primary"
                >
                  <span className="font-semibold">{c.title}</span>
                  <span className="block text-sm text-muted-foreground">{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
