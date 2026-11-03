import type { HouseConfig } from "./model";
import type { Geometry } from "./geometry";
import { buildEstimate, groupByStage } from "./estimate";

const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

export function GeometrySummary({ g }: { g: Geometry }) {
  const rows: [string, string, string][] = [
    ["Площадь застройки", `${fmt(g.footprint)} м²`, "Длина × ширина"],
    ["Площадь по контуру, все этажи", `${fmt(g.floorArea)} м²`, "Площадь застройки × этажи"],
    ["Периметр", `${fmt(g.perimeter)} м`, "2 × (длина + ширина)"],
    ["Высота наружных стен", `${fmt(g.wallHeight)} м`, "Потолки + перекрытия по 0,3 м"],
    [
      "Стены без проёмов",
      `${fmt(g.wallNet)} м²`,
      `Периметр × высота − проёмы ${fmt(g.openings)} м²`,
    ],
    ["Фронтоны", `${fmt(g.gables)} м²`, "Пролёт × подъём конька (двускатная)"],
    ["Фасад", `${fmt(g.facade)} м²`, "Стены без проёмов + фронтоны"],
    ["Кровля", `${fmt(g.roof)} м²`, "Проекция со свесами ÷ cos уклона"],
    ["Подъём конька", `${fmt(g.ridge)} м`, "Половина пролёта × tg уклона"],
  ];
  return (
    <section>
      <h3 className="text-lg">Физические объёмы</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm">
          <thead className="text-left text-xs tracking-wider text-muted-foreground uppercase">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-semibold">Показатель</th>
              <th className="py-2 pr-4 font-semibold">Значение</th>
              <th className="py-2 font-semibold">Как считается</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([a, b, c]) => (
              <tr key={a} className="border-b border-border">
                <td className="py-2.5 pr-4">{a}</td>
                <td className="py-2.5 pr-4 font-semibold whitespace-nowrap tabular-nums">{b}</td>
                <td className="py-2.5 text-muted-foreground">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function EstimateTable({ c, g }: { c: HouseConfig; g: Geometry }) {
  const groups = groupByStage(buildEstimate(c, g));
  return (
    <section>
      <h3 className="text-lg">Структура предварительной сметы</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Объёмы и перечень работ без цен: денежная оценка появится только с проверенными ценами по
        региону и датой проверки.
      </p>
      {groups.map((gr) => (
        <div key={gr.stage} className="mt-6">
          <p className="eyebrow">{gr.title}</p>
          <ul className="mt-2 border-t border-border">
            {gr.lines.map((l) => (
              <li
                key={l.id}
                className="grid gap-1 border-b border-border py-3 sm:grid-cols-[1fr_9rem]"
              >
                <div>
                  <p className="font-medium">
                    {l.title}{" "}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {l.kind === "material" ? "материал" : "работы"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{l.basis}</p>
                </div>
                <p className="font-semibold tabular-nums sm:text-right">
                  {l.qty === null ? (
                    <span className="font-normal text-muted-foreground">по проекту</span>
                  ) : (
                    `${fmt(l.qty)} ${l.unit}`
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function HouseDisclaimer() {
  return (
    <p className="border-t border-border pt-4 text-xs text-muted-foreground">
      Это предварительная геометрическая оценка для обсуждения со специалистами, а не проект, не
      инженерный расчёт и не коммерческое предложение. Формулы считают дом прямоугольником с равными
      скатами, без эркеров, мансард и внутренних несущих стен.
    </p>
  );
}
