import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { LeadForm } from "@/monetization/components/LeadForm";
import { pageHead } from "@/lib/seo";

const DESC =
  "Заявка на ремонт квартиры или строительство дома. Приём откроется, когда на сайте появятся проверенные исполнители.";

export const Route = createFileRoute("/zayavka")({
  head: () =>
    pageHead({
      title: "Заявка на ремонт и строительство",
      description: DESC,
      path: "/zayavka",
      crumbs: [{ to: "/zayavka", label: "Заявка" }],
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Заявка"
        title="Заявка на ремонт и строительство"
        lead="Опишите задачу — когда приём откроется, мы сохраним заявку и передадим её исполнителю только с вашего отдельного согласия."
        crumbs={[{ to: "/zayavka", label: "Заявка" }]}
      />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <LeadForm />
        <aside className="space-y-4 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Как мы обращаемся с данными</h2>
          <p>Спрашиваем только то, что нужно для ответа: город, задачу и способ связи.</p>
          <p>Без отметки о передаче заявка не уходит третьим лицам.</p>
          <p>Исполнителей на сайте пока нет — мы не публикуем вымышленные компании.</p>
        </aside>
      </div>
    </>
  );
}
