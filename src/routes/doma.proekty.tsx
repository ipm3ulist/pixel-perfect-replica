import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { pageHead } from "@/lib/seo";
import { SCENARIOS } from "@/features/house/presets";
import { geometry } from "@/features/house/geometry";
import { LABELS, normalizeConfig } from "@/features/house/model";

const CRUMBS = [
  { to: "/doma", label: "Дома" },
  { to: "/doma/proekty", label: "Примеры конфигураций" },
];

export const Route = createFileRoute("/doma/proekty")({
  head: () =>
    pageHead({
      title: "Примеры конфигураций частного дома",
      description:
        "Три сценария частного дома — одноэтажный, двухэтажный и барнхаус — с площадями стен, кровли и фасада. Откройте любой в конфигураторе и измените под себя.",
      path: "/doma/proekty",
      crumbs: CRUMBS,
    }),
  component: Page,
});

function Page() {
  useEffect(() => track("house_project_viewed", { page: "proekty" }), []);
  return (
    <>
      <PageHeader
        eyebrow="Сценарии"
        title="Примеры конфигураций"
        lead="Демонстрационные концепции, на которых удобно понять, как форма дома и крыши меняет объёмы. Это не готовые проекты и не предложения с ценой."
        crumbs={CRUMBS}
      />
      <div className="container-page grid gap-14 py-12">
        {SCENARIOS.map((s, i) => {
          const c = normalizeConfig(s.config);
          const g = geometry(c);
          return (
            <article
              key={s.slug}
              className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>figure]:order-2" : ""}`}
            >
              <figure>
                <img
                  src={s.image}
                  alt={s.imageAlt}
                  loading={i ? "lazy" : "eager"}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  Иллюстрация концепции
                </figcaption>
              </figure>
              <div>
                <p className="eyebrow">
                  {LABELS.structure[c.structure]} · {LABELS.roofShape[c.roofShape].toLowerCase()}{" "}
                  крыша
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl">{s.name}</h2>
                <p className="mt-3 text-muted-foreground">{s.description}</p>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-border text-sm sm:grid-cols-3">
                  {(
                    [
                      ["Площадь", `${g.floorArea} м²`],
                      ["Этажей", String(c.floors)],
                      ["Спальни", String(c.bedrooms)],
                      ["Стены", `${g.wallNet} м²`],
                      ["Кровля", `${g.roof} м²`],
                      ["Фасад", `${g.facade} м²`],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="border-b border-border py-2.5">
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="font-semibold tabular-nums">{v.replace(".", ",")}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  to="/doma/konfigurator"
                  search={{ scenario: s.slug }}
                  className="mt-6 inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm font-semibold text-background hover:bg-primary"
                >
                  Открыть в конфигураторе <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
