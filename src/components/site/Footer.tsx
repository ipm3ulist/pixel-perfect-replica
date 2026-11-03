import type { NavItem } from "@/data/site";
import { Link } from "@tanstack/react-router";
import { MAIN_NAV, SERVICE_NAV, SITE } from "@/data/site";
import { LogoMark } from "./Logo";
import { LEGAL_DOCS } from "@/data/legal";
import { openCookieSettings } from "@/lib/consent";

export function Footer() {
  return (
    <footer className="mt-24 bg-header text-header-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark tone="light" className="h-10 w-10" />
            <span className="font-display text-xl font-extrabold">ДомКлючПро</span>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-75">{SITE.tagline}.</p>
        </div>
        <FooterCol title="Разделы" items={MAIN_NAV} />
        <FooterCol title="Сервисы" items={SERVICE_NAV} />
        <FooterCol
          title="Проект"
          items={[
            { to: "/o-proekte", label: "О проекте" },
            { to: "/poisk", label: "Поиск по сайту" },
            { to: "/doma/konfigurator", label: "Конфигуратор дома" },
            { to: "/katalog", label: "Каталог материалов" },
            { to: "/zayavka", label: "Заявка на ремонт" },
            { to: "/reklama", label: "Реклама на сайте" },
          ]}
        />
        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.14em] uppercase opacity-60">Документы</p>
          <ul className="space-y-2 text-sm">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/dokumenty/$slug"
                  params={{ slug: d.slug }}
                  className="opacity-85 hover:text-primary hover:opacity-100"
                >
                  {d.title}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={openCookieSettings}
                className="text-left opacity-85 hover:text-primary hover:opacity-100"
              >
                Настройки cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-header-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs opacity-60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p className="max-w-xl md:text-right">{SITE.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold tracking-[0.14em] uppercase opacity-60">{title}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="opacity-85 hover:text-primary hover:opacity-100">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
