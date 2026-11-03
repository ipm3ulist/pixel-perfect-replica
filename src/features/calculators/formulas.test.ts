import { describe, expect, it } from "vitest";
import { blocks, concrete, insulation, laminate, paint, tile } from "./formulas";

describe("paint", () => {
  it("subtracts openings, multiplies by layers and consumption, rounds cans up", () => {
    const r = paint({
      area: 40,
      openings: 4,
      layers: 2,
      consumption: 0.1,
      canVolume: 2.5,
      reservePct: 0,
    });
    expect(r.net).toBe(36);
    expect(r.liters).toBe(7.2);
    expect(r.cans).toBe(3);
  });
  it("never goes negative", () => {
    expect(
      paint({ area: 2, openings: 5, layers: 2, consumption: 0.1, canVolume: 1, reservePct: 10 })
        .cans,
    ).toBe(0);
  });
});

describe("tile", () => {
  it("counts tiles with reserve and boxes", () => {
    const r = tile({ area: 6, tileW: 30, tileH: 60, perBox: 8, reservePct: 10 });
    expect(r.tileArea).toBe(0.18);
    expect(r.tiles).toBe(37); // 6.6 / 0.18 = 36.67
    expect(r.boxes).toBe(5);
  });
});

describe("laminate", () => {
  it("rounds packs up from area with reserve", () => {
    expect(laminate({ area: 18, packArea: 2.2, reservePct: 5 }).packs).toBe(9); // 18.9 / 2.2 = 8.59
  });
  it("exact fit does not add an extra pack", () => {
    expect(laminate({ area: 4.4, packArea: 2.2, reservePct: 0 }).packs).toBe(2);
  });
});

describe("blocks", () => {
  it("computes wall area, volume and block count", () => {
    const r = blocks({
      length: 40,
      height: 3,
      openings: 12,
      blockL: 625,
      blockH: 250,
      blockT: 300,
      reservePct: 0,
    });
    expect(r.wallArea).toBe(108);
    expect(r.volume).toBe(32.4);
    expect(r.count).toBe(692); // 108 / 0.15625 = 691.2
  });
});

describe("concrete", () => {
  it("strip foundation volume with reserve", () => {
    const r = concrete({ shape: "strip", length: 50, width: 0.4, thickness: 1, reservePct: 5 });
    expect(r.base).toBe(20);
    expect(r.volume).toBe(21);
  });
});

describe("insulation", () => {
  it("rounds layers up to plate thickness", () => {
    const r = insulation({
      area: 100,
      thickness: 150,
      plateThickness: 100,
      packArea: 3,
      reservePct: 0,
    });
    expect(r.layers).toBe(2);
    expect(r.packs).toBe(67); // 200 / 3
  });
});
