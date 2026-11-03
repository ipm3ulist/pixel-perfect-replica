import { createFileRoute } from "@tanstack/react-router";
import { FeatureCard } from "@/components/content/ContentList";
import { HrefLink } from "@/components/site/HrefLink";
import { SectionPage } from "@/components/site/SectionPage";
import { MATERIALS } from "@/content/materials";
import { MATERIAL_GROUPS, urlFor, type MaterialGroup } from "@/content";
import { SECTIONS } from "@/data/sections";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/materialy/")({
  head: () =>
    pageHead({
      title: SECTIONS.materialy.metaTitle,
      description: SECTIONS.materialy.description,
      path: "/materialy",
      crumbs: [{ to: "/materialy", label: SECTIONS.materialy.title }],
    }),
  component: Page,
});

function Page() {
  const groups = Object.keys(MATERIAL_GROUPS) as MaterialGroup[];
  return (
    <>
      <SectionPage slug="materialy" />
      <section className="border-t border-border bg-stone/50" aria-labelledby="catalog">
        <div className="container-page py-16">
          <p className="eyebrow">Каталог</p>
          <h2 id="catalog" className="mt-3 text-3xl md:text-4xl">
            Материалы по назначению
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {groups.map((g) => {
              const items = MATERIALS.filter((m) => m.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <h3 className="border-b border-border pb-3 text-lg">{MATERIAL_GROUPS[g]}</h3>
                  <ul className="divide-y divide-border">
                    {items.map((m) => (
                      <li key={m.id}>
                        <HrefLink href={urlFor(m)!} className="group block py-4">
                          <span className="font-display text-lg font-bold group-hover:text-primary">
                            {m.title}
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            {m.description}
                          </span>
                        </HrefLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {MATERIALS.filter((m) => m.image)
              .slice(0, 3)
              .map((m) => (
                <FeatureCard key={m.id} c={m} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
