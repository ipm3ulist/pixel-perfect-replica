import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Clock, TriangleAlert, Wrench } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { getGuide } from "@/data/guides";
import { breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/instruktsii/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Инструкция не найдена — ДомКлючПро" },
          { name: "robots", content: "noindex" },
        ],
      };
    const title = `${loaderData.title} — инструкция ДомКлючПро`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/instruktsii/${loaderData.slug}` },
      ],
      links: [{ rel: "canonical", href: `/instruktsii/${loaderData.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: loaderData.title,
            description: loaderData.description,
            tool: loaderData.tools.map((t) => ({ "@type": "HowToTool", name: t })),
            step: loaderData.steps.map((st, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: st.title,
              text: st.text,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { to: "/instruktsii", label: "Инструкции" },
              { to: `/instruktsii/${loaderData.slug}`, label: loaderData.title },
            ]),
          ),
        },
      ],
    };
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Инструкция не найдена</h1>
      <Link
        to="/instruktsii"
        className="mt-6 inline-block font-semibold text-accent-foreground underline"
      >
        Все инструкции
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24">Не удалось загрузить инструкцию.</div>
  ),
});

function Page() {
  const g = Route.useLoaderData();
  return (
    <>
      <PageHeader
        eyebrow="Инструкция"
        title={g.title}
        lead={g.description}
        crumbs={[{ to: "/instruktsii", label: "Инструкции" }]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <ol className="space-y-0">
          {g.steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-4 pb-10 last:pb-0">
              <span className="flex h-10 w-10 items-center justify-center rounded bg-graphite font-display font-extrabold text-graphite-foreground">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h2 className="text-xl md:text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="space-y-5">
          <div className="rounded border border-border bg-card p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              {g.duration}
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
              <Wrench className="h-4 w-4 text-primary" />
              Понадобится
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {g.tools.map((t) => (
                <li key={t}>— {t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-warning/40 bg-warning-surface p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TriangleAlert className="h-4 w-4 text-warning" />
              Частые ошибки
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {g.mistakes.map((t) => (
                <li key={t}>— {t}</li>
              ))}
            </ul>
          </div>
          {g.calculator && (
            <Link
              to="/kalkulyatory/oboi"
              className="flex items-center justify-between rounded bg-primary p-6 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Калькулятор обоев <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
