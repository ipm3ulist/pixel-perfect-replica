import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ContentId } from "@/content";
import { sectionsFor } from "../data/catalog";
import { productsFor } from "../select";
import type { Placement } from "../types";
import { ProductCard } from "./ProductCard";

/**
 * «Материалы для работы»: ведёт в разделы каталога, уместные для этой страницы.
 * Реальные товары подмешиваются, только если подключены партнёры.
 */
export function MaterialsForWork({
  id,
  placement,
  title = "Материалы для работы",
}: {
  id: ContentId;
  placement: Placement;
  title?: string;
}) {
  const sections = sectionsFor(id);
  if (!sections.length) return null;
  const products = sections.flatMap((s) => productsFor(s.id)).slice(0, 2);
  return (
    <aside aria-labelledby={`mfw-${id}`} className="border-t-2 border-foreground pt-5">
      <h2 id={`mfw-${id}`} className="text-lg font-semibold">
        {title}
      </h2>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {sections.map((s) => (
          <li key={s.id}>
            <Link
              to="/katalog/$section"
              params={{ section: s.id }}
              className="flex items-center justify-between gap-3 py-3 text-sm font-semibold hover:text-primary"
            >
              {s.title} <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
      {products.length > 0 && (
        <div className="mt-4 space-y-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} placement={placement} />
          ))}
        </div>
      )}
    </aside>
  );
}

/** «Что понадобится»: перечень без ссылок — из данных инструкции. */
export function WhatYouNeed({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Что понадобится</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  );
}
