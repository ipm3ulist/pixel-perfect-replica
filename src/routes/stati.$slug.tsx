import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Blocks } from "@/components/content/Blocks";
import { ContentRows } from "@/components/content/ContentList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HrefLink } from "@/components/site/HrefLink";
import { categoryCrumbs } from "@/components/site/CategoryPage";
import { ARTICLE_ENTRIES } from "@/content/entries";
import { DIRECTIONS, getCategory, relatedOf, urlFor, type Article } from "@/content";
import { AdSlot, PartnerBlock } from "@/monetization/PartnerBlock";
import { NextSteps } from "@/components/content/NextSteps";
import { MaterialsForWork } from "@/monetization/components/MaterialsForWork";
import { articleLd, pageHead } from "@/lib/seo";

const getArticle = (slug: string) =>
  ARTICLE_ENTRIES.find((a) => a.slug === slug && a.status === "published");
const crumbsOf = (a: Article) => [
  ...categoryCrumbs(getCategory(a.primaryCategory)!),
  { to: `/stati/${a.slug}`, label: a.title },
];

export const Route = createFileRoute("/stati/$slug")({
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug };
  },
  head: ({ loaderData }) => {
    const a = loaderData && getArticle(loaderData.slug);
    if (!a)
      return {
        meta: [{ title: "Статья недоступна — ДомКлючПро" }, { name: "robots", content: "noindex" }],
      };
    const path = `/stati/${a.slug}`;
    return pageHead({
      title: a.seo.title,
      description: a.seo.description,
      path,
      type: "article",
      crumbs: crumbsOf(a),
      jsonLd: [
        articleLd({ title: a.title, description: a.description, path, updatedAt: a.updatedAt }),
      ],
    });
  },
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Статья не найдена</h1>
      <Link
        to="/stati"
        className="mt-6 inline-block font-semibold text-accent-foreground underline"
      >
        Все статьи
      </Link>
    </div>
  ),
});

function Page() {
  const a = getArticle(Route.useLoaderData().slug)!;
  const toc = a.content.reduce<
    { id: string; text: string; children: { id: string; text: string }[] }[]
  >((items, block) => {
    if (block.type === "h2") {
      items.push({ id: block.id, text: block.text, children: [] });
    } else if (block.type === "h3" && items.length > 0) {
      items[items.length - 1]!.children.push({
        id: block.id,
        text: block.text,
      });
    }
    return items;
  }, []);
  const related = relatedOf(a);
  const cats = a.categories.map(getCategory).filter((c) => !!c);
  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs crumbs={crumbsOf(a)} />
          <p className="eyebrow">Статья</p>
          <h1 className="mt-3 max-w-4xl text-4xl md:text-5xl">{a.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{a.description}</p>
          {a.updatedAt && (
            <p className="mt-6 text-xs text-muted-foreground">
              Обновлено{" "}
              <time dateTime={a.updatedAt}>
                {new Date(a.updatedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </p>
          )}
        </div>
        {a.image && (
          <div className="container-page pb-10">
            <img
              src={a.image.src}
              alt={a.image.alt}
              className="aspect-[21/9] w-full rounded-sm object-cover"
            />
          </div>
        )}
      </header>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[14rem_1fr_16rem]">
        <nav aria-label="Содержание статьи" className="hidden lg:block">
          <div className="sticky top-28">
            <p className="eyebrow mb-4">Содержание</p>
            <ol className="space-y-2 border-l border-border text-sm">
              {toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="-ml-px block border-l-2 border-transparent pl-4 text-muted-foreground hover:border-primary hover:text-foreground"
                  >
                    {h.text}
                  </a>
                  {h.children.length > 0 && (
                    <ol className="mt-2 space-y-2 pl-4">
                      {h.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            className="block text-xs leading-relaxed text-muted-foreground hover:text-foreground"
                          >
                            {child.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="min-w-0">
          <Blocks blocks={a.content} />
          <AdSlot id="article-inline" />
          <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            Материал носит справочный характер и не заменяет проект, расчёт или консультацию
            профильного специалиста.
          </p>
        </div>
        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Категории</p>
            <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
              {cats.map((c) => (
                <li key={c!.id}>
                  <HrefLink href={urlFor(c!)!} className="block py-3 hover:text-primary">
                    <span className="text-xs text-muted-foreground">
                      {DIRECTIONS[c!.direction].title} ·{" "}
                    </span>
                    <span className="font-semibold">{c!.title}</span>
                  </HrefLink>
                </li>
              ))}
            </ul>
          </div>
          {related
            .filter((r) => r.kind === "calculator")
            .map((r) => (
              <HrefLink
                key={r.id}
                href={urlFor(r)!}
                className="flex items-center justify-between rounded-sm bg-primary p-5 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {r.title} <ArrowRight className="h-5 w-5" />
              </HrefLink>
            ))}
          <MaterialsForWork id={a.id} placement="article" />
          <PartnerBlock content={a.id} categories={a.categories} />
          <AdSlot id="article-aside" />
        </aside>
      </div>
      {related.filter((r) => r.kind !== "calculator").length > 0 && (
        <section className="border-t border-border bg-stone/50">
          <div className="container-page py-14">
            <h2 className="mb-6 text-2xl">Читайте также</h2>
            <ContentRows items={related.filter((r) => r.kind !== "calculator")} />
          </div>
        </section>
      )}
      <NextSteps item={a} />
    </article>
  );
}
