import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs = [],
  aside,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-stone/50">
      <div className="container-page grid gap-8 py-12 md:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Breadcrumbs crumbs={crumbs} />
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="max-w-3xl text-[2.1rem] break-words sm:text-4xl md:text-5xl">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{lead}</p>}
        </div>
        {aside}
      </div>
    </section>
  );
}
