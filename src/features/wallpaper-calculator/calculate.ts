/**
 * Wallpaper roll estimate. Pure functions, no UI.
 * All lengths in metres unless stated otherwise; pattern repeat in centimetres.
 *
 * Model (preliminary estimate, not a cutting plan):
 * 1. Strip length = wall height + trim allowance, rounded up to a whole number
 *    of pattern repeats when a repeat is set (every strip must start at the
 *    same point of the pattern).
 * 2. Strips per roll = floor(roll length / strip length) — leftovers shorter
 *    than a strip are treated as waste.
 * 3. Strips needed = ceil(wall length / roll width) per wall (or per perimeter
 *    for a rectangular room).
 * 4. Openings save only whole strips: floor(opening width / roll width) strips
 *    per opening, weighted by opening height / wall height, rounded down.
 *    Narrow openings save nothing, because pieces above and below are still needed.
 * 5. Rolls = strips / strips per roll, plus reserve %, rounded up.
 */

export type Wall = { length: number; height: number };
export type Opening = { width: number; height: number; count: number };

export type WallpaperInput = {
  mode: "room" | "walls";
  /** room mode */
  roomLength?: number;
  roomWidth?: number;
  wallHeight?: number;
  /** walls mode */
  walls?: Wall[];
  roomsCount: number;
  deductOpenings: boolean;
  openings: Opening[];
  rollWidth: number;
  rollLength: number;
  /** cm, 0 = no pattern matching */
  patternRepeatCm: number;
  reservePercent: number;
  /** trim allowance per strip, m (top + bottom) */
  trimAllowance?: number;
};

export type FieldError = { field: string; message: string };

export type WallpaperResult = {
  ok: true;
  rolls: number;
  rollsWithoutReserve: number;
  wallArea: number;
  openingsArea: number;
  netArea: number;
  totalWallLength: number;
  stripLength: number;
  maxStripLength: number;
  stripsGross: number;
  stripsSaved: number;
  strips: number;
  stripsPerRoll: number;
  reservePercent: number;
  rawRolls: number;
  warnings: string[];
};

export type WallpaperFailure = { ok: false; errors: FieldError[] };

export const DEFAULT_TRIM = 0.1;
const MAX_DIM = 100;

const isPos = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

export function stripLengthFor(height: number, repeatCm: number, trim = DEFAULT_TRIM): number {
  const base = height + trim;
  if (repeatCm <= 0) return round(base, 3);
  const r = repeatCm / 100;
  return round(Math.ceil(round(base / r, 6)) * r, 3);
}

export function validate(input: WallpaperInput): FieldError[] {
  const e: FieldError[] = [];
  const dim = (field: string, v: unknown, label: string) => {
    if (!isPos(v)) e.push({ field, message: `${label}: укажите положительное число` });
    else if (v > MAX_DIM) e.push({ field, message: `${label}: не больше ${MAX_DIM} м` });
  };
  if (input.mode === "room") {
    dim("roomLength", input.roomLength, "Длина");
    dim("roomWidth", input.roomWidth, "Ширина");
    dim("wallHeight", input.wallHeight, "Высота стен");
    if (isPos(input.wallHeight) && input.wallHeight > 10)
      e.push({ field: "wallHeight", message: "Высота стен: не больше 10 м" });
  } else {
    if (!input.walls || input.walls.length === 0)
      e.push({ field: "walls", message: "Добавьте хотя бы одну стену" });
    input.walls?.forEach((w, i) => {
      dim(`walls.${i}.length`, w.length, `Стена ${i + 1}, длина`);
      dim(`walls.${i}.height`, w.height, `Стена ${i + 1}, высота`);
    });
  }
  if (!Number.isInteger(input.roomsCount) || input.roomsCount < 1 || input.roomsCount > 50)
    e.push({ field: "roomsCount", message: "Количество помещений: целое число от 1 до 50" });
  if (!isPos(input.rollWidth) || input.rollWidth > 3)
    e.push({ field: "rollWidth", message: "Ширина рулона: от 0,01 до 3 м" });
  if (!isPos(input.rollLength) || input.rollLength > 100)
    e.push({ field: "rollLength", message: "Длина рулона: от 0,01 до 100 м" });
  if (
    !Number.isFinite(input.patternRepeatCm) ||
    input.patternRepeatCm < 0 ||
    input.patternRepeatCm > 200
  )
    e.push({ field: "patternRepeatCm", message: "Раппорт: от 0 до 200 см" });
  if (
    !Number.isFinite(input.reservePercent) ||
    input.reservePercent < 0 ||
    input.reservePercent > 50
  )
    e.push({ field: "reservePercent", message: "Запас: от 0 до 50 %" });
  if (input.deductOpenings) {
    input.openings.forEach((o, i) => {
      if (!isPos(o.width) || !isPos(o.height))
        e.push({ field: `openings.${i}`, message: `Проём ${i + 1}: укажите ширину и высоту` });
      if (!Number.isInteger(o.count) || o.count < 1 || o.count > 50)
        e.push({ field: `openings.${i}`, message: `Проём ${i + 1}: количество от 1 до 50` });
    });
  }
  return e;
}

export function calculateWallpaper(input: WallpaperInput): WallpaperResult | WallpaperFailure {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const trim = input.trimAllowance ?? DEFAULT_TRIM;
  const rooms = input.roomsCount;
  const warnings: string[] = [];

  const walls: Wall[] =
    input.mode === "room"
      ? [{ length: 2 * (input.roomLength! + input.roomWidth!), height: input.wallHeight! }]
      : input.walls!;

  const refHeight = Math.max(...walls.map((w) => w.height));
  const maxStripLength = stripLengthFor(refHeight, input.patternRepeatCm, trim);

  if (maxStripLength > input.rollLength) {
    return {
      ok: false,
      errors: [
        {
          field: "rollLength",
          message: `Длина полотна (${fmt(maxStripLength)} м с учётом подрезки и раппорта) больше длины рулона. Выберите более длинный рулон.`,
        },
      ],
    };
  }

  let stripsGross = 0;
  let rawRolls = 0;
  let wallArea = 0;
  let totalWallLength = 0;
  for (const w of walls) {
    const s = Math.ceil(round(w.length / input.rollWidth, 6));
    const len = stripLengthFor(w.height, input.patternRepeatCm, trim);
    const perRoll = Math.floor(round(input.rollLength / len, 6));
    stripsGross += s;
    rawRolls += s / perRoll;
    wallArea += w.length * w.height;
    totalWallLength += w.length;
    if (w.length < input.rollWidth)
      warnings.push(
        `Стена длиной ${fmt(w.length)} м уже ширины рулона — на неё уйдёт целое полотно.`,
      );
  }

  let openingsArea = 0;
  let savedRaw = 0;
  if (input.deductOpenings) {
    for (const o of input.openings) {
      openingsArea += o.width * o.height * o.count;
      const fullStrips = Math.floor(round(o.width / input.rollWidth, 6));
      savedRaw += fullStrips * o.count * Math.min(1, o.height / refHeight);
    }
  }
  if (openingsArea > wallArea) {
    return {
      ok: false,
      errors: [{ field: "openings", message: "Площадь проёмов больше площади стен" }],
    };
  }

  const stripsPerRoom = stripsGross;
  const stripsSavedPerRoom = Math.min(Math.floor(round(savedRaw, 6)), stripsPerRoom);
  const stripLength = maxStripLength;
  const stripsPerRoll = Math.floor(round(input.rollLength / maxStripLength, 6));

  // convert saved strips to rolls using the reference (tallest) strip
  const rawRollsPerRoom = rawRolls - stripsSavedPerRoom / stripsPerRoll;
  const totalRaw = rawRollsPerRoom * rooms;
  const rollsWithoutReserve = Math.ceil(round(totalRaw, 6));
  const rolls = Math.ceil(round(totalRaw * (1 + input.reservePercent / 100), 6));

  if (input.patternRepeatCm > 0 && input.patternRepeatCm / 100 > refHeight)
    warnings.push("Раппорт больше высоты стены — расход заметно вырастет, проверьте параметры.");
  if (input.mode === "walls" && new Set(walls.map((w) => w.height)).size > 1)
    warnings.push(
      "Высота стен разная: число полотен с рулона рассчитано отдельно для каждой стены.",
    );

  return {
    ok: true,
    rolls,
    rollsWithoutReserve,
    wallArea: round(wallArea * rooms, 2),
    openingsArea: round(openingsArea * rooms, 2),
    netArea: round((wallArea - openingsArea) * rooms, 2),
    totalWallLength: round(totalWallLength * rooms, 2),
    stripLength,
    maxStripLength,
    stripsGross: stripsPerRoom * rooms,
    stripsSaved: stripsSavedPerRoom * rooms,
    strips: (stripsPerRoom - stripsSavedPerRoom) * rooms,
    stripsPerRoll,
    reservePercent: input.reservePercent,
    rawRolls: round(totalRaw, 3),
    warnings,
  };
}

export function round(n: number, d: number) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

export function fmt(n: number, d = 2) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: d });
}
