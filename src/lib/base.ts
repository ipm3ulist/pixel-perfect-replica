/**
 * Базовый путь сайта. На GitHub Pages сайт живёт в подпапке репозитория
 * (например, /pixel-perfect-replica/), в Lovable — в корне. Значение задаёт Vite (`base`).
 */
export const BASE_PATH: string = (import.meta.env?.BASE_URL ?? "/").replace(/\/?$/, "/");

/**
 * Путь страницы с базовым путём и слэшем в конце (как требует статическая
 * публикация: /kvartiry/ → kvartiry/index.html). Файлы (.xml, .jpg) и якоря не трогает.
 */
export function sitePath(path: string): string {
  const [p = "/", hash] = path.split("#");
  const clean = p.replace(/^\/+/, "");
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const slashed = clean === "" || isFile || clean.endsWith("/") ? clean : `${clean}/`;
  return `${BASE_PATH}${slashed}${hash ? `#${hash}` : ""}`;
}

/** Путь к файлу из public/ с учётом базового пути. */
export const assetPath = (file: string) => `${BASE_PATH}${file.replace(/^\/+/, "")}`;
