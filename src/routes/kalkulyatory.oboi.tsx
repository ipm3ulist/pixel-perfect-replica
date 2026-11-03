import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { pageHead } from "@/lib/seo";
import { WallpaperCalculator } from "@/features/wallpaper-calculator/WallpaperCalculator";

const DESC =
  "Расчёт количества рулонов обоев по полотнам с учётом высоты стен, окон и дверей, раппорта рисунка и запаса.";

export const Route = createFileRoute("/kalkulyatory/oboi")({
  head: () =>
    pageHead({
      title: "Калькулятор обоев: сколько рулонов нужно",
      description: DESC,
      path: "/kalkulyatory/oboi",
      crumbs: [
        { to: "/kalkulyatory", label: "Калькуляторы" },
        { to: "/kalkulyatory/oboi", label: "Обои" },
      ],
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Калькулятор"
        title="Калькулятор обоев"
        lead="Введите размеры помещения и параметры рулона — расчёт обновляется сразу."
        crumbs={[
          { to: "/kalkulyatory", label: "Калькуляторы" },
          { to: "/kalkulyatory/oboi", label: "Обои" },
        ]}
      />
      <div className="container-page py-12">
        <WallpaperCalculator />
        <section className="prose-dk mt-16">
          <h2>Как считается результат</h2>
          <ol>
            <li>
              Длина полотна — высота стены плюс 10 см на подрезку, округлённая вверх до целого числа
              раппортов.
            </li>
            <li>С рулона получается целое число полотен; короткие остатки считаются отходом.</li>
            <li>Число полотен — длина стен, делённая на ширину рулона, с округлением вверх.</li>
            <li>
              Проём экономит только целые полотна: узкие окна и двери почти не уменьшают расход.
            </li>
            <li>К результату добавляется запас, итог округляется до целого рулона.</li>
          </ol>
          <p>
            Перед расчётом стоит{" "}
            <Link to="/instruktsii/$slug" params={{ slug: "kak-zamerit-pomeshchenie" }}>
              правильно замерить помещение
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
