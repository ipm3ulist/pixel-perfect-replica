import { ANALYTICS } from "@/data/site";
import { hasConsent } from "./consent";

/**
 * Яндекс Метрика и Google Analytics 4 под управлением системы согласий.
 * Скрипты загружаются только если: задан ID в конфигурации И пользователь разрешил аналитику.
 * Повторная инициализация исключена флагами ниже. Без ID сайт работает без ошибок.
 */
type W = Window & {
  ym?: ((...a: unknown[]) => void) & { a?: unknown[]; l?: number };
  dataLayer?: unknown[];
  gtag?: (...a: unknown[]) => void;
  [k: `ga-disable-${string}`]: boolean | undefined;
};

let ymLoaded = false;
let gaLoaded = false;

export type AnalyticsEvent =
  | "calculator_used"
  | "calculation_completed"
  | "configurator_used"
  | "configuration_saved"
  | "estimate_viewed"
  | "result_printed"
  | "material_viewed"
  | "store_clicked"
  | "house_project_viewed"
  | "partner_clicked"
  | "lead_submitted";

/** Ключи, которые никогда не уходят в аналитику (персональные данные и содержимое заявок). */
const PII_KEY =
  /name|имя|phone|tel|телефон|mail|почт|contact|контакт|address|адрес|city|город|description|описан|message|comment/i;
const PII_VALUE = /@|\+?\d[\d\s()-]{8,}\d/;

export function sanitize(
  params: Record<string, unknown> = {},
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (PII_KEY.test(k)) continue;
    if (typeof v === "number" || typeof v === "boolean") out[k] = v;
    else if (typeof v === "string" && v.length <= 100 && !PII_VALUE.test(v)) out[k] = v;
  }
  return out;
}

function loadScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Вызывается при старте и после изменения согласия. */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  const w = window as W;
  const allowed = hasConsent("analytics");
  if (ANALYTICS.gaId) w[`ga-disable-${ANALYTICS.gaId}`] = !allowed;
  if (!allowed) return;

  if (ANALYTICS.ymId && !ymLoaded) {
    ymLoaded = true;
    const ym = function (...a: unknown[]) {
      (ym.a = ym.a || []).push(a);
    } as NonNullable<W["ym"]>;
    ym.l = Date.now();
    w.ym = w.ym || ym;
    loadScript("https://mc.yandex.ru/metrika/tag.js");
    w.ym(Number(ANALYTICS.ymId), "init", {
      defer: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    });
  }
  if (ANALYTICS.gaId && !gaLoaded) {
    gaLoaded = true;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.gaId}`);
    w.gtag("js", new Date());
    w.gtag("config", ANALYTICS.gaId, { send_page_view: false, anonymize_ip: true });
  }
}

export function isAnalyticsLoaded() {
  return { ym: ymLoaded, ga: gaLoaded };
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !hasConsent("analytics")) return;
  const w = window as W;
  if (ymLoaded && w.ym) w.ym(Number(ANALYTICS.ymId), "hit", path);
  if (gaLoaded && w.gtag) w.gtag("event", "page_view", { page_path: path });
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const clean = sanitize(params);
  window.__lovableEvents?.track?.(`project.${event}`, clean as Record<string, string | number>);
  if (!hasConsent("analytics")) return;
  const w = window as W;
  if (ymLoaded && w.ym) w.ym(Number(ANALYTICS.ymId), "reachGoal", event, clean);
  if (gaLoaded && w.gtag) w.gtag("event", event, clean);
}
