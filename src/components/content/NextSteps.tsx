import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HrefLink } from "@/components/site/HrefLink";
import { urlFor, type Content } from "@/content";
import { nextSteps } from "@/content/links";

/** Блок «Что дальше»: расчёт → материалы → технологии → исполнитель. */
export function NextSteps({ item }: { item: Content }) {
  const s = nextSteps(item);
  const cols = [
    { title: "Рассчитать", items: s.calculators.map((x) => ({ key: x.id, href: urlFor(x)!, label: x.title })) },
    { title: "Материалы", items: s.materials.map((x) => ({ key: x.id, href: urlFor(x)!, label: x.title })) },
    { title: "Смежные технологии", items: s.technologies.map((c) => ({ key: c.id, href: urlFor(c)!, label: c.title })) },
  ].filter((c) => c.items.length);

  return (
    <section className="border-t border-border" aria-labelledby="next-steps">
      <div className="container-page py-12 md:py-16">
        <p className="eyebrow">Следующий шаг</p>
        <h2 id="next-steps" className="mt-3 text-2xl md:text-3xl">От статьи — к расчёту и исполнителю</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {cols.map((c, i) => (
            <div key={c.title}>
              <p className="flex items-baseline gap-2 text-sm font-semibold">
                <span className="text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {c.title}
              </p>
              <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
                {c.items.map((x) => (
                  <li key={x.key}>
                    <HrefLink href={x.href} className="flex items-center justify-between gap-2 py-2.5 hover:text-primary">
                      {x.label} <ArrowRight className="h-4 w-4 shrink-0" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-sm bg-graphite p-6 text-graphite-foreground">
            <p className="text-sm font-semibold">
              <span className="opacity-70 tabular-nums">{String(cols.length + 1).padStart(2, "0")}</span>{" "}
              Исполнитель
            </p>
            <p className="mt-3 text-sm opacity-80">
              {s.workType === "stroitelstvo"
                ? "Опишите объект — подберём строительную компанию под эту задачу."
                : "Опишите задачу — подберём мастера или бригаду для ремонта."}
            </p>
            <Link to="/zayavka" className="mt-4 inline-flex items-center gap-2 font-semibold hover:underline">
              Оставить заявку <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
