import { track } from "@/lib/analytics";
import { useId, useMemo, useRef, useState } from "react";
import { CalculatorNextStep } from "@/monetization/components/CalculatorNextStep";
import type { CatalogSectionId } from "@/monetization/types";
import { SITE } from "@/data/site";
import type { CalcConfig } from "./configs";

export function GenericCalculator({
  config,
  nextSection,
}: {
  config: CalcConfig;
  nextSection?: CatalogSectionId | undefined;
}) {
  const uid = useId();
  const tracked = useRef(false);
  const [values, setValuesRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, String(f.value)])),
  );
  const setValues: typeof setValuesRaw = (u) => {
    if (!tracked.current) {
      tracked.current = true;
      track("calculator_used", { calculator: config.slug });
    }
    setValuesRaw(u);
  };
  const rows = useMemo(
    () =>
      config.compute(
        Object.fromEntries(
          Object.entries(values).map(([k, v]) => [
            k,
            k === "shape" ? v : Number(v.replace(",", ".")),
          ]),
        ),
      ),
    [config, values],
  );
  const invalid = config.fields.some(
    (f) =>
      !("options" in f) &&
      (values[f.key] === "" || !(Number(values[f.key]!.replace(",", ".")) >= 0)),
  );
  const primary = rows.find((r) => r.primary);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <form
        className="grid content-start items-start gap-5 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby={`${uid}-note`}
      >
        {config.fields.map((f) => {
          const id = `${uid}-${f.key}`;
          if ("options" in f)
            return (
              <fieldset key={f.key} className="sm:col-span-2">
                <legend className="mb-2 text-sm font-semibold">{f.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {f.options.map((o) => (
                    <label
                      key={o.value}
                      className="cursor-pointer rounded-sm border border-border px-4 py-2 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background"
                    >
                      <input
                        type="radio"
                        name={id}
                        value={o.value}
                        checked={values[f.key] === o.value}
                        onChange={() => setValues((s) => ({ ...s, [f.key]: o.value }))}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          const v = values[f.key] ?? "";
          const bad = v === "" || !(Number(v.replace(",", ".")) >= 0);
          return (
            <div key={f.key}>
              <label htmlFor={id} className="text-sm font-semibold">
                {f.label}
                {f.unit && <span className="font-normal text-muted-foreground">, {f.unit}</span>}
              </label>
              <input
                id={id}
                inputMode="decimal"
                value={v}
                aria-invalid={bad}
                aria-describedby={f.hint ? `${id}-hint` : undefined}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                className="mt-2 h-12 w-full rounded-sm border border-input bg-card px-4 text-base tabular-nums outline-none focus:border-primary aria-invalid:border-destructive"
              />
              {f.hint && (
                <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
                  {f.hint}
                </p>
              )}
            </div>
          );
        })}
      </form>
      <aside className="space-y-6" aria-live="polite">
        <div className="rounded-sm bg-graphite p-7 text-graphite-foreground">
          {invalid ? (
            <p>Проверьте поля: нужны неотрицательные числа.</p>
          ) : (
            <>
              {primary && (
                <>
                  <p className="text-xs tracking-wider uppercase opacity-70">{primary.label}</p>
                  <p className="mt-1 font-display text-6xl font-extrabold tabular-nums">
                    {primary.value}
                    <span className="ml-2 text-xl font-semibold opacity-70">{primary.unit}</span>
                  </p>
                </>
              )}
              <dl className="mt-6 space-y-2 border-t border-graphite-foreground/20 pt-4 text-sm">
                {rows
                  .filter((r) => !r.primary)
                  .map((r) => (
                    <div key={r.label} className="flex justify-between gap-4">
                      <dt className="opacity-75">{r.label}</dt>
                      <dd className="font-semibold tabular-nums">
                        {r.value} {r.unit}
                      </dd>
                    </div>
                  ))}
              </dl>
            </>
          )}
        </div>
        {nextSection && !invalid && (
          <CalculatorNextStep
            section={nextSection}
            summary={primary ? `${primary.value} ${primary.unit}` : undefined}
          />
        )}
        <div className="rounded-sm border border-border p-6 text-sm">
          <p className="font-semibold">Как считаем</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted-foreground">
            {config.method.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </div>
        <p id={`${uid}-note`} className="text-xs text-muted-foreground">
          {config.note} {SITE.disclaimer} Значения в полях по умолчанию — пример заполнения, а не
          норма.
        </p>
      </aside>
    </div>
  );
}
