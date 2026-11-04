import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Mode = "none" | "back" | "home";

/** Стрелка возврата под шапкой: на предыдущую страницу сайта, а при входе с нуля — на главную. */
export function BackLink() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mode, setMode] = useState<Mode>("none");
  const firstPath = useRef(pathname);
  const movedInSite = useRef(false);

  useEffect(() => {
    if (pathname !== firstPath.current) movedInSite.current = true;
    const hasInSiteHistory = movedInSite.current || isSameOrigin(document.referrer);
    if (hasInSiteHistory) setMode("back");
    else if (pathname !== "/") setMode("home");
    else setMode("none");
  }, [pathname]);

  if (mode === "none") return null;

  const cls =
    "-ml-2.5 inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-header-foreground transition-colors hover:bg-header-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright";

  const label = mode === "back" ? "Назад" : "На главную";
  const icon = <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />;

  return (
    <nav
      aria-label={mode === "back" ? "Возврат на предыдущую страницу" : "Возврат на главную"}
      className="border-b border-header-line bg-header"
    >
      <div className="container-page">
        {mode === "back" ? (
          <button
            type="button"
            className={cls}
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else router.navigate({ to: "/" });
            }}
          >
            {icon}
            {label}
          </button>
        ) : (
          <Link to="/" className={cls}>
            {icon}
            {label}
          </Link>
        )}
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
