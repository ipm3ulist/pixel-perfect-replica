import { EXTRA_ROOMS } from "./extra";
import { MAIN_ROOMS } from "./main";
import type { Room } from "./types";

export type { Room } from "./types";

export const ROOMS: Room[] = [...MAIN_ROOMS, ...EXTRA_ROOMS];
export const ROOMS_PATH = "/kvartiry/pomeshcheniya";
export const roomUrl = (slug: string) => `${ROOMS_PATH}/${slug}`;
export const getRoom = (slug: string) => ROOMS.find((r) => r.slug === slug);
