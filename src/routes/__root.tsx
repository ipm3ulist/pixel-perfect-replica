import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE } from "@/data/site";
import { CookieConsent } from "@/components/site/CookieConsent";

function NotFoundComponent() {
  return (
    <section className="grid-lines">
      <div className="container-page grid min-h-[60vh] content-center py-20">
        <p className="eyebrow">Ошибка 404</p>
        <h1 className="mt-3 text-5xl md:text-6xl">Такой страницы нет</h1>
        <p className="mt-5 max-w-lg text-lg text-muted-foreground">
          Возможно, адрес набран с ошибкой или страница была перенесена. Начните с главной или
          воспользуйтесь поиском.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            На главную
          </Link>
          <Link
            to="/poisk"
            className="rounded border border-border bg-card px-5 py-3 text-sm font-semibold hover:border-primary"
          >
            Поиск по сайту
          </Link>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Страница не загрузилась
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Что-то пошло не так. Попробуйте обновить страницу или вернитесь на главную.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Повторить
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ДомКлючПро — строительство, ремонт и обустройство жилья" },
      {
        name: "description",
        content:
          "Практичные материалы о квартирах, домах, строительстве, ремонте и материалах. Калькуляторы, инструкции и справочник.",
      },
      { name: "author", content: "ДомКлючПро" },
      { name: "theme-color", content: "#004D33" },
      { property: "og:site_name", content: "ДомКлючПро" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:title", content: "ДомКлючПро — строительство, ремонт и обустройство жилья" },
      {
        property: "og:description",
        content: "Практичные материалы о квартирах, домах, строительстве, ремонте и материалах.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(SITE.verification.yandex
        ? [{ name: "yandex-verification", content: SITE.verification.yandex }]
        : []),
      ...(SITE.verification.google
        ? [{ name: "google-site-verification", content: SITE.verification.google }]
        : []),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          inLanguage: "ru",
          ...(SITE.url ? { url: SITE.url } : {}),
          publisher: { "@type": "Organization", name: SITE.name },
          potentialAction: {
            "@type": "SearchAction",
            target: "/poisk?q={query}",
            "query-input": "required name=query",
          },
        }),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3"
      >
        К содержанию
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CookieConsent />
    </QueryClientProvider>
  );
}
