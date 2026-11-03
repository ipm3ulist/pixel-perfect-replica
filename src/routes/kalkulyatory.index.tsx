import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HrefLink } from "@/components/site/HrefLink";
import { PageHeader } from "@/components/site/PageHeader";
import { CALCULATOR_ENTRIES } from "@/content/entries";
import { DIRECTIONS, getCategory, urlFor, type DirectionId } from "@/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/kalkulyatory/")({
  head: () =>
    pageHead({
      title: "Строительные калькуляторы",
      description:
        "Предварительные расчёты материалов: обои, краска, плитка, ламинат, блоки, бетон и утеплитель — с прозрачной методикой.",
      path: "/kalkulyatory",
      crumbs: [{ to: "/kalkulyatory", label: "Калькуляторы" }],
    }),
  component: Page,
});

const dirOf = (cats: string[]) =>
  [...new Set(cats.map((c) => getCategory(c as never)?.direction))].filter(
    Boolean,
  ) as DirectionId[];

function Page() {
  const live = CALCULATOR_ENTRIES.filter((c) => c.status === "published");
  const planned = CALCULATOR_ENTRIES.filter((c) => c.status === "draft");
  return (
    <>
      <PageHeader
        eyebrow="Сервисы"
        title="Калькуляторы"
        lead="Предварительные расчёты материалов по прозрачной методике. Каждый расчёт показывает формулу — его можно проверить вручную."
        crumbs={[{ to: "/kalkulyatory", label: "Калькуляторы" }]}
      />
      <div className="container-page py-14">
        <ul className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
          {live.map((c, i) => (
            <li key={c.id} className="border-r border-b border-border">
              <HrefLink
                href={urlFor(c)!}
                className="group flex h-full flex-col bg-card p-7 hover:bg-accent"
              >
                <span className="font-display text-sm font-bold text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-6 text-2xl">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-6 flex items-center justify-between text-sm font-semibold">
                  <span className="text-xs font-normal text-muted-foreground">
                    {dirOf(c.categories)
                      .map((d) => DIRECTIONS[d].title)
                      .join(" · ")}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </span>
              </HrefLink>
            </li>
          ))}
        </ul>
        {planned.length > 0 && (
          <div className="mt-12">
            <p className="eyebrow">В планах</p>
            <p className="mt-3 text-muted-foreground">{planned.map((c) => c.title).join(" · ")}</p>
          </div>
        )}
      </div>
    </>
  );
}
