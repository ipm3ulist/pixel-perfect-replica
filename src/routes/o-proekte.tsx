import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SITE } from "@/data/site";

const TITLE = "О проекте ДомКлючПро";
const DESC =
  "ДомКлючПро — независимая платформа о строительстве, ремонте и обустройстве жилья. Принципы, методика расчётов и ограничения.";

export const Route = createFileRoute("/o-proekte")({
  head: () => ({
    links: [{ rel: "canonical", href: "/o-proekte" }],
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/o-proekte" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const PRINCIPLES = [
  {
    t: "Порядок важнее советов",
    d: "Объясняем, в какой последовательности принимать решения, — это экономит больше, чем любой лайфхак.",
  },
  {
    t: "Без рекламы и рейтингов",
    d: "Мы не продвигаем бренды. Сравниваем группы материалов и условия их применения.",
  },
  {
    t: "Прозрачные расчёты",
    d: "Методика каждого калькулятора описана на его странице, результат можно перепроверить вручную.",
  },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Проект"
        title="О проекте"
        lead={`${SITE.name} — ${SITE.tagline.toLowerCase()}.`}
        crumbs={[{ to: "/o-proekte", label: "О проекте" }]}
      />
      <div className="container-page py-14">
        <div className="grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.t} className="bg-card p-7">
              <span className="font-display text-sm font-extrabold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-xl">{p.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
        <section className="prose-dk mt-14">
          <h2>Для кого</h2>
          <p>
            Для владельцев квартир и домов, которые планируют ремонт или строительство и хотят
            понимать, что и зачем делают подрядчики.
          </p>
          <h2>Ограничения</h2>
          <p>
            {SITE.disclaimer} Характеристики конкретных материалов всегда сверяйте с документацией
            производителя.
          </p>
        </section>
      </div>
    </>
  );
}
