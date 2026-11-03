import { track } from "@/lib/analytics";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Printer, RotateCcw, Save } from "lucide-react";
import { DEFAULT_CONFIG, LABELS, LIMITS, normalizeConfig, type HouseConfig } from "./model";
import { geometry, warnings } from "./geometry";
import { getScenario } from "./presets";
import { clearConfig, loadConfig, saveConfig } from "./storage";
import { EstimateTable, GeometrySummary, HouseDisclaimer } from "./EstimateView";

type Key = keyof HouseConfig;
type Opt = Record<string, string>;

const STEPS = [
  "Габариты и этажность",
  "Назначение и планировка",
  "Конструктив и фундамент",
  "Стены и утепление",
  "Кровля и фасад",
  "Окна, двери и отделка",
  "Инженерные системы",
  "Участок и логистика",
  "Итоговая конфигурация",
] as const;

export function HouseConfigurator({ scenario }: { scenario?: string | undefined }) {
  const uid = useId();
  const [c, setC] = useState<HouseConfig>(DEFAULT_CONFIG);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState<"idle" | "ok" | "fail">("idle");
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getScenario(scenario);
    if (s) setC(normalizeConfig(s.config));
    else {
      const stored = loadConfig();
      if (stored) setC(stored);
    }
  }, [scenario]);

  const g = useMemo(() => geometry(c), [c]);
  const warn = useMemo(() => warnings(c, g), [c, g]);

  const set = <K extends Key>(k: K, v: HouseConfig[K]) => {
    if (!started.current) {
      started.current = true;
      track("configurator_used", { calculator: "house-configurator" });
    }
    setSaved("idle");
    setC((prev) => normalizeConfig({ ...prev, [k]: v }));
  };

  const go = (n: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
    if (n === STEPS.length - 1)
      track("calculation_completed", { calculator: "house-configurator" });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const num = (
    k: Key & keyof typeof LIMITS,
    label: string,
    unit?: string,
    stepVal = 1,
    hint?: string,
  ) => {
    const [min, max] = LIMITS[k];
    return (
      <NumField
        id={`${uid}-${k}`}
        label={label}
        unit={unit}
        hint={hint}
        min={min}
        max={max}
        step={stepVal}
        value={c[k] as number}
        onChange={(v) => set(k, v as never)}
      />
    );
  };
  const choice = (k: Key, label: string, opts: Opt, hint?: string) => (
    <Choice
      name={`${uid}-${k}`}
      label={label}
      hint={hint}
      options={opts}
      value={String(c[k])}
      onChange={(v) => set(k, (k === "floors" ? Number(v) : v) as never)}
    />
  );
  const flag = (k: Key, label: string) => (
    <Flag label={label} checked={!!c[k]} onChange={(v) => set(k, v as never)} />
  );

  const roofCovers: Opt =
    c.roofShape === "flat"
      ? { membrane: LABELS.roofCover.membrane }
      : Object.fromEntries(Object.entries(LABELS.roofCover).filter(([k]) => k !== "membrane"));

  const panels: ReactNode[] = [
    <>
      {num("length", "Длина дома", "м", 0.5, "По наружным граням стен")}
      {num("width", "Ширина дома", "м", 0.5)}
      {choice("floors", "Этажность", { "1": "Один этаж", "2": "Два этажа" })}
      {num("ceiling", "Высота потолка", "м", 0.05, "Чистая высота этажа")}
    </>,
    <>
      {choice("purpose", "Назначение", LABELS.purpose)}
      {num("bedrooms", "Спальни", "шт")}
      {num("bathrooms", "Санузлы", "шт")}
      {choice(
        "package",
        "Комплектация",
        LABELS.package,
        "Определяет, какие этапы попадут в структуру сметы",
      )}
    </>,
    <>
      {choice("structure", "Конструктивная система", LABELS.structure)}
      {choice(
        "foundation",
        "Фундамент",
        LABELS.foundation,
        "Окончательный тип выбирают по геологии участка",
      )}
    </>,
    <>
      {num(
        "insulation",
        "Толщина утепления стен",
        "мм",
        10,
        "Толщину определяет теплотехнический расчёт для региона",
      )}
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Площадь стен сейчас: <b className="text-foreground tabular-nums">{fmt(g.wallNet)} м²</b>,
        утеплитель — <b className="text-foreground tabular-nums">{fmt(g.insulationVolume)} м³</b>.
      </p>
    </>,
    <>
      {choice("roofShape", "Форма крыши", LABELS.roofShape)}
      {c.roofShape !== "flat" && num("roofPitch", "Уклон скатов", "°", 1)}
      {num("overhang", "Свес кровли", "м", 0.05)}
      {choice("roofCover", "Кровельное покрытие", roofCovers)}
      {choice("facade", "Фасад", LABELS.facade)}
    </>,
    <>
      {num("windows", "Окна", "шт")}
      {num("windowArea", "Средняя площадь окна", "м²", 0.1)}
      {num("doors", "Наружные двери", "шт")}
      {num("terrace", "Терраса", "м²", 1, "0 — без террасы")}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        {flag("porch", "Крыльцо")}
        {flag("canopy", "Навес")}
      </div>
      {choice("finish", "Внутренняя отделка", LABELS.finish)}
    </>,
    <>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        {flag("power", "Электричество")}
        {flag("water", "Водоснабжение")}
        {flag("sewer", "Канализация")}
        {flag("septic", "Септик")}
        {flag("ventilation", "Вентиляция")}
      </div>
      {choice("heating", "Отопление", LABELS.heating)}
    </>,
    <>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        {flag("sitePrep", "Подготовка участка")}
        {flag("wasteRemoval", "Вывоз отходов")}
      </div>
      {num("deliveryKm", "Расстояние доставки", "км", 5)}
    </>,
    null,
  ];

  const last = step === STEPS.length - 1;

  return (
    <div ref={topRef} className="scroll-mt-24">
      <ol className="mb-8 flex gap-1 overflow-hidden" aria-label="Шаги конфигуратора">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === step ? "step" : undefined}
              aria-label={`Шаг ${i + 1}: ${s}`}
              className={`block h-1 w-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          </li>
        ))}
      </ol>
      <p className="eyebrow">
        Шаг {step + 1} из {STEPS.length}
      </p>
      <h2 className="mt-2 text-2xl sm:text-3xl">{STEPS[step]}</h2>

      {!last ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <form
            className="grid content-start gap-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              go(step + 1);
            }}
          >
            {panels[step]}
            <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="inline-flex h-12 items-center gap-2 border border-border px-5 text-sm font-semibold hover:border-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Назад
                </button>
              )}
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Далее <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
          <aside aria-live="polite" className="h-fit bg-graphite p-6 text-graphite-foreground">
            <p className="text-xs tracking-wider uppercase opacity-70">Общая площадь по контуру</p>
            <p className="mt-1 font-display text-5xl font-extrabold tabular-nums">
              {fmt(g.floorArea)}
              <span className="ml-2 text-lg opacity-70">м²</span>
            </p>
            <dl className="mt-5 space-y-1.5 border-t border-graphite-foreground/20 pt-4 text-sm">
              <Row k="Периметр" v={`${fmt(g.perimeter)} м`} />
              <Row k="Стены без проёмов" v={`${fmt(g.wallNet)} м²`} />
              <Row k="Кровля" v={`${fmt(g.roof)} м²`} />
              <Row k="Фасад" v={`${fmt(g.facade)} м²`} />
            </dl>
            {warn.length > 0 && (
              <p className="mt-4 text-xs opacity-80">
                Есть замечания: {warn.length}. Подробности — на последнем шаге.
              </p>
            )}
          </aside>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <Summary c={c} />
          <GeometrySummary g={g} />
          {warn.length > 0 && (
            <section className="border-l-2 border-warning bg-warning-surface p-6">
              <h3 className="text-lg">На что обратить внимание</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {warn.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </section>
          )}
          <EstimateTable c={c} g={g} />
          <HouseDisclaimer />
          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="inline-flex h-12 items-center gap-2 border border-border px-5 text-sm font-semibold hover:border-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Изменить параметры
            </button>
            <button
              type="button"
              onClick={() => {
                const ok = saveConfig(c);
                setSaved(ok ? "ok" : "fail");
                if (ok) track("configuration_saved", { foundation: String(c.foundation ?? "") });
              }}
              className="inline-flex h-12 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              {saved === "ok" ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{" "}
              {saved === "ok" ? "Сохранено в этом браузере" : "Сохранить в браузере"}
            </button>
            <button
              type="button"
              onClick={() => {
                track("result_printed", { source: "configurator" });
                window.print();
              }}
              className="inline-flex h-12 items-center gap-2 border border-border px-5 text-sm font-semibold hover:border-foreground"
            >
              <Printer className="h-4 w-4" /> Распечатать
            </button>
            <button
              type="button"
              onClick={() => {
                clearConfig();
                setC(DEFAULT_CONFIG);
                setSaved("idle");
                go(0);
              }}
              className="inline-flex h-12 items-center gap-2 px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Начать заново
            </button>
          </div>
          {saved === "fail" && (
            <p className="text-sm text-destructive">
              Браузер не дал сохранить данные — используйте печать.
            </p>
          )}
          <p className="text-sm text-muted-foreground print:hidden">
            Сохранённую конфигурацию можно открыть на странице{" "}
            <Link to="/doma/smeta" className="underline underline-offset-4">
              «Структура сметы»
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="opacity-75">{k}</dt>
      <dd className="font-semibold tabular-nums">{v}</dd>
    </div>
  );
}

function Summary({ c }: { c: HouseConfig }) {
  const items: [string, string][] = [
    [
      "Габариты",
      `${fmt(c.length)} × ${fmt(c.width)} м, этажей: ${c.floors}, потолок ${fmt(c.ceiling)} м`,
    ],
    ["Назначение", `${LABELS.purpose[c.purpose]}; спален ${c.bedrooms}, санузлов ${c.bathrooms}`],
    ["Комплектация", LABELS.package[c.package]],
    [
      "Конструктив",
      `${LABELS.structure[c.structure]}, фундамент — ${LABELS.foundation[c.foundation].toLowerCase()}`,
    ],
    ["Утепление стен", `${c.insulation} мм`],
    [
      "Кровля",
      `${LABELS.roofShape[c.roofShape]}${c.roofShape !== "flat" ? `, ${c.roofPitch}°` : ""}; ${LABELS.roofCover[c.roofCover].toLowerCase()}`,
    ],
    ["Фасад", LABELS.facade[c.facade]],
    ["Окна и двери", `окон ${c.windows} по ${fmt(c.windowArea)} м², дверей ${c.doors}`],
    [
      "Дополнительно",
      [c.terrace > 0 && `терраса ${c.terrace} м²`, c.porch && "крыльцо", c.canopy && "навес"]
        .filter(Boolean)
        .join(", ") || "нет",
    ],
    ["Отделка", LABELS.finish[c.finish]],
    [
      "Инженерия",
      [
        c.power && "электричество",
        c.water && "вода",
        c.sewer && "канализация",
        c.septic && "септик",
        c.ventilation && "вентиляция",
        c.heating !== "none" && `отопление: ${LABELS.heating[c.heating].toLowerCase()}`,
      ]
        .filter(Boolean)
        .join(", ") || "не выбрана",
    ],
    [
      "Участок",
      [
        c.sitePrep && "подготовка",
        c.wasteRemoval && "вывоз отходов",
        c.deliveryKm > 0 && `доставка ${c.deliveryKm} км`,
      ]
        .filter(Boolean)
        .join(", ") || "—",
    ],
  ];
  return (
    <section>
      <h3 className="text-lg">Параметры</h3>
      <dl className="mt-4 grid border-t border-border sm:grid-cols-2">
        {items.map(([k, v]) => (
          <div key={k} className="border-b border-border py-3 sm:pr-6">
            <dt className="text-xs tracking-wider text-muted-foreground uppercase">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function NumField({
  id,
  label,
  unit,
  hint,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit?: string | undefined;
  hint?: string | undefined;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {unit && <span className="font-normal text-muted-foreground">, {unit}</span>}
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter отправляет форму раньше blur — фиксируем введённое значение сразу.
          if (e.key !== "Enter") return;
          const n = Number(text.replace(",", "."));
          if (Number.isFinite(n) && text.trim() !== "") onChange(n);
        }}
        onBlur={() => {
          const n = Number(text.replace(",", "."));
          if (Number.isFinite(n) && text.trim() !== "") onChange(n);
          else setText(String(value));
        }}
        className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-4 text-base tabular-nums outline-none focus:border-primary"
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
        {hint ? `${hint}. ` : ""}От {min} до {max}
        {step < 1 ? `, шаг ${String(step).replace(".", ",")}` : ""}
      </p>
    </div>
  );
}

function Choice({
  name,
  label,
  hint,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string | undefined;
  options: Opt;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([v, l]) => (
          <label
            key={v}
            className="cursor-pointer rounded-sm border border-border px-4 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-ring"
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            {l}
          </label>
        ))}
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </fieldset>
  );
}

function Flag({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm has-checked:border-foreground has-focus-visible:outline-2 has-focus-visible:outline-ring">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}
