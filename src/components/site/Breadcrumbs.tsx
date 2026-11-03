import { Link } from "@tanstack/react-router";
import type { Crumb } from "@/lib/seo";
import { HrefLink } from "./HrefLink";

export function Breadcrumbs({
  crumbs,
  className = "mb-6",
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Навигационная цепочка"
      className={`${className} text-xs leading-6 text-muted-foreground`}
    >
      <ol className="flex flex-wrap">
        <li>
          <Link to="/" className="hover:text-foreground">
            Главная
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.to}>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {c.label}
              </span>
            ) : (
              <HrefLink href={c.to} className="hover:text-foreground">
                {c.label}
              </HrefLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
