import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, normalizeConfig } from "./model";
import { geometry, warnings } from "./geometry";
import { buildEstimate, isDisplayablePrice, PRICES_ENABLED } from "./estimate";
import { SCENARIOS } from "./presets";

const cfg = (o = {}) => normalizeConfig({ ...DEFAULT_CONFIG, ...o });

describe("геометрия дома", () => {
  it("площадь и периметр прямоугольника 12 × 9", () => {
    const g = geometry(cfg({ floors: 1 }));
    expect(g.footprint).toBe(108);
    expect(g.perimeter).toBe(42);
  });
  it("два этажа удваивают площадь", () => {
    expect(geometry(cfg({ floors: 2 })).floorArea).toBe(216);
  });
  it("высота стен 1 этажа = потолок + перекрытие", () => {
    expect(geometry(cfg({ ceiling: 2.7 })).wallHeight).toBe(3);
  });
  it("проёмы вычитаются из стен", () => {
    const g = geometry(cfg({ windows: 10, windowArea: 1.5, doors: 1 }));
    expect(g.openings).toBe(17.1);
    expect(g.wallNet).toBe(126 - 17.1);
  });
  it("площадь двускатной кровли = проекция / cos уклона", () => {
    const g = geometry(
      cfg({ length: 10, width: 8, overhang: 0, roofShape: "gable", roofPitch: 45 }),
    );
    expect(g.roof).toBe(113.14); // 80 / cos 45°
  });
  it("плоская кровля = проекция со свесами", () => {
    expect(geometry(cfg({ length: 10, width: 8, overhang: 0.5, roofShape: "flat" })).roof).toBe(99);
  });
  it("фронтоны двускатной крыши 45°, пролёт 8 м = 2 × 16 м²", () => {
    expect(geometry(cfg({ width: 8, length: 12, roofShape: "gable", roofPitch: 45 })).gables).toBe(
      32,
    );
  });
  it("у вальмовой нет фронтонов", () => {
    expect(geometry(cfg({ roofShape: "hip" })).gables).toBe(0);
  });
  it("проёмы не могут превысить площадь стен", () => {
    const g = geometry(cfg({ length: 4, width: 4, windows: 60, windowArea: 8 }));
    expect(g.wallNet).toBe(0);
  });
});

describe("нормализация конфигурации", () => {
  it("ограничивает размеры", () => {
    const c = normalizeConfig({ length: 999, width: -3 });
    expect(c.length).toBe(30);
    expect(c.width).toBe(4);
  });
  it("плоской крыше назначается мембрана", () => {
    expect(normalizeConfig({ roofShape: "flat", roofCover: "metal" }).roofCover).toBe("membrane");
  });
  it("неизвестное значение заменяется значением по умолчанию", () => {
    expect(normalizeConfig({ structure: "xxx" as never }).structure).toBe(DEFAULT_CONFIG.structure);
  });
});

describe("предварительная смета", () => {
  it("денежная оценка выключена", () => {
    expect(PRICES_ENABLED).toBe(false);
  });
  it("в строках сметы нет цен", () => {
    expect(buildEstimate(cfg()).every((l) => l.price === undefined)).toBe(true);
  });
  it("демо-цена никогда не показывается", () => {
    expect(
      isDisplayablePrice({
        value: 100,
        region: "СПб",
        source: "x",
        checkedAt: "2026-10-27",
        status: "demo",
      }),
    ).toBe(false);
  });
  it("проверенная цена без источника не показывается", () => {
    expect(
      isDisplayablePrice({
        value: 100,
        region: "СПб",
        source: "",
        checkedAt: "2026-10-27",
        status: "verified",
      }),
    ).toBe(false);
  });
  it("число свай не выдумывается — определяется проектом", () => {
    expect(
      buildEstimate(cfg({ foundation: "piles" })).find((l) => l.id === "found")?.qty,
    ).toBeNull();
  });
  it("второй этаж добавляет междуэтажное перекрытие", () => {
    expect(buildEstimate(cfg({ floors: 2 })).some((l) => l.id === "slab")).toBe(true);
  });
  it("предупреждение о доме без отопления", () => {
    const c = cfg({ purpose: "permanent", heating: "none" });
    expect(warnings(c, geometry(c)).some((w) => w.includes("отопление"))).toBe(true);
  });
  it("у плоской кровли нет ложного предупреждения об уклоне", () => {
    const c = cfg({ roofShape: "flat", roofCover: "membrane" });
    expect(warnings(c, geometry(c)).some((w) => w.includes("уклон"))).toBe(false);
  });
  it("канализация без септика даёт предупреждение", () => {
    const c = cfg({ sewer: true, septic: false });
    expect(warnings(c, geometry(c)).some((w) => w.includes("септик"))).toBe(true);
  });
});

describe("смета следует конфигурации", () => {
  it("терраса появляется только при ненулевой площади", () => {
    expect(buildEstimate(cfg({ terrace: 0 })).some((l) => l.id === "ter")).toBe(false);
    expect(buildEstimate(cfg({ terrace: 20 })).find((l) => l.id === "ter")?.qty).toBe(20);
  });
  it("смена фундамента меняет строку сметы", () => {
    const strip = buildEstimate(cfg({ foundation: "strip" })).find((l) => l.id === "found");
    expect(strip?.unit).toBe("м");
    expect(strip?.qty).toBe(42); // периметр 12 × 9
  });
  it("комплектация «тёплый контур» не включает отделку", () => {
    expect(buildEstimate(cfg({ package: "shell" })).some((l) => l.stage === "finish")).toBe(false);
  });
  it("комплектация «для проживания» добавляет подготовку к проживанию", () => {
    expect(buildEstimate(cfg({ package: "living" })).some((l) => l.id === "liv")).toBe(true);
  });
  it("нулевая доставка убирает строку логистики", () => {
    expect(buildEstimate(cfg({ deliveryKm: 0 })).some((l) => l.id === "deliv")).toBe(false);
  });
  it("отключённая инженерия не попадает в смету", () => {
    const lines = buildEstimate(
      cfg({ power: false, water: false, sewer: false, septic: false, heating: "none" }),
    );
    expect(lines.some((l) => l.stage === "engineering")).toBe(false);
  });
});

describe("демо-сценарии", () => {
  it("три сценария с уникальными адресами и допустимыми параметрами", () => {
    expect(SCENARIOS).toHaveLength(3);
    expect(new Set(SCENARIOS.map((s) => s.slug)).size).toBe(3);
    for (const s of SCENARIOS) expect(normalizeConfig(s.config)).toMatchObject(s.config);
  });
});
