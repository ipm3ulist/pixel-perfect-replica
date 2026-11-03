import { track } from "@/lib/analytics";
import { useId, useState } from "react";
import { z } from "zod";
import { LEADS_ENABLED } from "../config";
import type { LeadRequest } from "../types";

export const leadSchema = z.object({
  object: z.enum(["kvartira", "dom"]),
  work: z.enum(["remont", "otdelka", "stroitelstvo", "inzhenernye", "krovlya", "drugoe"]),
  city: z.string().trim().min(2, "Укажите город").max(80),
  timing: z.string().trim().max(80),
  description: z.string().trim().min(10, "Опишите задачу хотя бы в двух словах").max(2000),
  name: z.string().trim().min(1, "Как к вам обращаться").max(80),
  contact: z.string().trim().min(5, "Телефон или e-mail").max(120),
  consentProcessing: z.literal(true, { message: "Нужно согласие на обработку данных" }),
  consentShare: z.boolean(),
});

const WORKS: [LeadRequest["work"], string][] = [
  ["remont", "Ремонт"],
  ["otdelka", "Отделка"],
  ["stroitelstvo", "Строительство"],
  ["inzhenernye", "Инженерные системы"],
  ["krovlya", "Кровля и фасад"],
  ["drugoe", "Другое"],
];

/**
 * Форма заявки. Пока LEADS_ENABLED = false, поля заблокированы и ничего не отправляется.
 * `onSubmit` подключается к серверному хранилищу при запуске приёма заявок.
 */
export function LeadForm({ onSubmit }: { onSubmit?: (r: LeadRequest) => Promise<void> }) {
  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const active = LEADS_ENABLED && !!onSubmit;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!active) return;
    const fd = new FormData(e.currentTarget);
    const parsed = leadSchema.safeParse({
      ...Object.fromEntries(fd),
      consentProcessing: fd.get("consentProcessing") === "on",
      consentShare: fd.get("consentShare") === "on",
    });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setState("sending");
    try {
      await onSubmit!(parsed.data as LeadRequest);
      track("lead_submitted", {
        object: parsed.data.object,
        work: parsed.data.work,
      });
      setState("done");
    } catch {
      setState("fail");
    }
  }

  if (state === "done")
    return (
      <p className="border border-border bg-card p-6 font-semibold">
        Заявка сохранена. Мы не передаём её третьим лицам без вашего согласия.
      </p>
    );

  const input =
    "mt-2 h-12 w-full rounded-sm border border-input bg-card px-4 outline-none focus:border-primary disabled:opacity-60";
  const err = (k: string) =>
    errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;
  return (
    <form onSubmit={submit} noValidate>
      {!active && (
        <p role="status" className="mb-6 border-l-2 border-primary bg-card p-4 text-sm">
          Приём заявок ещё не открыт: на сайте пока нет проверенных исполнителей. Форма показана,
          чтобы было видно, какие данные мы будем спрашивать — и только их.
        </p>
      )}
      <fieldset disabled={!active} className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-o`} className="text-sm font-semibold">
            Объект
          </label>
          <select id={`${uid}-o`} name="object" className={input}>
            <option value="kvartira">Квартира</option>
            <option value="dom">Частный дом</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-w`} className="text-sm font-semibold">
            Вид работ
          </label>
          <select id={`${uid}-w`} name="work" className={input}>
            {WORKS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-c`} className="text-sm font-semibold">
            Город
          </label>
          <input id={`${uid}-c`} name="city" maxLength={80} className={input} />
          {err("city")}
        </div>
        <div>
          <label htmlFor={`${uid}-t`} className="text-sm font-semibold">
            Желаемые сроки
          </label>
          <input id={`${uid}-t`} name="timing" maxLength={80} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-d`} className="text-sm font-semibold">
            Задача
          </label>
          <textarea
            id={`${uid}-d`}
            name="description"
            rows={4}
            maxLength={2000}
            className={`${input} h-auto py-3`}
          />
          {err("description")}
        </div>
        <div>
          <label htmlFor={`${uid}-n`} className="text-sm font-semibold">
            Имя
          </label>
          <input
            id={`${uid}-n`}
            name="name"
            maxLength={80}
            autoComplete="given-name"
            className={input}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-k`} className="text-sm font-semibold">
            Телефон или e-mail
          </label>
          <input id={`${uid}-k`} name="contact" maxLength={120} className={input} />
          {err("contact")}
        </div>
        <label className="flex gap-3 text-sm sm:col-span-2">
          <input type="checkbox" name="consentProcessing" className="mt-1" /> Согласен на обработку
          персональных данных для ответа на заявку.
        </label>
        {err("consentProcessing")}
        <label className="flex gap-3 text-sm sm:col-span-2">
          <input type="checkbox" name="consentShare" className="mt-1" /> Разрешаю передать заявку
          проверенному исполнителю (необязательно — без этой отметки заявка никуда не передаётся).
        </label>
        <button
          type="submit"
          className="h-12 rounded-sm bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
        >
          {state === "sending" ? "Отправляем…" : "Отправить заявку"}
        </button>
        {state === "fail" && (
          <p className="text-sm text-destructive sm:col-span-2">
            Не удалось отправить. Попробуйте позже.
          </p>
        )}
      </fieldset>
    </form>
  );
}
