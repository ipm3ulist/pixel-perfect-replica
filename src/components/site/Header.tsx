import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DIRECTIONS, categoriesOf, urlFor, type DirectionId } from "@/content";
import { IMAGES } from "@/content/images";
import { MAIN_NAV, SERVICE_NAV } from "@/data/site";
import { HrefLink } from "./HrefLink";
import { Logo } from "./Logo";

const linkCls =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:shadow-[inset_0_-2px_0_var(--color-primary)] py-6";

const DIRS: DirectionId[] = ["kvartiry", "doma"];
const OTHER_MAIN = MAIN_NAV.filter((n) => n.to !== "/kvartiry" && n.to !== "/doma");

function MegaPanel({ d, onNavigate }: { d: DirectionId; onNavigate: () => void }) {
  const img = d === "kvartiry" ? IMAGES.apartment : IMAGES.house;
  return (
    <div className="container-page grid gap-10 py-8 lg:grid-cols-[1fr_18rem]">
      <div>
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <p className="font-display text-2xl font-bold">{DIRECTIONS[d].title}</p>
          <Link
            to={`/${d}`}
            onClick={onNavigate}
            className="text-sm font-semibold text-accent-foreground hover:underline"
          >
            Обзор направления →
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-8 xl:grid-cols-3">
          {categoriesOf(d).map((c) => (
            <li key={c.id}>
              <HrefLink
                href={urlFor(c)!}
                onClick={onNavigate}
                className="block py-2.5 hover:text-primary"
              >
                <span className="block text-[0.95rem] font-semibold">{c.title}</span>
                <span className="line-clamp-1 block text-xs text-muted-foreground">
                  {c.subcategories.map((s) => s.title).join(", ")}
                </span>
              </HrefLink>
            </li>
          ))}
        </ul>
      </div>
      <figure className="hidden lg:block">
        <img
          src={img.src}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full rounded-sm object-cover"
        />
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {DIRECTIONS[d].description}
        </figcaption>
      </figure>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<DirectionId | null>(null);
  const pathname = useLocation({ select: (l) => l.pathname });
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMega(null);
    };
    const onScroll = () => setMega(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const hoverOpen = (d: DirectionId) => {
    clearTimeout(timer.current);
    setMega(d);
  };
  const hoverClose = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMega(null), 150);
  };

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
      onMouseLeave={hoverClose}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link to="/" aria-label="ДомКлючПро — на главную">
          <Logo />
        </Link>
        <nav aria-label="Основные разделы" className="hidden items-center gap-3 xl:flex 2xl:gap-6">
          {DIRS.map((d) => (
            <div key={d} className="flex items-center" onMouseEnter={() => hoverOpen(d)}>
              <Link to={`/${d}`} className={linkCls}>
                {DIRECTIONS[d].title}
              </Link>
              <button
                type="button"
                aria-expanded={mega === d}
                aria-controls={`mega-${d}`}
                aria-label={`Категории: ${DIRECTIONS[d].title}`}
                onClick={() => setMega((m) => (m === d ? null : d))}
                className="ml-0.5 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mega === d ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          ))}
          {OTHER_MAIN.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} onMouseEnter={hoverClose}>
              {n.label}
            </Link>
          ))}
          <span className="h-5 w-px bg-border" />
          {SERVICE_NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} onMouseEnter={hoverClose}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            to="/poisk"
            aria-label="Поиск"
            className="rounded p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="rounded p-2.5 text-foreground hover:bg-secondary xl:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mega && (
        <div
          id={`mega-${mega}`}
          onMouseEnter={() => hoverOpen(mega)}
          className="absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-[0_24px_48px_-24px_color-mix(in_oklab,var(--foreground)_25%,transparent)] lg:block"
        >
          <MegaPanel d={mega} onNavigate={() => setMega(null)} />
        </div>
      )}

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Мобильное меню"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-background xl:hidden"
        >
          <div className="container-page grid gap-8 py-6">
            <form role="search" action="/poisk">
              <label htmlFor="m-q" className="sr-only">
                Поиск по сайту
              </label>
              <input
                id="m-q"
                name="q"
                placeholder="Поиск по сайту"
                className="h-12 w-full rounded-sm border border-input bg-card px-4 text-base outline-none focus:border-primary"
              />
            </form>
            <div className="divide-y divide-border border-y border-border">
              {DIRS.map((d) => (
                <details key={d} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold">
                    {DIRECTIONS[d].title}
                    <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="pb-4">
                    <li>
                      <Link
                        to={`/${d}`}
                        className="block py-2 pl-3 font-semibold text-accent-foreground"
                      >
                        Обзор направления
                      </Link>
                    </li>
                    {categoriesOf(d).map((c) => (
                      <li key={c.id}>
                        <HrefLink
                          href={urlFor(c)!}
                          className="block border-l border-border py-2 pl-3 text-[0.95rem] text-muted-foreground hover:text-foreground"
                        >
                          {c.title}
                        </HrefLink>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">Разделы</p>
                <ul className="space-y-1">
                  {OTHER_MAIN.map((n) => (
                    <li key={n.to}>
                      <Link
                        to={n.to}
                        className="block border-l-2 border-transparent py-2.5 pl-3 text-lg font-semibold data-[status=active]:border-primary data-[status=active]:text-primary"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3">Сервисы</p>
                <ul className="space-y-1">
                  {[...SERVICE_NAV, { to: "/o-proekte" as const, label: "О проекте" }].map((n) => (
                    <li key={n.to}>
                      <Link
                        to={n.to}
                        className="block border-l-2 border-transparent py-2.5 pl-3 text-lg font-semibold data-[status=active]:border-primary data-[status=active]:text-primary"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
