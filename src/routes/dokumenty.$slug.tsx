import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { LEGAL_DOCS, LEGAL_UPDATED, legalBySlug } from "@/data/legal";
import { openCookieSettings } from "@/lib/consent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dokumenty/$slug")({
  loader: ({ params }) => {
    const doc = legalBySlug(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.doc.title,
          description: loaderData.doc.description,
          path: `/dokumenty/${loaderData.doc.slug}`,
          crumbs: [
            { to: "/dokumenty", label: "Документы" },
            { to: `/dokumenty/${loaderData.doc.slug}`, label: loaderData.doc.title },
          ],
        })
      : {},
  component: Page,
});

function Page() {
  const { doc } = Route.useLoaderData();
  return (
    <>
      <PageHeader
        eyebrow="Документы"
        title={doc.title}
        lead={doc.description}
        crumbs={[
          { to: "/dokumenty", label: "Документы" },
          { to: `/dokumenty/${doc.slug}`, label: doc.title },
        ]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_16rem]">
        <article className="prose-dk max-w-3xl">
          <p className="border-l-2 border-warning bg-warning-surface p-4 text-sm">
            Шаблон для проверки владельцем проекта и юристом. Поля в квадратных скобках нужно
            заполнить. Документ не является заявлением о соответствии законодательству.
          </p>
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          {doc.slug === "politika-cookies" && (
            <button
              type="button"
              onClick={openCookieSettings}
              className="mt-6 rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Открыть настройки cookies
            </button>
          )}
          <p className="text-sm text-muted-foreground">Редакция от {LEGAL_UPDATED}</p>
        </article>
        <aside>
          <h2 className="font-display text-sm font-bold tracking-wider uppercase">Все документы</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/dokumenty/$slug"
                  params={{ slug: d.slug }}
                  className="hover:text-primary data-[status=active]:font-semibold"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
