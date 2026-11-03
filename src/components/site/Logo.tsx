import { SITE } from "@/data/site";

/** Brand mark: a gable drawn as a single line over a plan grid, with a key bit as the door. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="3" className="fill-graphite" />
      <path
        d="M8 19 20 9l12 10"
        className="stroke-primary"
        strokeWidth="2.6"
        strokeLinecap="square"
      />
      <path d="M11 18v13h18V18" className="stroke-graphite-foreground" strokeWidth="2" />
      <circle cx="20" cy="22.5" r="2.6" className="stroke-graphite-foreground" strokeWidth="1.8" />
      <path d="M20 25v6M20 28h2.6" className="stroke-graphite-foreground" strokeWidth="1.8" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          ДомКлюч<span className="text-primary">Про</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.22em] text-muted-foreground">
          {SITE.latin}
        </span>
      </span>
    </span>
  );
}
