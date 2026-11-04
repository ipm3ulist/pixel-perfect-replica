import { supabase } from "@/integrations/supabase/client";
import type { LeadRequest } from "./types";

/** Версия текста согласия — сохраняется вместе с заявкой. */
export const CONSENT_VERSION = "2026-11-04";
/** Минимальное время заполнения формы: быстрее заполняют только боты. */
export const MIN_FILL_MS = 3000;

export type LeadContext = {
  /** Параметры объекта: результат калькулятора, помещение, площадь и т.п. */
  params?: Record<string, string | number>;
  sourcePath?: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function readUtm(search: string): Record<string, string> {
  const q = new URLSearchParams(search);
  return Object.fromEntries(
    UTM_KEYS.flatMap((k) => (q.get(k) ? [[k, q.get(k)!.slice(0, 100)]] : [])),
  );
}

/** Признаки бота: заполнено скрытое поле или форма отправлена слишком быстро. */
export const looksLikeBot = (honeypot: string, startedAt: number, now = Date.now()) =>
  honeypot.trim() !== "" || now - startedAt < MIN_FILL_MS;

/** Сохраняет заявку в базе. Читать заявки посетители не могут — только добавлять. */
export async function submitLead(r: LeadRequest, ctx: LeadContext = {}) {
  const { error } = await supabase.from("leads").insert({
    object: r.object,
    work: r.work,
    city: r.city,
    timing: r.timing,
    description: r.description,
    name: r.name,
    contact: r.contact,
    consent_processing: r.consentProcessing,
    consent_share: r.consentShare,
    consent_version: CONSENT_VERSION,
    params: ctx.params ?? {},
    source_path: (ctx.sourcePath ?? window.location.pathname).slice(0, 300),
    referrer: document.referrer.slice(0, 500),
    utm: readUtm(window.location.search),
  });
  if (error) throw new Error(error.message.includes("rate_limited") ? "rate_limited" : "failed");
}
