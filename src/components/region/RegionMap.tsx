import { Link } from "@tanstack/react-router";
import { REGIONS, type Region } from "@/data/regions";
import { cn } from "@/lib/utils";

/**
 * Схема-картограмма ЦФО: каждый субъект — ячейка, расположенная примерно по сторонам света.
 * Собственная SVG/CSS-схема без внешних картографических сервисов и ключей.
 */
export function RegionMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  const cols = Math.max(...REGIONS.map((r) => r.tile[0])) + 1;
  const rows = Math.max(...REGIONS.map((r) => r.tile[1])) + 1;
  return (
    <figure>
      <div
        role="group"
        aria-label="Схема субъектов Центрального федерального округа"
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          const r = REGIONS.find((g) => g.tile[0] === x && g.tile[1] === y);
          return r ? (
            <Tile key={r.slug} r={r} active={selected === r.slug} onSelect={onSelect} />
          ) : (
            <span key={i} aria-hidden className="aspect-square" />
          );
        })}
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 border border-border bg-card" /> Субъект
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 bg-primary" /> Выбранный регион
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 border border-dashed border-muted-foreground bg-stone" /> Материалы
          готовятся
        </span>
        <span>Схема, не в масштабе: положение ячеек условно.</span>
      </figcaption>
    </figure>
  );
}

function Tile({
  r,
  active,
  onSelect,
}: {
  r: Region;
  active: boolean;
  onSelect: (slug: string) => void;
}) {
  const short = r.kind === "city" ? r.name : r.name.replace(" область", "");
  return (
    <button
      type="button"
      onClick={() => onSelect(r.slug)}
      aria-pressed={active}
      title={r.name}
      className={cn(
        "flex aspect-square min-w-0 flex-col justify-between rounded-sm border p-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-2.5",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : r.status === "published"
            ? "border-border bg-card hover:border-primary"
            : "border-dashed border-muted-foreground/50 bg-stone hover:border-primary",
      )}
    >
      <span className="truncate text-[0.6rem] font-semibold uppercase opacity-70 sm:text-[0.65rem]">
        {r.kind === "city" ? "город" : "обл."}
      </span>
      <span className="font-display text-[0.62rem] leading-tight font-bold break-words hyphens-auto sm:text-sm">
        {short}
      </span>
    </button>
  );
}

export function RegionLink({ r }: { r: Region }) {
  return (
    <Link
      to="/region/$slug"
      params={{ slug: r.slug }}
      className="font-semibold text-accent-foreground underline-offset-4 hover:underline"
    >
      {r.name}
    </Link>
  );
}
