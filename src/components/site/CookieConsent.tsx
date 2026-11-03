import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { onConsentChange, onOpenCookieSettings, readConsent, saveConsent } from "@/lib/consent";

const btn = "rounded px-4 py-2.5 text-sm font-semibold transition-colors";
const primary = `${btn} bg-primary text-primary-foreground hover:bg-primary/90`;
const ghost = `${btn} border border-border bg-card hover:border-primary`;

/** Баннер согласия, окно настроек и запуск аналитики после согласия. Монтируется в __root. */
export function CookieConsent() {
  const [banner, setBanner] = useState(false);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });

  useEffect(() => {
    const c = readConsent();
    setBanner(!c);
    setAnalytics(!!c?.analytics);
    setMarketing(!!c?.marketing);
    initAnalytics();
    const off1 = onConsentChange(() => initAnalytics());
    const off2 = onOpenCookieSettings(() => {
      const cur = readConsent();
      setAnalytics(!!cur?.analytics);
      setMarketing(!!cur?.marketing);
      setOpen(true);
    });
    return () => {
      off1();
      off2();
    };
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setBanner(false);
    setOpen(false);
  };

  return (
    <>
      {banner && (
        <div
          role="region"
          aria-label="Согласие на cookies"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-lg print:hidden"
        >
          <div className="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm">
              Сайт использует необходимые cookies для работы и сохранения ваших настроек. С вашего
              согласия мы также подключим аналитику, чтобы понимать, какие материалы полезны.{" "}
              <Link to="/dokumenty/$slug" params={{ slug: "politika-cookies" }} className="underline">
                Подробнее
              </Link>
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={primary} onClick={() => decide(true, true)}>
                Принять все
              </button>
              <button type="button" className={ghost} onClick={() => decide(false, false)}>
                Только необходимые
              </button>
              <button type="button" className={ghost} onClick={() => setOpen(true)}>
                Настроить
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogTitle className="font-display text-xl">Настройки cookies</DialogTitle>
          <DialogDescription>
            Выберите, какие категории разрешить. Изменить выбор можно в любой момент по ссылке в
            подвале сайта.
          </DialogDescription>
          <div className="mt-2 divide-y divide-border border-y border-border">
            <Row title="Необходимые" text="Работа сайта, ваш выбор по cookies, сохранённые настройки." checked disabled />
            <Row
              title="Аналитические"
              text="Яндекс Метрика и Google Analytics 4 — обезличенная статистика посещений."
              checked={analytics}
              onChange={setAnalytics}
            />
            <Row
              title="Рекламные и маркетинговые"
              text="Сейчас не используются. Будут включаться только с вашего согласия."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <button type="button" className={ghost} onClick={() => decide(false, false)}>
              Только необходимые
            </button>
            <button type="button" className={primary} onClick={() => decide(analytics, marketing)}>
              Сохранить выбор
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({
  title,
  text,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-4">
      <span>
        <span className="block font-semibold">
          {title}
          {disabled && <span className="ml-2 text-xs text-muted-foreground">всегда включены</span>}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
      </span>
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
