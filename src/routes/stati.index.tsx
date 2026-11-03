import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContentRows } from "@/components/content/ContentList";
import { PageHeader } from "@/components/site/PageHeader";
import { ARTICLES } from "@/content/articles";
import { DIRECTIONS, type DirectionId } from "@/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/stati/")({
  head: () =>
    pageHead({
      title: "Статьи о ремонте квартиры и строительстве дома",
      description:
        "Практические статьи для владельцев квартир и частных домов: планирование, отделка, конструкции, инженерия и обслуживание.",
      path: "/stati",
      crumbs: [{ to: "/stati", label: "Статьи" }],
    }),
  component: Page,
});

function Page() {
  const [dir, setDir] = useState<DirectionId | "all">("all");
  const list = ARTICLES.filter(
    (a) => dir === "all" || a.categories.some((c) => c.startsWith(dir + ".")),
  );
  return (
    <>
      <PageHeader
        eyebrow="Редакция"
        title="Статьи"
        lead="Самостоятельные разборы решений, материалов и типичных ошибок. Без рекламы под видом советов."
        crumbs={[{ to: "/stati", label: "Статьи" }]}
      />
      <div className="container-page py-12">
        <div role="group" aria-label="Направление" className="mb-8 flex flex-wrap gap-2">
          {(["all", "kvartiry", "doma"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={dir === d}
              onClick={() => setDir(d)}
              className="rounded-sm border border-border px-4 py-2 text-sm font-semibold aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {d === "all" ? "Все" : DIRECTIONS[d].title}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-muted-foreground">
            {list.length} статей
          </span>
        </div>
        <ContentRows items={list} />
      </div>
    </>
  );
}
