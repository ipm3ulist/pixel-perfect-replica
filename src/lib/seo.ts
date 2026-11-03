import { SITE } from "@/data/site";

export type Crumb = { to: string; label: string };

type HeadInput = {
  title: string;
  description: string;
  /** Путь страницы, например "/kvartiry/steny". Используется для canonical и og:url. */
  path: string;
  type?: "website" | "article";
  crumbs?: Crumb[];
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
};

const withSite = (t: string) => (t.includes(SITE.name) ? t : `${t} — ${SITE.name}`);

/**
 * Единый head() для всех страниц: title, description, Open Graph, Twitter,
 * canonical (относительный — домен ещё не назначен) и Schema.org.
 * og:image не задаётся: изображения сайта — локальные ассеты без абсолютного URL.
 */
export function pageHead({
  title,
  description,
  path,
  type = "website",
  crumbs,
  jsonLd = [],
  noindex,
}: HeadInput) {
  const full = withSite(title);
  const scripts = [...jsonLd];
  if (crumbs?.length) scripts.push(breadcrumbLd(crumbs));
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: scripts.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  };
}

export function breadcrumbLd(crumbs: Crumb[]) {
  const all = [{ to: "/", label: "Главная" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.to,
    })),
  };
}

export function articleLd(a: {
  title: string;
  description: string;
  path: string;
  updatedAt?: string | undefined;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: a.path,
    inLanguage: "ru",
    ...(a.updatedAt ? { dateModified: a.updatedAt } : {}),
    publisher: { "@type": "Organization", name: SITE.name },
  };
}
