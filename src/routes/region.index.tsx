import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { RegionMap } from "@/components/region/RegionMap";
import { REGIONS, readSavedRegion, regionBySlug, saveRegion } from "@/data/regions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/region/")({
  head: () =>
    pageHead({
      title: "ДомКлючПро — Центральная Россия: регионы ЦФО",
      description:
        "Схема 18 субъектов Центрального федерального округа: выберите регион, чтобы перейти к материалам о строительстве и ремонте.",
      path: "/region",
      crumbs: [{ to: "/region", label: "География" }],
    }),
  component: Page,
});

function Page() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  useEffect(() => {
    const s = readSavedRegion();
    setSaved(s);
    setSelected(s);
  }, []);
  const sel = selected ? regionBySlug(selected) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="География"
        title="Центральная Россия"
        lead="18 субъектов Центрального федерального округа. Выберите регион на схеме или в списке."
        crumbs={[{ to: "/region", label: "География" }]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="map-h">
          <h2 id="map-h" className="sr-only">
            Схема регионов
          </h2>
          <RegionMap selected={selected} onSelect={setSelected} />
          <div className="mt-8 border border-border bg-card p-6" aria-live="polite">
            {sel ? (
              <>
                <p className="eyebrow">Выбран регион</p>
                <p className="mt-2 font-display text-2xl font-bold">{sel.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Административный центр — {sel.center}.
                  {sel.status === "planned" && " Региональные материалы готовятся."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/region/$slug"
                    params={{ slug: sel.slug }}
                    className="rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Открыть страницу региона
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      const next = saved === sel.slug ? null : sel.slug;
                      saveRegion(next);
                      setSaved(next);
                    }}
                    className="rounded border border-border px-5 py-3 text-sm font-semibold hover:border-primary"
                  >
                    {saved === sel.slug ? "Забыть мой регион" : "Сделать моим регионом"}
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Выбор хранится только в вашем браузере. Местоположение не определяется.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Нажмите на регион, чтобы увидеть подробности.</p>
            )}
          </div>
        </section>
        <aside aria-labelledby="list-h">
          <h2 id="list-h" className="font-display text-xl font-bold">
            Все субъекты ЦФО
          </h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {[...REGIONS]
              .sort((a, b) => a.name.localeCompare(b.name, "ru"))
              .map((r) => (
                <li key={r.slug} className="flex items-baseline justify-between gap-4 py-2.5">
                  <Link
                    to="/region/$slug"
                    params={{ slug: r.slug }}
                    className="font-medium hover:text-primary"
                  >
                    {r.name}
                    {saved === r.slug && (
                      <span className="ml-2 text-xs text-accent-foreground">· мой регион</span>
                    )}
                  </Link>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {r.status === "published" ? r.center : "готовится"}
                  </span>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
