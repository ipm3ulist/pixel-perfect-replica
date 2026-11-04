import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ContentRows } from "@/components/content/ContentList";
import { getCategory, getContent, urlFor, type Category, type Content } from "@/content";
import { ROOMS, ROOMS_PATH, getRoom, roomUrl, type Room } from "@/data/rooms";
import { pageHead } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { HrefLink } from "./HrefLink";

export const roomCrumbs = (r?: Room) => [
  { to: "/kvartiry", label: "Квартиры" },
  { to: ROOMS_PATH, label: "Помещения" },
  ...(r ? [{ to: roomUrl(r.slug), label: r.title }] : []),
];

export const roomHead = (r: Room | undefined) =>
  r
    ? pageHead({
        title: r.seo.title,
        description: r.seo.description,
        path: roomUrl(r.slug),
        type: "article",
        crumbs: roomCrumbs(r),
      })
    : { meta: [{ title: "Помещение не найдено — ДомКлючПро" }, { name: "robots", content: "noindex" }] };

const resolve = (ids: Room["content"]) =>
  ids.map(getContent).filter((x): x is Content => !!x && x.status === "published");

type Section = { id: string; title: string; body: React.ReactNode };

export function RoomPage({ room: r }: { room: Room }) {
  const reading = resolve(r.content);
  const calcs = resolve(r.calcs);
  const cats = r.categories.map(getCategory).filter((x): x is Category => !!x);
  const neighbours = r.neighbours.map(getRoom).filter((x): x is Room => !!x);

  const sections: Section[] = [
    { id: "naznachenie", title: "Назначение и планирование", body: <p>{r.purpose}</p> },
    {
      id: "planirovka",
      title: "Планировка и зонирование",
      body: (
        <ul className="list-disc space-y-2 pl-5">
          {r.layout.map((x) => <li key={x}>{x}</li>)}
        </ul>
      ),
    },
    { id: "pol", title: "Напольные покрытия", body: <p>{r.floor}</p> },
    { id: "steny", title: "Стены и потолок", body: <p>{r.wallsCeiling}</p> },
    { id: "svet", title: "Освещение и электрика", body: <p>{r.lighting}</p> },
    { id: "hranenie", title: "Мебель и хранение", body: <p>{r.furniture}</p> },
    ...(r.engineering
      ? [{ id: "inzheneriya", title: "Сантехника и коммуникации", body: <p>{r.engineering}</p> }]
      : []),
    ...(r.ventilationNoise
      ? [{ id: "ventilyatsiya", title: "Вентиляция и шумоизоляция", body: <p>{r.ventilationNoise}</p> }]
      : []),
    {
      id: "oshibki",
      title: "Типичные ошибки",
      body: (
        <ul className="divide-y divide-border border-y border-border">
          {r.mistakes.map((x) => <li key={x} className="py-3">{x}</li>)}
        </ul>
      ),
    },
    {
      id: "byudzhet",
      title: "Расходы и уровни бюджета",
      body: (
        <>
          <p>Основные статьи расходов при ремонте {r.genitive}:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {r.budget.drivers.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="py-2 pr-4 font-semibold">Уровень</th>
                  <th className="py-2 font-semibold">Что обычно входит</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Базовый", r.budget.basic],
                    ["Средний", r.budget.mid],
                    ["Высокий", r.budget.upper],
                  ] as const
                ).map(([k, v]) => (
                  <tr key={k} className="border-b border-border align-top">
                    <td className="py-3 pr-4 font-semibold whitespace-nowrap">{k}</td>
                    <td className="py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Цены зависят от региона, площади и исполнителя, поэтому мы не публикуем суммы без проверенных данных. Объёмы материалов посчитают калькуляторы.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs crumbs={roomCrumbs(r)} />
          <p className="eyebrow">{r.group === "main" ? "Основное помещение" : "Дополнительная зона"}</p>
          <h1 className="mt-3 text-4xl md:text-6xl">Ремонт {r.genitive}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{r.lead}</p>
          <nav aria-label="Содержание" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-muted-foreground hover:text-primary">
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <article className="max-w-3xl space-y-12 leading-relaxed">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28" aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`} className="mb-4 flex items-baseline gap-3 text-2xl">
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}

          {reading.length > 0 && (
            <section aria-labelledby="h-read">
              <h2 id="h-read" className="mb-4 text-2xl">Статьи, инструкции и материалы</h2>
              <ContentRows items={reading} />
            </section>
          )}

          <section className="rounded-sm border border-border bg-card p-6 md:p-8" aria-labelledby="h-lead">
            <h2 id="h-lead" className="text-2xl">Нужна помощь с ремонтом?</h2>
            <p className="mt-3 text-muted-foreground">
              Опишите задачу — когда приём заявок откроется, мы подберём проверенного исполнителя для ремонта {r.genitive}.
            </p>
            <Link
              to="/zayavka"
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Оставить заявку <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>

        <aside className="space-y-8">
          {calcs.length > 0 && (
            <div className="rounded-sm bg-graphite p-6 text-graphite-foreground">
              <p className="text-xs tracking-wider uppercase opacity-70">Рассчитать</p>
              <ul className="mt-3 space-y-2">
                {calcs.map((x) => (
                  <li key={x.id}>
                    <HrefLink href={urlFor(x)!} className="flex items-center justify-between gap-2 py-1 font-semibold hover:underline">
                      {x.title} <ArrowRight className="h-4 w-4 shrink-0" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {neighbours.length > 0 && (
            <div>
              <p className="eyebrow">Соседние помещения</p>
              <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
                {neighbours.map((n) => (
                  <li key={n.slug}>
                    <Link to="/kvartiry/pomeshcheniya/$room" params={{ room: n.slug }} className="flex justify-between py-2.5 hover:text-primary">
                      {n.title} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cats.length > 0 && (
            <div>
              <p className="eyebrow">Разделы по теме</p>
              <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
                {cats.map((c) => (
                  <li key={c.id}>
                    <HrefLink href={urlFor(c)!} className="flex justify-between py-2.5 hover:text-primary">
                      {c.title} <ArrowRight className="h-4 w-4" />
                    </HrefLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link to="/kvartiry/pomeshcheniya" className="inline-block text-sm font-semibold underline">
            Все помещения квартиры
          </Link>
        </aside>
      </div>
    </>
  );
}

export function RoomsIndex() {
  const groups = [
    { title: "Основные помещения", items: ROOMS.filter((r) => r.group === "main") },
    { title: "Дополнительные помещения и зоны", items: ROOMS.filter((r) => r.group === "extra") },
  ];
  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs crumbs={roomCrumbs()} />
          <p className="eyebrow">Квартиры</p>
          <h1 className="mt-3 text-4xl md:text-6xl">Ремонт по помещениям</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Все помещения и зоны квартиры — {ROOMS.length} отдельных гидов: планировка, отделка, свет, хранение, инженерия, ошибки и структура бюджета для каждого.
          </p>
        </div>
      </section>
      <div className="container-page space-y-14 py-14">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-5 text-2xl">{g.title}</h2>
            <ul className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((r) => (
                <li key={r.slug} className="border-b border-border sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0">
                  <Link to="/kvartiry/pomeshcheniya/$room" params={{ room: r.slug }} className="group block h-full p-5 hover:bg-card">
                    <span className="flex items-center justify-between text-lg font-semibold group-hover:text-primary">
                      {r.title} <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">{r.lead}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

export const roomsIndexHead = () =>
  pageHead({
    title: "Ремонт квартиры по помещениям: гостиная, кухня, ванная и др.",
    description:
      "Гид по ремонту каждого помещения квартиры: гостиная, спальня, детская, кухня, ванная, санузел, прихожая, гардеробная, лоджия и другие зоны.",
    path: ROOMS_PATH,
    crumbs: roomCrumbs(),
  });
