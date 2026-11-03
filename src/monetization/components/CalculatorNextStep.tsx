import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getSection } from "../data/catalog";
import type { CatalogSectionId } from "../types";

/** После расчёта: переход к подбору материалов с результатом расчёта. */
export function CalculatorNextStep({
  section,
  summary,
}: {
  section: CatalogSectionId;
  summary?: string | undefined;
}) {
  const s = getSection(section);
  if (!s) return null;
  return (
    <div className="border border-border bg-card p-6">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Следующий шаг
      </p>
      <p className="mt-2 font-semibold">Подобрать материалы: {s.title.toLowerCase()}</p>
      {summary && (
        <p className="mt-1 text-sm text-muted-foreground">
          По расчёту: {summary}. Сверьте с упаковкой выбранного товара.
        </p>
      )}
      <Link
        to="/katalog/$section"
        params={{ section }}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground underline underline-offset-4"
      >
        Что проверить при выборе <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
