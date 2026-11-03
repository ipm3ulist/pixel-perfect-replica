import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { GUIDES } from "@/data/guides";

const TITLE = "Инструкции по ремонту и отделке — ДомКлючПро";
const DESC =
  "Пошаговые инструкции: замер помещения, подготовка стен, поклейка обоев. Инструменты, порядок работ и типичные ошибки.";

export const Route = createFileRoute("/instruktsii/")({
  head: () => ({
    links: [{ rel: "canonical", href: "/instruktsii" }],
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/instruktsii" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Сервисы"
        title="Инструкции"
        lead="Работы в той последовательности, в которой их выполняют на объекте, — с перечнем инструментов и частыми ошибками."
        crumbs={[{ to: "/instruktsii", label: "Инструкции" }]}
      />
      <div className="container-page py-14">
        <ol className="divide-y divide-border border-y border-border">
          {GUIDES.map((g, i) => (
            <li key={g.slug}>
              <Link
                to="/instruktsii/$slug"
                params={{ slug: g.slug }}
                className="group grid gap-3 py-8 md:grid-cols-[4rem_1fr_auto] md:items-center"
              >
                <span className="font-display text-2xl font-extrabold text-primary/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-2xl font-bold group-hover:text-primary">
                    {g.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-muted-foreground">
                    {g.description}
                  </span>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {g.steps.length} шагов · {g.duration}
                  </span>
                </span>
                <ArrowRight className="hidden h-6 w-6 text-primary transition-transform group-hover:translate-x-1 md:block" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
