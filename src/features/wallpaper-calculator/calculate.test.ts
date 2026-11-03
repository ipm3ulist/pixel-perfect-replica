import { describe, expect, it } from "vitest";
import { calculateWallpaper, stripLengthFor, type WallpaperInput } from "./calculate";

const base: WallpaperInput = {
  mode: "room",
  roomLength: 4,
  roomWidth: 3,
  wallHeight: 2.5,
  roomsCount: 1,
  deductOpenings: false,
  openings: [],
  rollWidth: 0.53,
  rollLength: 10.05,
  patternRepeatCm: 0,
  reservePercent: 0,
};

const ok = (i: WallpaperInput) => {
  const r = calculateWallpaper(i);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r;
};

describe("wallpaper calculator", () => {
  it("standard room 4×3×2.5, roll 0.53×10.05 → 27 strips, 3 per roll, 9 rolls", () => {
    const r = ok(base);
    expect(r.strips).toBe(27);
    expect(r.stripsPerRoll).toBe(3);
    expect(r.rolls).toBe(9);
    expect(r.wallArea).toBe(35);
  });

  it("10% reserve rounds 9 up to 10 rolls", () => {
    expect(ok({ ...base, reservePercent: 10 }).rolls).toBe(10);
  });

  it("window 1.5×1.4 and door 0.8×2.0 save one strip", () => {
    const r = ok({
      ...base,
      deductOpenings: true,
      openings: [
        { width: 1.5, height: 1.4, count: 1 },
        { width: 0.8, height: 2, count: 1 },
      ],
    });
    expect(r.stripsSaved).toBe(1);
    expect(r.strips).toBe(26);
    expect(r.openingsArea).toBe(3.7);
    expect(r.rolls).toBe(9);
  });

  it("two windows 1.5×1.4 save two strips", () => {
    const r = ok({
      ...base,
      deductOpenings: true,
      openings: [{ width: 1.5, height: 1.4, count: 2 }],
    });
    expect(r.stripsSaved).toBe(2);
    expect(r.strips).toBe(25);
  });

  it("pattern repeat 53 cm reduces strips per roll from 4 to 3", () => {
    const plain = ok({ ...base, wallHeight: 2.4 });
    const pattern = ok({ ...base, wallHeight: 2.4, patternRepeatCm: 53 });
    expect(plain.stripsPerRoll).toBe(4);
    expect(plain.rolls).toBe(7);
    expect(pattern.stripLength).toBe(2.65);
    expect(pattern.stripsPerRoll).toBe(3);
    expect(pattern.rolls).toBe(9);
  });

  it("strip length rounds up to whole repeats", () => {
    expect(stripLengthFor(2.5, 0)).toBe(2.6);
    expect(stripLengthFor(2.5, 64)).toBe(3.2);
  });

  it("two identical rooms double the rolls", () => {
    expect(ok({ ...base, roomsCount: 2 }).rolls).toBe(18);
  });

  it("separate walls mode matches perimeter mode for a rectangle", () => {
    const r = ok({
      ...base,
      mode: "walls",
      walls: [
        { length: 4, height: 2.5 },
        { length: 3, height: 2.5 },
        { length: 4, height: 2.5 },
        { length: 3, height: 2.5 },
      ],
    });
    expect(r.strips).toBe(8 + 6 + 8 + 6);
    expect(r.rolls).toBe(10);
  });

  it("rejects negative and empty dimensions", () => {
    const r = calculateWallpaper({ ...base, roomLength: -1, wallHeight: Number.NaN });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.map((e) => e.field)).toEqual(["roomLength", "wallHeight"]);
  });

  it("rejects a roll shorter than one strip", () => {
    const r = calculateWallpaper({ ...base, rollLength: 2 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.field).toBe("rollLength");
  });

  it("wall narrower than roll still takes one strip and warns", () => {
    const r = ok({ ...base, mode: "walls", walls: [{ length: 0.3, height: 2.5 }] });
    expect(r.strips).toBe(1);
    expect(r.rolls).toBe(1);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});

describe("additional scenarios", () => {
  const wide = {
    mode: "room" as const,
    roomLength: 4,
    roomWidth: 3.5,
    wallHeight: 2.7,
    roomsCount: 1,
    deductOpenings: true,
    openings: [
      { width: 1.5, height: 1.5, count: 1 },
      { width: 0.9, height: 2.1, count: 1 },
    ],
    rollWidth: 1.06,
    rollLength: 10.05,
    patternRepeatCm: 0,
    reservePercent: 10,
  };

  it("room 4×3.5×2.7 with 1.06×10.05 roll: 15 strips, 3 per roll, 5 rolls, 6 with 10% reserve", () => {
    const r = calculateWallpaper(wide);
    if (!r.ok) throw new Error("expected ok");
    expect(r.stripsGross).toBe(15);
    expect(r.stripsSaved).toBe(0); // window 1.5 m saves 1 strip × 1.5/2.7 height → rounds down to 0
    expect(r.stripsPerRoll).toBe(3);
    expect(r.rollsWithoutReserve).toBe(5);
    expect(r.rolls).toBe(6);
  });

  it("smaller trim allowance changes strip length", () => {
    const r = calculateWallpaper({ ...wide, trimAllowance: 0.05 });
    if (!r.ok) throw new Error("expected ok");
    expect(r.stripLength).toBe(2.75);
  });

  it("openings ignored when deduction is off, even if left empty", () => {
    const r = calculateWallpaper({
      ...wide,
      deductOpenings: false,
      openings: [{ width: NaN, height: NaN, count: 1 }],
    });
    expect(r.ok).toBe(true);
  });

  it("openings larger than the walls are rejected", () => {
    const r = calculateWallpaper({ ...wide, openings: [{ width: 2, height: 2.5, count: 20 }] });
    expect(r.ok).toBe(false);
  });

  it("reserve above 50% is rejected", () => {
    const r = calculateWallpaper({ ...wide, reservePercent: 60 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.field).toBe("reservePercent");
  });
});
