import { ArrowRight } from "lucide-react";
import { ContentRows } from "@/components/content/ContentList";
import {
  DIRECTIONS,
  contentInCategory,
  getCategory,
  urlFor,
  type Category,
  type Content,
} from "@/content";
import { AdSlot, PartnerBlock } from "@/monetization/PartnerBlock";
import { pageHead } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { HrefLink } from "./HrefLink";

export const categoryCrumbs = (c: Category) => [
  { to: `/${c.direction}`, label: DIRECTIONS[c.direction].title },
  { to: urlFor(c)!, label: c.title },
];

export const categoryHead = (c: Category | undefined) =>
  c
    ? pageHead({
        title: c.seo.title,
        description: c.seo.description,
        path: urlFor(c)!,
        crumbs: categoryCrumbs(c),
      })
    : {
        meta: [
          { title: "Категория не найдена — ДомКлючПро" },
          { name: "robots", content: "noindex" },
        ],
      };

export function CategoryPage({ category: c }: { category: Category }) {
  const items = contentInCategory(c.id);
  const calcs = items.filter((x) => x.kind === "calculator");
  const reading = items.filter((x) => x.kind !== "calculator");
  // Каждый материал показывается один раз — в первой подходящей подкатегории.
  const home = new Map<string, string>();
  for (const x of reading) {
    const subs = "subcategories" in x ? ((x.subcategories as string[] | undefined) ?? []) : [];
    const first = c.subcategories.find((s) => subs.includes(s.id));
    if (first) home.set(x.id, first.id);
  }
  const bySub = (subId: string) => reading.filter((x) => home.get(x.id) === subId);
  const placed = new Set(home.keys());
  const general = reading.filter((x) => !placed.has(x.id));
  const related = (c.related ?? []).map(getCategory).filter((x): x is Category => !!x);
  const activeSubs = c.subcategories.filter((s) => bySub(s.id).length);

  return (
    <>
      <section className="border-b border-border">
        <div
          className={`container-page grid gap-10 py-10 md:py-14 ${c.image ? "lg:grid-cols-[1.1fr_1fr] lg:items-end" : ""}`}
        >
          <div>
            <Breadcrumbs crumbs={categoryCrumbs(c)} />
            <p className="eyebrow">{DIRECTIONS[c.direction].title}</p>
            <h1 className="mt-3 text-4xl md:text-6xl">{c.title}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{c.description}</p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Подкатегории">
              {c.subcategories.map((s) => {
                const has = bySub(s.id).length > 0;
                return (
                  <li key={s.id}>
                    {has ? (
                      <a
                        href={`#${s.slug}`}
                        className="inline-block rounded-sm border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                      >
                        {s.title}
                      </a>
                    ) : (
                      <span
                        className="inline-block rounded-sm border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground"
                        title="Материалы готовятся"
                      >
                        {s.title}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {c.image && (
            <img
              src={c.image.src}
              alt={c.image.alt}
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
          )}
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-14">
          {activeSubs.map((s) => (
            <section
              key={s.id}
              id={s.slug}
              className="scroll-mt-28"
              aria-labelledby={`h-${s.slug}`}
            >
              <h2 id={`h-${s.slug}`} className="mb-4 text-2xl">
                {s.title}
              </h2>
              <ContentRows items={bySub(s.id)} />
            </section>
          ))}
          {general.length > 0 && (
            <section aria-labelledby="h-general">
              <h2 id="h-general" className="mb-4 text-2xl">
                {activeSubs.length ? "Также по теме" : "Материалы категории"}
              </h2>
              <ContentRows items={general} />
            </section>
          )}
          {reading.length === 0 && (
            <p className="text-muted-foreground">Материалы этой категории готовятся.</p>
          )}
          <AdSlot id="category-bottom" />
        </div>
        <aside className="space-y-8">
          {calcs.length > 0 && (
            <div className="rounded-sm bg-graphite p-6 text-graphite-foreground">
              <p className="text-xs tracking-wider uppercase opacity-70">Рассчитать</p>
              <ul className="mt-3 space-y-2">
                {calcs.map((x) => (
                  <li key={x.id}>
                    <HrefLink
                      href={urlFor(x)!}
                      className="flex items-center justify-between gap-2 py-1 font-semibold hover:underline"
                    >
                      {x.title} <ArrowRight className="h-4 w-4 shrink-0" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <p className="eyebrow">Связанные категории</p>
              <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
                {related.map((r) => (
                  <li key={r.id}>
                    <HrefLink href={urlFor(r)!} className="block py-3 hover:text-primary">
                      <span className="text-xs text-muted-foreground">
                        {DIRECTIONS[r.direction].title} ·{" "}
                      </span>
                      <span className="font-semibold">{r.title}</span>
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <PartnerBlock categories={[c.id]} />
        </aside>
      </div>
    </>
  );
}
