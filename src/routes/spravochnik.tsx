import { slugify } from "@/content/entries";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { GLOSSARY } from "@/data/glossary";

const TITLE = "Справочник строительных терминов — ДомКлючПро";
const DESC =
  "Короткие определения терминов строительства и ремонта: раппорт, стяжка, пароизоляция, мостик холода, отмостка и другие.";

export const Route = createFileRoute("/spravochnik")({
  head: () => ({
    links: [{ rel: "canonical", href: "/spravochnik" }],
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/spravochnik" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "ru"));
  const letters = [...new Set(sorted.map((t) => t.term.charAt(0).toUpperCase()))];
  return (
    <>
      <PageHeader
        eyebrow="Сервисы"
        title="Справочник"
        lead="Термины, которые встречаются в сметах, инструкциях и на этикетках материалов."
        crumbs={[{ to: "/spravochnik", label: "Справочник" }]}
      />
      <div className="container-page py-14">
        <nav aria-label="Алфавит" className="mb-10 flex flex-wrap gap-2">
          {letters.map((l) => (
            <a
              key={l}
              href={`#l-${l}`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border font-display font-bold hover:border-primary hover:text-primary"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="space-y-12">
          {letters.map((l) => (
            <section
              key={l}
              id={`l-${l}`}
              className="grid scroll-mt-28 gap-4 md:grid-cols-[5rem_1fr]"
            >
              <h2 className="font-display text-4xl text-primary">{l}</h2>
              <dl className="divide-y divide-border border-t border-border">
                {sorted
                  .filter((t) => t.term.charAt(0).toUpperCase() === l)
                  .map((t) => (
                    <div
                      key={t.term}
                      id={slugify(t.term)}
                      className="grid scroll-mt-28 gap-2 py-5 md:grid-cols-[14rem_1fr]"
                    >
                      <dt className="font-semibold">{t.term}</dt>
                      <dd className="text-muted-foreground">{t.definition}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
