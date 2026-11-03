import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { pageHead } from "@/lib/seo";

const DESC =
  "Как ДомКлючПро размещает партнёрские ссылки и рекламу: маркировка, независимость редакции, никаких выдуманных цен и рейтингов.";

export const Route = createFileRoute("/reklama")({
  head: () =>
    pageHead({
      title: "Реклама и партнёрские ссылки",
      description: DESC,
      path: "/reklama",
      crumbs: [{ to: "/reklama", label: "Реклама" }],
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Прозрачность"
        title="Реклама и партнёрские ссылки"
        lead={DESC}
        crumbs={[{ to: "/reklama", label: "Реклама" }]}
      />
      <div className="container-page prose-dk py-14">
        <h2>Правила</h2>
        <ul>
          <li>
            Каждый рекламный блок помечен словом «Реклама», названием рекламодателя и
            идентификатором erid.
          </li>
          <li>Партнёрские ссылки ведут только в магазины, с которыми заключён договор.</li>
          <li>
            Цены показываем только с источником и датой проверки; рейтинги и наличие не публикуем.
          </li>
          <li>Тексты статей пишутся независимо от партнёров: реклама не влияет на рекомендации.</li>
          <li>Сейчас на сайте нет ни одного рекламного размещения.</li>
        </ul>
      </div>
    </>
  );
}
