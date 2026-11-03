import { getContent, urlFor, type Material, type MaterialId } from "@/content";
import { HrefLink } from "@/components/site/HrefLink";
import type { Comparison } from "../types";

const NO = "нет данных";

/** Сравнение по характеристикам, применению, ограничениям и стоимости. Только из существующих данных. */
export function ComparisonTable({ c }: { c: Comparison }) {
  const mats = c.materials
    .map((id) => getContent(id))
    .filter((x): x is Material => x?.kind === "material");
  const list = (xs: string[]) =>
    xs.length ? (
      <ul className="list-disc space-y-1 pl-4">
        {xs.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    ) : (
      NO
    );
  const rows: { label: string; cell: (m: Material) => React.ReactNode }[] = [
    { label: "Применение", cell: (m) => list(m.uses) },
    { label: "Сильные стороны", cell: (m) => list(m.pros) },
    { label: "Ограничения", cell: (m) => list(m.limits) },
    ...(c.extraRows ?? []).map((r) => ({
      label: r.label,
      cell: (m: Material) => r.values[m.id as MaterialId] ?? NO,
    })),
    { label: "Характеристики", cell: () => "По документации производителя выбранного продукта" },
    {
      label: "Ориентировочная стоимость",
      cell: () => "Уточняйте у продавца — проверенных цен пока нет",
    },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-foreground">
            <th scope="col" className="w-40 py-3 pr-4 font-semibold">
              Параметр
            </th>
            {mats.map((m) => (
              <th key={m.id} scope="col" className="py-3 pr-4 font-semibold">
                <HrefLink href={urlFor(m)!} className="hover:text-primary">
                  {m.title}
                </HrefLink>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border align-top">
              <th scope="row" className="py-4 pr-4 font-semibold">
                {r.label}
              </th>
              {mats.map((m) => (
                <td key={m.id} className="py-4 pr-4 text-muted-foreground">
                  {r.cell(m)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
