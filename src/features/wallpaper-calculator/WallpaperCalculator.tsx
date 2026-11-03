import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";
import { calculateWallpaper, fmt, type FieldError, type WallpaperResult } from "./calculate";

/* ---------- form state (strings, so users can type "2,7" freely) ---------- */

type WallS = { length: string; height: string };
type OpeningKind = "window" | "door" | "other";
type OpeningS = { kind: OpeningKind; width: string; height: string; count: string };

const KIND_LABEL: Record<OpeningKind, string> = { window: "Окно", door: "Дверь", other: "Другое" };
const KIND_PRESET: Record<OpeningKind, { width: string; height: string }> = {
  window: { width: "1.5", height: "1.5" },
  door: { width: "0.9", height: "2.1" },
  other: { width: "", height: "" },
};

const ROLLS = [
  { label: "0,53 × 10,05 м", w: "0.53", l: "10.05" },
  { label: "0,70 × 10,05 м", w: "0.7", l: "10.05" },
  { label: "1,06 × 10,05 м", w: "1.06", l: "10.05" },
  { label: "1,06 × 25 м", w: "1.06", l: "25" },
];

const INITIAL = {
  mode: "room" as "room" | "walls",
  roomLength: "4",
  roomWidth: "3.5",
  wallHeight: "2.7",
  walls: [
    { length: "4", height: "2.7" },
    { length: "3.5", height: "2.7" },
    { length: "4", height: "2.7" },
    { length: "3.5", height: "2.7" },
  ] as WallS[],
  roomsCount: "1",
  deductOpenings: true,
  openings: [
    { kind: "window", width: "1.5", height: "1.5", count: "1" },
    { kind: "door", width: "0.9", height: "2.1", count: "1" },
  ] as OpeningS[],
  rollWidth: "1.06",
  rollLength: "10.05",
  patternRepeatCm: "0",
  trimCm: "10",
  reservePercent: "10",
};
type Form = typeof INITIAL;

const num = (s: string) => {
  const t = s.trim().replace(",", ".");
  return t === "" || !/^-?\d*\.?\d+$/.test(t) ? NaN : Number(t);
};

const STEPS = [
  { title: "Помещение", short: "Комната" },
  { title: "Окна и двери", short: "Проёмы" },
  { title: "Рулон и подгонка", short: "Рулон" },
  { title: "Результат", short: "Итог" },
] as const;

const stepOf = (field: string): number => {
  if (/^(roomLength|roomWidth|wallHeight|walls|roomsCount)/.test(field)) return 0;
  if (field.startsWith("openings")) return 1;
  return 2;
};

/* ---------- component ---------- */

export function WallpaperCalculator() {
  const [f, setF] = useState<Form>(INITIAL);
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [shownSteps, setShownSteps] = useState<Set<number>>(new Set());
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const touch = (field: string) => setTouched((t) => (t.has(field) ? t : new Set(t).add(field)));

  const { result, errors } = useMemo(() => {
    const trim = num(f.trimCm);
    const local: FieldError[] =
      !Number.isFinite(trim) || trim < 0 || trim > 30
        ? [{ field: "trimCm", message: "Припуск на подрезку: от 0 до 30 см" }]
        : [];
    const r = calculateWallpaper({
      mode: f.mode,
      roomLength: num(f.roomLength),
      roomWidth: num(f.roomWidth),
      wallHeight: num(f.wallHeight),
      walls: f.walls.map((w) => ({ length: num(w.length), height: num(w.height) })),
      roomsCount: num(f.roomsCount),
      deductOpenings: f.deductOpenings,
      openings: f.openings.map((o) => ({
        width: num(o.width),
        height: num(o.height),
        count: num(o.count),
      })),
      rollWidth: num(f.rollWidth),
      rollLength: num(f.rollLength),
      patternRepeatCm: num(f.patternRepeatCm),
      reservePercent: num(f.reservePercent),
      trimAllowance: local.length ? 0.1 : trim / 100,
    });
    const all = [...local, ...(r.ok ? [] : r.errors)];
    return { result: all.length ? null : (r as WallpaperResult), errors: all };
  }, [f]);

  // An error is shown once its field was edited/left, or its step was submitted with "Далее".
  const visible = (field: string) =>
    errors.find((e) => e.field === field && (touched.has(field) || shownSteps.has(stepOf(field))))
      ?.message;
  const stepErrors = (i: number) => errors.filter((e) => stepOf(e.field) === i);

  const go = (i: number) => {
    setStep(i);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    setShownSteps((s) => new Set(s).add(step));
    if (stepErrors(step).length === 0) go(step + 1);
  };
  const toResult = () => {
    setShownSteps(new Set([0, 1, 2]));
    go(3);
  };
  const reset = () => {
    setF(INITIAL);
    setTouched(new Set());
    setShownSteps(new Set());
    go(0);
  };

  const fieldProps = (id: keyof Form & string) => ({
    id,
    value: f[id] as string,
    onChange: (v: string) => set(id, v as never),
    onBlur: () => touch(id),
    error: visible(id),
  });

  return (
    <div ref={topRef} className="scroll-mt-24">
      <p className="mb-6 flex gap-3 rounded border border-warning/40 bg-warning-surface p-4 text-sm">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <span>
          <strong>Расчёт предварительный.</strong>{" "}
          {SITE.disclaimer.replace("Все расчёты на сайте предварительные и ", "Он ")} Перед покупкой
          сверьте параметры рулона с этикеткой.
        </span>
      </p>

      {/* Stepper */}
      <nav aria-label="Шаги расчёта" className="mb-6">
        <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => {
            const hasErr = i < 3 && shownSteps.has(i) && stepErrors(i).length > 0;
            const done = i < 3 && shownSteps.has(i) && !hasErr;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => (i === 3 ? toResult() : go(i))}
                  aria-current={step === i ? "step" : undefined}
                  className="group flex w-full flex-col gap-2 text-left"
                >
                  <span
                    className={`h-1 w-full rounded-full ${step === i ? "bg-primary" : hasErr ? "bg-destructive" : done ? "bg-graphite" : "bg-border"}`}
                  />
                  <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold sm:text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] ${step === i ? "bg-primary text-primary-foreground" : hasErr ? "bg-destructive text-destructive-foreground" : done ? "bg-graphite text-graphite-foreground" : "bg-secondary text-muted-foreground"}`}
                    >
                      {done ? <Check className="h-3 w-3" /> : hasErr ? "!" : i + 1}
                    </span>
                    <span
                      className={`truncate ${step === i ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                    >
                      <span className="sm:hidden">{s.short}</span>
                      <span className="hidden sm:inline">{s.title}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) next();
          }}
          noValidate
          className="min-w-0"
        >
          {step === 0 && (
            <Panel
              n="01"
              title="Помещение"
              hint="Замерьте стены по полу и под потолком и возьмите большее значение. Высоту — в самой высокой точке."
            >
              <div
                role="radiogroup"
                aria-label="Способ ввода"
                className="mb-5 grid grid-cols-2 rounded border border-border bg-secondary p-1 sm:inline-grid"
              >
                {(["room", "walls"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={f.mode === m}
                    onClick={() => set("mode", m)}
                    className="rounded-sm px-3 py-2 text-sm font-semibold text-muted-foreground aria-checked:bg-card aria-checked:text-foreground aria-checked:shadow-sm"
                  >
                    {m === "room" ? "Прямоугольная комната" : "По стенам"}
                  </button>
                ))}
              </div>
              {f.mode === "room" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Длина комнаты, м"
                    hint="Вдоль длинной стены"
                    {...fieldProps("roomLength")}
                  />
                  <Field
                    label="Ширина комнаты, м"
                    hint="Вдоль короткой стены"
                    {...fieldProps("roomWidth")}
                  />
                  <Field
                    label="Высота стен, м"
                    hint="От пола до потолка, до 10 м"
                    {...fieldProps("wallHeight")}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Для комнат сложной формы, с нишами и выступами, или если оклеиваете не все
                    стены.
                  </p>
                  {f.walls.map((w, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-start gap-3 rounded border border-border p-3 sm:border-0 sm:p-0"
                    >
                      <Field
                        id={`walls.${i}.length`}
                        label={`Стена ${i + 1}: длина, м`}
                        value={w.length}
                        error={visible(`walls.${i}.length`)}
                        onBlur={() => touch(`walls.${i}.length`)}
                        onChange={(v) =>
                          set(
                            "walls",
                            f.walls.map((x, j) => (j === i ? { ...x, length: v } : x)),
                          )
                        }
                      />
                      <Field
                        id={`walls.${i}.height`}
                        label="Высота, м"
                        value={w.height}
                        error={visible(`walls.${i}.height`)}
                        onBlur={() => touch(`walls.${i}.height`)}
                        onChange={(v) =>
                          set(
                            "walls",
                            f.walls.map((x, j) => (j === i ? { ...x, height: v } : x)),
                          )
                        }
                      />
                      <IconBtn
                        label={`Удалить стену ${i + 1}`}
                        disabled={f.walls.length === 1}
                        onClick={() =>
                          set(
                            "walls",
                            f.walls.filter((_, j) => j !== i),
                          )
                        }
                      />
                    </div>
                  ))}
                  <AddBtn
                    disabled={f.walls.length >= 20}
                    onClick={() =>
                      set("walls", [
                        ...f.walls,
                        { length: "", height: f.walls.at(-1)?.height ?? "2.7" },
                      ])
                    }
                  >
                    Добавить стену
                  </AddBtn>
                </div>
              )}
              <div className="mt-5 max-w-[14rem]">
                <Field
                  label="Одинаковых помещений"
                  hint="Если комнат с такими размерами несколько"
                  {...fieldProps("roomsCount")}
                />
              </div>
            </Panel>
          )}

          {step === 1 && (
            <Panel
              n="02"
              title="Окна и двери"
              hint="Проём экономит рулоны, только если в него помещается целое полотно. Узкие окна и двери почти не уменьшают расход — над и под ними всё равно клеят обои."
            >
              <label className="mb-5 flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={f.deductOpenings}
                  onChange={(e) => set("deductOpenings", e.target.checked)}
                />
                Учитывать проёмы в расчёте
              </label>
              {f.deductOpenings ? (
                <div className="space-y-3">
                  {f.openings.map((o, i) => (
                    <div key={i} className="rounded border border-border p-3">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div
                          className="flex gap-1"
                          role="radiogroup"
                          aria-label={`Тип проёма ${i + 1}`}
                        >
                          {(Object.keys(KIND_LABEL) as OpeningKind[]).map((k) => (
                            <button
                              key={k}
                              type="button"
                              role="radio"
                              aria-checked={o.kind === k}
                              onClick={() =>
                                set(
                                  "openings",
                                  f.openings.map((x, j) => (j === i ? { ...x, kind: k } : x)),
                                )
                              }
                              className="rounded-sm border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground aria-checked:border-primary aria-checked:bg-accent aria-checked:text-accent-foreground"
                            >
                              {KIND_LABEL[k]}
                            </button>
                          ))}
                        </div>
                        <IconBtn
                          label={`Удалить проём ${i + 1}`}
                          onClick={() =>
                            set(
                              "openings",
                              f.openings.filter((_, j) => j !== i),
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_4.5rem] gap-3">
                        <Field
                          id={`ow${i}`}
                          label="Ширина, м"
                          value={o.width}
                          onBlur={() => touch(`openings.${i}`)}
                          onChange={(v) =>
                            set(
                              "openings",
                              f.openings.map((x, j) => (j === i ? { ...x, width: v } : x)),
                            )
                          }
                        />
                        <Field
                          id={`oh${i}`}
                          label="Высота, м"
                          value={o.height}
                          onBlur={() => touch(`openings.${i}`)}
                          onChange={(v) =>
                            set(
                              "openings",
                              f.openings.map((x, j) => (j === i ? { ...x, height: v } : x)),
                            )
                          }
                        />
                        <Field
                          id={`oc${i}`}
                          label="Шт."
                          value={o.count}
                          onBlur={() => touch(`openings.${i}`)}
                          onChange={(v) =>
                            set(
                              "openings",
                              f.openings.map((x, j) => (j === i ? { ...x, count: v } : x)),
                            )
                          }
                        />
                      </div>
                      {visible(`openings.${i}`) && (
                        <p role="alert" className="mt-2 text-xs text-destructive">
                          {visible(`openings.${i}`)}
                        </p>
                      )}
                    </div>
                  ))}
                  {visible("openings") && (
                    <p role="alert" className="text-sm text-destructive">
                      {visible("openings")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <AddBtn
                      disabled={f.openings.length >= 20}
                      onClick={() =>
                        set("openings", [
                          ...f.openings,
                          { kind: "window", ...KIND_PRESET.window, count: "1" },
                        ])
                      }
                    >
                      Окно
                    </AddBtn>
                    <AddBtn
                      disabled={f.openings.length >= 20}
                      onClick={() =>
                        set("openings", [
                          ...f.openings,
                          { kind: "door", ...KIND_PRESET.door, count: "1" },
                        ])
                      }
                    >
                      Дверь
                    </AddBtn>
                    <AddBtn
                      disabled={f.openings.length >= 20}
                      onClick={() =>
                        set("openings", [
                          ...f.openings,
                          { kind: "other", ...KIND_PRESET.other, count: "1" },
                        ])
                      }
                    >
                      Другой проём
                    </AddBtn>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Проёмы не вычитаются — расход будет рассчитан на сплошные стены. Это даёт
                  дополнительный запас.
                </p>
              )}
            </Panel>
          )}

          {step === 2 && (
            <Panel
              n="03"
              title="Рулон и подгонка"
              hint="Размер рулона, раппорт и его смещение указаны на этикетке. Раппорт — шаг повторения рисунка; при подгонке каждое полотно начинается с той же точки узора."
            >
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Типовые размеры рулона
              </p>
              <div className="mb-5 flex flex-wrap gap-2">
                {ROLLS.map((r) => {
                  const active = num(f.rollWidth) === num(r.w) && num(f.rollLength) === num(r.l);
                  return (
                    <button
                      key={r.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setF((p) => ({ ...p, rollWidth: r.w, rollLength: r.l }))}
                      className="rounded border border-border px-3 py-2 text-sm hover:border-primary aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground"
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Ширина рулона, м"
                  hint="Чаще всего 0,53 или 1,06 м"
                  {...fieldProps("rollWidth")}
                />
                <Field
                  label="Длина рулона, м"
                  hint="Стандарт — 10,05 м"
                  {...fieldProps("rollLength")}
                />
                <Field
                  label="Раппорт, см"
                  hint="0 — рисунок без подгонки"
                  {...fieldProps("patternRepeatCm")}
                />
                <Field
                  label="Припуск на подрезку, см"
                  hint="Сверху и снизу вместе, обычно 10 см"
                  {...fieldProps("trimCm")}
                />
                <Field
                  label="Запас материала, %"
                  hint="Рекомендуем 5–15 % на брак и подгонку"
                  {...fieldProps("reservePercent")}
                />
              </div>
            </Panel>
          )}

          {step === 3 &&
            (result ? (
              <Explanation r={result} f={f} />
            ) : (
              <ErrorSummary errors={errors} onGo={(i) => go(i)} />
            ))}

          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => go(step - 1)}
                className="inline-flex h-11 items-center gap-2 rounded border border-border bg-card px-4 text-sm font-semibold hover:border-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Назад
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Сбросить
              </button>
            )}
            {step < 3 ? (
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {step === 2 ? "Показать результат" : "Далее"} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 items-center gap-2 rounded border border-border bg-card px-4 text-sm font-semibold hover:border-primary"
              >
                <RotateCcw className="h-4 w-4" /> Новый расчёт
              </button>
            )}
          </div>
        </form>

        {/* Live summary: sidebar on desktop */}
        <aside aria-live="polite" className="hidden lg:sticky lg:top-24 lg:block">
          <Summary result={result} errorCount={errors.length} onDetails={toResult} />
        </aside>
      </div>

      {/* Live summary: sticky bar on mobile */}
      {step !== 3 && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-graphite text-graphite-foreground lg:hidden"
          aria-live="polite"
        >
          <div className="container-page flex items-center justify-between gap-3 py-3">
            {result ? (
              <p className="min-w-0">
                <span
                  className="font-display text-2xl font-extrabold tabular-nums"
                  data-testid="rolls-mobile"
                >
                  {result.rolls}
                </span>{" "}
                <span className="text-sm">{plural(result.rolls)}</span>
                <span className="block truncate text-xs opacity-60">
                  с запасом {result.reservePercent}%
                </span>
              </p>
            ) : (
              <p className="text-sm">
                Проверьте данные: {errors.length} {errors.length === 1 ? "ошибка" : "ошибки"}
              </p>
            )}
            <button
              type="button"
              onClick={toResult}
              className="shrink-0 rounded bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Подробнее
            </button>
          </div>
        </div>
      )}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}

/* ---------- result views ---------- */

function Summary({
  result,
  errorCount,
  onDetails,
}: {
  result: WallpaperResult | null;
  errorCount: number;
  onDetails: () => void;
}) {
  return (
    <div className="rounded bg-graphite p-7 text-graphite-foreground">
      <p className="text-xs font-bold tracking-[0.14em] uppercase opacity-60">
        Предварительный итог
      </p>
      {result ? (
        <>
          <p className="mt-3 font-display text-7xl font-extrabold tabular-nums" data-testid="rolls">
            {result.rolls}
          </p>
          <p className="mt-1 text-lg">
            {plural(result.rolls)} с запасом {result.reservePercent}%
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-graphite-foreground/15 pt-5 text-sm">
            <Stat k="Без запаса" v={`${result.rollsWithoutReserve} рул.`} />
            <Stat k="Полотен" v={String(result.strips)} />
            <Stat k="Длина полотна" v={`${fmt(result.stripLength)} м`} />
            <Stat k="Полотен с рулона" v={String(result.stripsPerRoll)} />
          </dl>
          <button
            type="button"
            onClick={onDetails}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground underline underline-offset-4"
          >
            Как получилось <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <p className="mt-4 text-sm opacity-85">
          Результат появится, когда все поля будут заполнены корректно. Ошибок: {errorCount}.
        </p>
      )}
    </div>
  );
}

function Explanation({ r, f }: { r: WallpaperResult; f: Form }) {
  const repeat = num(f.patternRepeatCm);
  const trim = num(f.trimCm);
  const rooms = num(f.roomsCount);
  const perimeterLabel =
    f.mode === "room"
      ? `периметр 2 × (${fmt(num(f.roomLength))} + ${fmt(num(f.roomWidth))})`
      : "сумма длин стен";
  const rows: { t: string; d: string; v: string }[] = [
    {
      t: "Длина стен",
      d: `${perimeterLabel}${rooms > 1 ? ` × ${rooms} помещ.` : ""}`,
      v: `${fmt(r.totalWallLength)} м`,
    },
    {
      t: "Длина полотна",
      d:
        repeat > 0
          ? `высота + ${fmt(trim, 1)} см на подрезку, округлено вверх до целого числа раппортов по ${fmt(repeat, 1)} см`
          : `высота стены + ${fmt(trim, 1)} см на подрезку`,
      v: `${fmt(r.stripLength)} м`,
    },
    {
      t: "Полотен с одного рулона",
      d: `${fmt(num(f.rollLength))} м ÷ ${fmt(r.stripLength)} м, остаток идёт в отход`,
      v: String(r.stripsPerRoll),
    },
    {
      t: "Полотен на стены",
      d: `длина каждой стены ÷ ширина рулона ${fmt(num(f.rollWidth))} м, с округлением вверх`,
      v: String(r.stripsGross),
    },
    {
      t: "Сэкономлено на проёмах",
      d: f.deductOpenings
        ? `только целые полотна, пропорционально высоте проёма; площадь проёмов ${fmt(r.openingsArea)} м²`
        : "проёмы не учитываются",
      v: `− ${r.stripsSaved}`,
    },
    { t: "Итого полотен", d: "", v: String(r.strips) },
    {
      t: "Рулонов без запаса",
      d: `точное значение ${fmt(r.rawRolls, 2)}, округлено вверх`,
      v: String(r.rollsWithoutReserve),
    },
    {
      t: `С запасом ${r.reservePercent}%`,
      d: `${fmt(r.rawRolls, 2)} × ${fmt(1 + r.reservePercent / 100)} с округлением вверх`,
      v: String(r.rolls),
    },
  ];
  return (
    <section aria-labelledby="res-title" className="space-y-5">
      <div className="rounded bg-graphite p-6 text-graphite-foreground sm:p-8">
        <p className="text-xs font-bold tracking-[0.14em] uppercase opacity-60">Вам понадобится</p>
        <h2
          id="res-title"
          className="mt-2 font-display text-5xl font-extrabold tabular-nums sm:text-6xl"
        >
          <span data-testid="rolls-result">{r.rolls}</span>{" "}
          <span className="text-2xl font-bold sm:text-3xl">{plural(r.rolls)}</span>
        </h2>
        <p className="mt-2 opacity-75">
          {fmt(num(f.rollWidth))} × {fmt(num(f.rollLength))} м, запас {r.reservePercent}%. Площадь
          оклейки {fmt(r.netArea)} м².
        </p>
      </div>

      {r.warnings.length > 0 && (
        <div className="space-y-2 rounded border border-warning/40 bg-warning-surface p-4 text-sm">
          {r.warnings.map((w) => (
            <p key={w} className="flex gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              {w}
            </p>
          ))}
        </div>
      )}

      <div className="rounded border border-border bg-card">
        <h3 className="border-b border-border px-5 py-4 text-lg">Как получен результат</h3>
        <ol className="divide-y divide-border">
          {rows.map((row, i) => (
            <li key={row.t} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-semibold">
                  <span className="mr-2 text-xs text-primary tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {row.t}
                </p>
                {row.d && <p className="mt-0.5 text-sm text-muted-foreground">{row.d}</p>}
              </div>
              <p className="font-display text-lg font-bold tabular-nums">{row.v}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <Fact k="Площадь стен" v={`${fmt(r.wallArea)} м²`} />
        <Fact k="Площадь проёмов" v={`${fmt(r.openingsArea)} м²`} />
        <Fact k="К оклейке" v={`${fmt(r.netArea)} м²`} />
      </div>

      <p className="flex gap-3 rounded border border-border bg-secondary p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {SITE.disclaimer} Покупайте рулоны одной партии: оттенок разных партий может отличаться.
      </p>
    </section>
  );
}

function ErrorSummary({ errors, onGo }: { errors: FieldError[]; onGo: (step: number) => void }) {
  return (
    <section role="alert" className="rounded border border-destructive/40 bg-card p-6">
      <h2 className="flex items-center gap-2 text-xl">
        <TriangleAlert className="h-5 w-5 text-destructive" /> Расчёт невозможен
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Исправьте данные — результат появится автоматически.
      </p>
      <ul className="mt-4 space-y-2">
        {errors.map((e) => (
          <li key={e.field + e.message}>
            <button
              type="button"
              onClick={() => onGo(stepOf(e.field))}
              className="text-left text-sm text-destructive underline underline-offset-2"
            >
              {STEPS[stepOf(e.field)]?.title}: {e.message}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- small pieces ---------- */

function plural(k: number) {
  const m10 = k % 10,
    m100 = k % 100;
  if (m10 === 1 && m100 !== 11) return "рулон";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "рулона";
  return "рулонов";
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="opacity-60">{k}</dt>
      <dd className="font-semibold tabular-nums">{v}</dd>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded border border-border bg-card p-4">
      <p className="text-muted-foreground">{k}</p>
      <p className="mt-1 font-display text-xl font-bold tabular-nums">{v}</p>
    </div>
  );
}

function Panel({
  n: no,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0 rounded border border-border bg-card p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-display text-sm font-extrabold text-primary">{no}</span>
        <h2 className="text-xl sm:text-2xl">{title}</h2>
      </div>
      <p className="mb-5 max-w-2xl text-sm text-muted-foreground">{hint}</p>
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  onBlur,
  error,
}: {
  id: string;
  label: string;
  hint?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (() => void) | undefined;
  error?: string | undefined;
}) {
  const desc = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id} className="text-xs text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        value={value}
        maxLength={8}
        aria-invalid={!!error}
        aria-describedby={desc}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="h-11 text-base tabular-nums aria-invalid:border-destructive"
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="mt-6 flex h-11 w-11 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddBtn({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-foreground hover:underline disabled:opacity-40"
    >
      <Plus className="h-4 w-4" /> {children}
    </button>
  );
}
