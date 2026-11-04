import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Стрелка «Назад» под шапкой: ведёт на предыдущую страницу этого же сайта. */
export function BackLink() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [canGoBack, setCanGoBack] = useState(false);
  const firstPath = useRef(pathname);
  const movedInSite = useRef(false);

  useEffect(() => {
    // Переход внутри сайта или загрузка со страницы этого же сайта — есть куда возвращаться.
    if (pathname !== firstPath.current) movedInSite.current = true;
    setCanGoBack(movedInSite.current || isSameOrigin(document.referrer));
  }, [pathname]);

  if (!canGoBack) return null;

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else router.navigate({ to: "/" });
  };

  const cls =
    "-ml-2.5 inline-flex items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-semibold text-header-foreground transition-colors hover:bg-header-foreground/10 hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright";

  return (
    <nav aria-label="Возврат на предыдущую страницу" className="border-b border-header-line bg-header">
      <div className="container-page">
        <button type="button" onClick={goBack} className={cls}>
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          Назад
        </button>
      </div>
    </nav>
  );
}

function isSameOrigin(referrer: string) {
  if (!referrer) return false;
  try {
    return new URL(referrer, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}
