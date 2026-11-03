/**
 * Единая система согласий на cookies.
 * Выбор хранится в localStorage браузера пользователя (ключ CONSENT_KEY) вместе с датой.
 * Необходимые cookies включены всегда; аналитика и маркетинг — только после явного согласия.
 */
export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO-дата, когда пользователь сделал выбор. */
  decidedAt: string;
  version: number;
};

export const CONSENT_KEY = "dk-consent";
export const CONSENT_VERSION = 1;
const EVENT = "dk-consent-change";
const OPEN_EVENT = "dk-consent-open";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.version !== CONSENT_VERSION || typeof c.decidedAt !== "string") return null;
    return { ...c, necessary: true };
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const c: Consent = {
    necessary: true,
    analytics: !!choice.analytics,
    marketing: !!choice.marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* хранилище недоступно — выбор действует до перезагрузки */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: c }));
  return c;
}

export function hasConsent(cat: ConsentCategory): boolean {
  if (cat === "necessary") return true;
  return readConsent()?.[cat] === true;
}

export function onConsentChange(fn: (c: Consent) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Consent>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

/** Открыть окно настроек cookies (ссылка в подвале). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(fn: () => void) {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}
