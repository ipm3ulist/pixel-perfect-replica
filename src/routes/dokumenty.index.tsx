import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { LEGAL_DOCS } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dokumenty/")({
  head: () =>
    pageHead({
      title: "Правовые документы ДомКлючПро",
      description:
        "Политика конфиденциальности, cookies, согласие на обработку данных, правила сайта и раскрытие партнёрских отношений.",
      path: "/dokumenty",
      crumbs: [{ to: "/dokumenty", label: "Документы" }],
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Проект"
        title="Документы"
        lead="Как сайт обращается с данными, cookies и рекламой."
        crumbs={[{ to: "/dokumenty", label: "Документы" }]}
      />
      <ul className="container-page grid gap-4 py-14 md:grid-cols-2">
        {LEGAL_DOCS.map((d) => (
          <li key={d.slug}>
            <Link
              to="/dokumenty/$slug"
              params={{ slug: d.slug }}
              className="block h-full border border-border bg-card p-6 hover:border-primary"
            >
              <span className="font-display text-lg font-bold">{d.title}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{d.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
