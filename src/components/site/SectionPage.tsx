import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SECTIONS, type Section, type Topic } from "@/data/sections";
import { MAIN_NAV } from "@/data/site";
import { PageHeader } from "./PageHeader";

export function sectionHead(slug: Section["slug"]) {
  const s = SECTIONS[slug];
  const title = `${s.metaTitle} — ДомКлючПро`;
  return {
    meta: [
      { title },
      { name: "description", content: s.description },
      { property: "og:title", content: title },
      { property: "og:description", content: s.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `/${slug}` },
    ],
    links: [{ rel: "canonical", href: `/${slug}` }],
  };
}

function TopicLink({ link }: { link: NonNullable<Topic["link"]> }) {
  const cls =
    "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground hover:gap-3 transition-all";
  if (link.params?.["slug"])
    return (
      <Link to="/instruktsii/$slug" params={{ slug: link.params["slug"] }} className={cls}>
        {link.label} <ArrowRight className="h-4 w-4" />
      </Link>
    );
  return (
    <Link to="/kalkulyatory/oboi" className={cls}>
      {link.label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SectionPage({ slug }: { slug: Section["slug"] }) {
  const s = SECTIONS[slug];
  const index = MAIN_NAV.findIndex((n) => n.to === `/${slug}`);
  const next = MAIN_NAV[(index + 1) % MAIN_NAV.length]!;
  return (
    <>
      <PageHeader
        eyebrow={`Раздел ${String(index + 1).padStart(2, "0")}`}
        title={s.title}
        lead={s.lead}
        crumbs={[{ to: `/${slug}` as (typeof MAIN_NAV)[number]["to"], label: s.title }]}
      />
      <div className="container-page grid gap-8 py-10 md:py-14 lg:gap-12 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="Содержание раздела" className="sticky top-28">
            <p className="eyebrow mb-4">Содержание</p>
            <ol className="space-y-2 border-l border-border text-sm">
              {s.topics.map((t, i) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="-ml-px block border-l-2 border-transparent pl-4 text-muted-foreground hover:border-primary hover:text-foreground"
                  >
                    <span className="mr-2 tabular-nums text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <details className="rounded border border-border bg-card lg:hidden">
          <summary className="cursor-pointer px-5 py-4 font-semibold">Содержание раздела</summary>
          <ol className="space-y-1 border-t border-border px-5 py-3 text-sm">
            {s.topics.map((t, i) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="block py-2 text-muted-foreground hover:text-foreground"
                >
                  <span className="mr-2 text-xs tabular-nums text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
        </details>
        <div className="divide-y divide-border">
          {s.topics.map((t, i) => (
            <article
              key={t.id}
              id={t.id}
              className="grid scroll-mt-28 gap-4 py-10 first:pt-0 md:grid-cols-[4rem_1fr]"
            >
              <span className="font-display text-3xl font-extrabold text-primary/70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl">{t.title}</h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">{t.text}</p>
                <ul className="mt-5 grid gap-3">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[0.95rem]">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
                {t.link && <TopicLink link={t.link} />}
              </div>
            </article>
          ))}
          <div className="pt-10">
            <Link
              to={next.to}
              className="group flex items-center justify-between rounded border border-border bg-card p-6 hover:border-primary"
            >
              <span>
                <span className="eyebrow">Следующий раздел</span>
                <span className="mt-1 block font-display text-2xl font-bold">{next.label}</span>
              </span>
              <ArrowRight className="h-6 w-6 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
