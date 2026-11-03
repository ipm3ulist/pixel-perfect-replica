import { ArrowUpRight } from "lucide-react";
import { HrefLink } from "@/components/site/HrefLink";
import { urlFor, type Content } from "@/content";

export const KIND_LABEL: Record<Content["kind"], string> = {
  article: "Статья",
  guide: "Инструкция",
  material: "Материал",
  term: "Термин",
  calculator: "Калькулятор",
};

const textOf = (c: Content) => (c.kind === "term" ? c.definition : c.description);

/** Редакционный список: строки с разделителями, без «стены карточек». */
export function ContentRows({ items, numbered }: { items: Content[]; numbered?: boolean }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((c, i) => {
        const href = urlFor(c);
        if (!href) return null;
        return (
          <li key={c.id}>
            <HrefLink
              href={href}
              className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline"
            >
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                {numbered ? String(i + 1).padStart(2, "0") + " · " : ""}
                {KIND_LABEL[c.kind]}
              </span>
              <span>
                <span className="block font-display text-lg font-bold group-hover:text-primary">
                  {c.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{textOf(c)}</span>
              </span>
              <ArrowUpRight className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:block" />
            </HrefLink>
          </li>
        );
      })}
    </ul>
  );
}

/** Карточка с фотографией — для избранных материалов. */
export function FeatureCard({ c, large }: { c: Content; large?: boolean }) {
  const href = urlFor(c);
  if (!href || c.kind === "term") return null;
  return (
    <HrefLink href={href} className="group block">
      {c.image && (
        <div className="overflow-hidden rounded-sm bg-stone">
          <img
            src={c.image.src}
            alt={c.image.alt}
            loading="lazy"
            className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}
          />
        </div>
      )}
      <p className="eyebrow mt-4">{KIND_LABEL[c.kind]}</p>
      <h3 className={`mt-2 group-hover:text-primary ${large ? "text-2xl md:text-3xl" : "text-xl"}`}>
        {c.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
    </HrefLink>
  );
}
