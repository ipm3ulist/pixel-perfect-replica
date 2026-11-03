import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { HrefLink } from "@/components/site/HrefLink";
import { PageHeader } from "@/components/site/PageHeader";
import { DIRECTIONS, type DirectionId } from "@/content";
import { HIT_LABEL, search, type HitType } from "@/lib/search";
import { pageHead } from "@/lib/seo";

type S = { q?: string | undefined; d?: DirectionId | undefined; t?: HitType | undefined };
const TYPES = Object.keys(HIT_LABEL) as HitType[];

export const Route = createFileRoute("/poisk")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    d: s["d"] === "kvartiry" || s["d"] === "doma" ? s["d"] : undefined,
    t: TYPES.includes(s["t"] as HitType) ? (s["t"] as HitType) : undefined,
  }),
  head: () => ({
    ...pageHead({
      title: "Поиск по сайту",
      description:
        "Поиск по статьям, инструкциям, материалам, справочнику и калькуляторам ДомКлючПро.",
      path: "/poisk",
      noindex: true,
    }),
  }),
  component: Page,
});

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-sm border border-border px-3 py-1.5 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
    >
      {children}
    </button>
  );
}

function Page() {
  const { q = "", d, t } = Route.useSearch();
  const navigate = useNavigate({ from: "/poisk" });
  const [value, setValue] = useState(q);
  const set = (next: Partial<S>) =>
    navigate({ search: (s: S) => ({ ...s, ...next }), replace: true });
  const hits = search(q, { direction: d ?? "all", type: t ?? "all" });

  return (
    <>
      <PageHeader eyebrow="Сервисы" title="Поиск" crumbs={[{ to: "/poisk", label: "Поиск" }]} />
      <div className="container-page py-12">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: value || undefined });
          }}
          className="flex max-w-2xl gap-2"
        >
          <label htmlFor="q" className="sr-only">
            Запрос
          </label>
          <input
            id="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Например: гидроизоляция, ламинат, фундамент"
            className="h-12 flex-1 rounded-sm border border-input bg-card px-4 text-base outline-none focus:border-primary"
          />
          <button className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90">
            <Search className="h-4 w-4" /> Найти
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <div role="group" aria-label="Направление" className="flex flex-wrap gap-2">
            <Chip active={!d} onClick={() => set({ d: undefined })}>
              Все направления
            </Chip>
            {(["kvartiry", "doma"] as const).map((x) => (
              <Chip key={x} active={d === x} onClick={() => set({ d: x })}>
                {DIRECTIONS[x].title}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="Тип материала" className="flex flex-wrap gap-2">
            <Chip active={!t} onClick={() => set({ t: undefined })}>
              Все типы
            </Chip>
            {TYPES.map((x) => (
              <Chip key={x} active={t === x} onClick={() => set({ t: x })}>
                {HIT_LABEL[x]}
              </Chip>
            ))}
          </div>
        </div>
        {q && (
          <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
            {hits.length
              ? `Найдено: ${hits.length}`
              : "Ничего не найдено. Попробуйте другое слово или снимите фильтры."}
          </p>
        )}
        <ul className="mt-4 divide-y divide-border border-y border-border empty:border-0">
          {hits.slice(0, 60).map((h) => (
            <li key={h.href + h.title}>
              <HrefLink href={h.href} className="group block py-5">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {h.kind}
                </span>
                <span className="mt-1 block font-display text-lg font-bold group-hover:text-primary">
                  {h.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                  {h.text}
                </span>
              </HrefLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
