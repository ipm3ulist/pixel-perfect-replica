import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { HrefLink } from "@/components/site/HrefLink";
import { PUBLISHED, categoriesOf, urlFor } from "@/content";
import { isRegionIndexable, regionBySlug } from "@/data/regions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/region/$slug")({
  loader: ({ params }) => {
    const region = regionBySlug(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.region;
    if (!r) return {};
    return pageHead({
      title: `Строительство и ремонт ${r.inName}`,
      description: `Материалы ДомКлючПро о строительстве домов и ремонте квартир ${r.inName}: калькуляторы, инструкции и выбор материалов.`,
      path: `/region/${r.slug}`,
      noindex: !isRegionIndexable(r),
      crumbs: [
        { to: "/region", label: "География" },
        { to: `/region/${r.slug}`, label: r.name },
      ],
    });
  },
  component: Page,
});

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

function Page() {
  const { region: r } = Route.useLoaderData();
  const calcs = PUBLISHED.filter((c) => c.kind === "calculator").slice(0, 6);
  const articles = PUBLISHED.filter((c) => c.kind === "article").slice(0, 4);
  const guides = PUBLISHED.filter((c) => c.kind === "guide").slice(0, 4);
  const cats = categoriesOf("doma").slice(0, 6);
  const c = r.content;

  return (
    <>
      <PageHeader
        eyebrow="Центральная Россия"
        title={`Строительство и ремонт ${r.inName}`}
        lead={
          r.kind === "city"
            ? `${r.name} — город федерального значения в составе Центрального федерального округа.`
            : `${r.name} входит в Центральный федеральный округ. Административный центр — ${r.center}.`
        }
        crumbs={[
          { to: "/region", label: "География" },
          { to: `/region/${r.slug}`, label: r.name },
        ]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0">
          {c ? (
            <>
              <p className="text-lg">{c.intro}</p>
              <section className="mt-10">
                <h2 className="text-2xl">Особенности строительства и ремонта</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {c.building.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </section>
              {c.climate && (
                <section className="mt-10">
                  <h2 className="text-2xl">Климат и сезонность</h2>
                  <p className="mt-4">{c.climate.text}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Источники:{" "}
                    {c.climate.sources.map((s, i) => (
                      <a key={s.url} href={s.url} className="underline" rel="noopener">
                        {s.title}
                        {i < c.climate!.sources.length - 1 ? ", " : ""}
                      </a>
                    ))}
                  </p>
                </section>
              )}
              <section className="mt-10">
                <h2 className="text-2xl">Выбор материалов</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {c.materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <section className="border border-dashed border-muted-foreground/40 bg-stone/60 p-6">
              <h2 className="text-xl">Региональный раздел готовится</h2>
              <p className="mt-3 text-muted-foreground">
                Мы публикуем сведения о климате, грунтах и местных условиях строительства только со
                ссылками на проверяемые источники. Пока они не собраны, ниже — общие материалы
                ДомКлючПро, которые подходят для любого региона.
              </p>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-2xl">Калькуляторы</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {calcs.map((x) => (
                <li key={x.id}>
                  <HrefLink
                    href={urlFor(x)!}
                    className="block border border-border bg-card p-4 font-semibold hover:border-primary"
                  >
                    {x.title}
                  </HrefLink>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-12">
            <h2 className="text-2xl">Полезные статьи</h2>
            <ul className="mt-4 space-y-3">
              {articles.map((x) => (
                <li key={x.id}>
                  <HrefLink href={urlFor(x)!} className="font-semibold hover:text-primary">
                    {x.title}
                  </HrefLink>
                </li>
              ))}
            </ul>
          </section>
          {guides.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Инструкции</h2>
              <ul className="mt-4 space-y-3">
                {guides.map((x) => (
                  <li key={x.id}>
                    <HrefLink href={urlFor(x)!} className="font-semibold hover:text-primary">
                      {x.title}
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="mt-12 text-sm text-muted-foreground">Обновлено {fmt(r.updatedAt)}</p>
        </article>
        <aside>
          <h2 className="font-display text-sm font-bold tracking-wider uppercase">
            Разделы о домах
          </h2>
          <ul className="mt-4 space-y-2">
            {cats.map((x) => (
              <li key={x.id}>
                <HrefLink href={urlFor(x)!} className="hover:text-primary">
                  {x.title}
                </HrefLink>
              </li>
            ))}
          </ul>
          <Link
            to="/region"
            className="mt-8 inline-block text-sm font-semibold text-accent-foreground hover:underline"
          >
            ← Все регионы
          </Link>
        </aside>
      </div>
    </>
  );
}
