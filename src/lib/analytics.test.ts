import { beforeEach, describe, expect, it } from "vitest";
import { sanitize, initAnalytics, isAnalyticsLoaded } from "./analytics";
import { hasConsent, readConsent, saveConsent, CONSENT_KEY } from "./consent";

describe("consent", () => {
  beforeEach(() => localStorage.clear());
  it("analytics is off until the user agrees", () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("necessary")).toBe(true);
  });
  it("stores the choice with its date", () => {
    saveConsent({ analytics: true, marketing: false });
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY)!);
    expect(c.analytics).toBe(true);
    expect(c.marketing).toBe(false);
    expect(Number.isNaN(Date.parse(c.decidedAt))).toBe(false);
  });
  it("'only necessary' keeps analytics off", () => {
    saveConsent({ analytics: false, marketing: false });
    expect(hasConsent("analytics")).toBe(false);
  });
  it("no scripts load without consent", () => {
    initAnalytics();
    expect(isAnalyticsLoaded()).toEqual({ ym: false, ga: false });
    expect(document.querySelector('script[src*="mc.yandex.ru"]')).toBeNull();
  });
});

describe("analytics sanitize", () => {
  it("drops personal data", () => {
    expect(
      sanitize({ name: "Иван", phone: "+7 900 123-45-67", email: "a@b.ru", city: "Тула", calculator: "plitka", note: "x@y.ru" }),
    ).toEqual({ calculator: "plitka" });
  });
});
