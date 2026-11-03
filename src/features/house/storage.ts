import { normalizeConfig, type HouseConfig } from "./model";

/** Локальное сохранение только параметров дома — никаких контактов и данных устройства. */
const KEY = "dk.house-config.v1";

export function loadConfig(): HouseConfig | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalizeConfig(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveConfig(c: HouseConfig) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
    return true;
  } catch {
    return false;
  }
}

export function clearConfig() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* хранилище недоступно */
  }
}
