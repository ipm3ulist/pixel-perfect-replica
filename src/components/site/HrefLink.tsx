import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

/**
 * Ссылка по готовому пути из `urlFor()`. Пути строятся централизованно и
 * проверяются тестом маршрутов, поэтому здесь типизация `to` ослаблена.
 * Якорь (#slug) передаётся отдельно через hash.
 */
export function HrefLink({
  href,
  ...rest
}: { href: string } & Omit<ComponentProps<typeof Link>, "to" | "hash">) {
  const [path, hash] = href.split("#");
  return <Link {...rest} to={path as never} {...(hash ? { hash } : {})} />;
}
