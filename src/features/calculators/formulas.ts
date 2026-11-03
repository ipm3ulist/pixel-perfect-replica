/**
 * Чистые формулы калькуляторов. Никаких норм расхода здесь нет: расход,
 * размеры упаковок и материалов вводит пользователь по данным производителя.
 * Все функции возвращают промежуточные значения, чтобы расчёт можно было проверить.
 */

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
/** Округление вверх с защитой от погрешности float (2.0000000001 → 2). */
const ceil = (n: number) => Math.ceil(round(n, 6));

export type PaintInput = {
  area: number; // м² окрашиваемой поверхности (без проёмов)
  openings: number; // м² проёмов, которые нужно вычесть
  layers: number;
  consumption: number; // л/м² на один слой — с этикетки
  canVolume: number; // л
  reservePct: number;
};
export function paint(i: PaintInput) {
  const net = Math.max(0, pos(i.area) - pos(i.openings));
  const liters =
    net *
    Math.max(1, Math.round(pos(i.layers))) *
    pos(i.consumption) *
    (1 + pos(i.reservePct) / 100);
  const cans = i.canVolume > 0 ? ceil(liters / i.canVolume) : 0;
  return { net: round(net), liters: round(liters), cans };
}

export type TileInput = {
  area: number; // м²
  tileW: number; // см
  tileH: number; // см
  perBox: number; // шт в упаковке, 0 — не считать
  reservePct: number;
};
export function tile(i: TileInput) {
  const tileArea = (pos(i.tileW) / 100) * (pos(i.tileH) / 100);
  const tiles = tileArea > 0 ? ceil((pos(i.area) * (1 + pos(i.reservePct) / 100)) / tileArea) : 0;
  const boxes = i.perBox > 0 ? ceil(tiles / i.perBox) : 0;
  return { tileArea: round(tileArea, 4), tiles, boxes };
}

export type LaminateInput = { area: number; packArea: number; reservePct: number };
export function laminate(i: LaminateInput) {
  const need = pos(i.area) * (1 + pos(i.reservePct) / 100);
  const packs = i.packArea > 0 ? ceil(need / i.packArea) : 0;
  return { need: round(need), packs, bought: round(packs * pos(i.packArea)) };
}

export type BlocksInput = {
  length: number; // м, суммарная длина стен
  height: number; // м
  openings: number; // м²
  blockL: number; // мм
  blockH: number; // мм
  blockT: number; // мм — толщина стены = толщина блока
  reservePct: number;
};
export function blocks(i: BlocksInput) {
  const wallArea = Math.max(0, pos(i.length) * pos(i.height) - pos(i.openings));
  const face = (pos(i.blockL) / 1000) * (pos(i.blockH) / 1000);
  const volume = wallArea * (pos(i.blockT) / 1000);
  const count = face > 0 ? ceil((wallArea / face) * (1 + pos(i.reservePct) / 100)) : 0;
  return { wallArea: round(wallArea), volume: round(volume, 3), count };
}

export type ConcreteInput =
  | { shape: "slab"; length: number; width: number; thickness: number; reservePct: number }
  | { shape: "strip"; length: number; width: number; thickness: number; reservePct: number };
/** Для плиты length×width — размеры плиты; для ленты length — суммарная длина ленты, width — ширина ленты, thickness — высота. */
export function concrete(i: ConcreteInput) {
  const base = pos(i.length) * pos(i.width) * pos(i.thickness);
  const volume = base * (1 + pos(i.reservePct) / 100);
  return { base: round(base, 3), volume: round(volume, 2) };
}

export type InsulationInput = {
  area: number; // м²
  thickness: number; // мм, требуемая общая толщина
  plateThickness: number; // мм, толщина одной плиты
  packArea: number; // м² в упаковке
  reservePct: number;
};
export function insulation(i: InsulationInput) {
  const layers = i.plateThickness > 0 ? ceil(pos(i.thickness) / i.plateThickness) : 0;
  const need = pos(i.area) * layers * (1 + pos(i.reservePct) / 100);
  const packs = i.packArea > 0 ? ceil(need / i.packArea) : 0;
  const volume = (pos(i.area) * layers * pos(i.plateThickness)) / 1000;
  return { layers, need: round(need), packs, volume: round(volume, 3) };
}
