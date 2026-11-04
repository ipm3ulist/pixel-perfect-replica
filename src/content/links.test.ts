import { describe, expect, it } from "vitest";
import { CATEGORIES, getContent } from "./index";
import { nextSteps } from "./links";

describe("связи между разделами", () => {
  it("статья о фундаменте ведёт к калькулятору бетона, материалам и смежным технологиям", () => {
    const s = nextSteps(getContent("article:vybor-fundamenta")!);
    expect(s.calculators.map((c) => c.id)).toContain("calc:beton");
    expect(s.materials.length).toBeGreaterThan(0);
    expect(s.workType).toBe("stroitelstvo");
  });

  it("статья о квартире ведёт к ремонту, а не к стройке", () => {
    expect(nextSteps(getContent("article:kak-vybrat-oboi")!).workType).toBe("remont");
  });

  it("разделы «Сметы и расчёты» и «Строительные материалы» опубликованы, «Инструменты» скрыт до наполнения", () => {
    const st = (id: string) => CATEGORIES.find((c) => c.id === id)?.status;
    expect(st("doma.smety")).toBe("published");
    expect(st("doma.materialy")).toBe("published");
    expect(st("doma.instrumenty")).toBe("draft");
  });
});
