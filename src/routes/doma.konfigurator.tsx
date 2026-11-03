import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { pageHead } from "@/lib/seo";
import { HouseConfigurator } from "@/features/house/HouseConfigurator";

const CRUMBS = [
  { to: "/doma", label: "Дома" },
  { to: "/doma/konfigurator", label: "Конфигуратор" },
];

export const Route = createFileRoute("/doma/konfigurator")({
  validateSearch: (s: Record<string, unknown>): { scenario?: string } =>
    typeof s["scenario"] === "string" ? { scenario: s["scenario"] } : {},
  head: () =>
    pageHead({
      title: "Конфигуратор частного дома: параметры и объёмы",
      description:
        "Пошаговый конфигуратор дома: габариты, фундамент, стены, кровля, инженерия. Площади стен, кровли и фасада и структура сметы — без регистрации.",
      path: "/doma/konfigurator",
      crumbs: CRUMBS,
    }),
  component: Page,
});

function Page() {
  const { scenario } = Route.useSearch();
  return (
    <>
      <PageHeader
        eyebrow="Инструмент"
        title="Конфигуратор частного дома"
        lead="Девять коротких шагов — от габаритов до инженерии. На выходе — карточка конфигурации, физические объёмы и структура будущей сметы для разговора со специалистами."
        crumbs={CRUMBS}
      />
      <div className="container-page py-12">
        <HouseConfigurator scenario={scenario} />
        <p className="mt-16 text-sm text-muted-foreground print:hidden">
          Не знаете, с чего начать? Откройте{" "}
          <Link to="/doma/proekty" className="underline underline-offset-4">
            примеры конфигураций
          </Link>{" "}
          — параметры подставятся автоматически.
        </p>
      </div>
    </>
  );
}
