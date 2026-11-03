import { track } from "@/lib/analytics";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { pageHead } from "@/lib/seo";
import { DEFAULT_CONFIG, type HouseConfig } from "@/features/house/model";
import { geometry } from "@/features/house/geometry";
import { loadConfig } from "@/features/house/storage";
import { EstimateTable, GeometrySummary, HouseDisclaimer } from "@/features/house/EstimateView";

const CRUMBS = [
  { to: "/doma", label: "Дома" },
  { to: "/doma/smeta", label: "Структура сметы" },
];

export const Route = createFileRoute("/doma/smeta")({
  head: () =>
    pageHead({
      title: "Предварительная смета дома: из чего она состоит",
      description:
        "Структура сметы строительства частного дома по этапам: коробка, отделка, инженерия, дополнительные работы, логистика. Объёмы считаются из параметров дома.",
      path: "/doma/smeta",
      crumbs: CRUMBS,
    }),
  component: Page,
});

function Page() {
  const [c, setC] = useState<HouseConfig>(DEFAULT_CONFIG);
  const [own, setOwn] = useState(false);
  useEffect(() => track("estimate_viewed"), []);
  useEffect(() => {
    const s = loadConfig();
    if (s) {
      setC(s);
      setOwn(true);
    }
  }, []);
  const g = useMemo(() => geometry(c), [c]);
  return (
    <>
      <PageHeader
        eyebrow="Инструмент"
        title="Предварительная структура сметы"
        lead="Смета начинается не с цен, а с объёмов. Здесь видно, какие работы войдут в стройку и от каких параметров зависит количество."
        crumbs={CRUMBS}
      />
      <div className="container-page space-y-12 py-12">
        <p className="border-l-2 border-primary pl-4 text-sm">
          {own
            ? "Показана конфигурация, сохранённая в этом браузере."
            : "Показан пример: одноэтажный дом 12 × 9 м."}{" "}
          <Link to="/doma/konfigurator" className="font-semibold underline underline-offset-4">
            {own ? "Изменить параметры" : "Задать свои параметры"}
          </Link>
        </p>
        <GeometrySummary g={g} />
        <EstimateTable c={c} g={g} />
        <section className="prose-dk">
          <h2>Почему здесь нет цен</h2>
          <p>
            Стоимость работ и материалов сильно зависит от региона, сезона и подрядчика. Мы покажем
            денежную оценку только тогда, когда у каждой цены будут источник, регион и дата
            проверки. До этого объёмы помогут сравнивать предложения подрядчиков по одним и тем же
            позициям.
          </p>
          <h2>Как пользоваться</h2>
          <ol>
            <li>Задайте параметры в конфигураторе и сохраните их в браузере.</li>
            <li>Распечатайте структуру и попросите подрядчиков оценить те же позиции.</li>
            <li>Позиции «по проекту» уточняются после геологии и конструктивного расчёта.</li>
          </ol>
        </section>
        <HouseDisclaimer />
      </div>
    </>
  );
}
