import type { CategoryId, ContentId } from "@/content";
import { ADS, PARTNER_OFFERS } from "./config";
import type { AdSlotId, PartnerOffer } from "./types";

/** Подбирает действующие предложения для страницы. Без erid предложение не показывается. */
export function offersFor(
  { content, categories = [] }: { content?: ContentId; categories?: CategoryId[] },
  offers: PartnerOffer[] = PARTNER_OFFERS,
  today = new Date().toISOString().slice(0, 10),
) {
  return offers.filter(
    (o) =>
      o.erid.trim() &&
      (!o.until || o.until >= today) &&
      ((content && o.content?.includes(content)) ||
        o.categories?.some((c) => categories.includes(c))),
  );
}

/** Ненавязчивый блок «Что понадобится» с маркировкой рекламы. Ничего не рендерит без реальных предложений. */
export function PartnerBlock(props: { content?: ContentId; categories?: CategoryId[] }) {
  const offers = offersFor(props);
  if (!offers.length) return null;
  return (
    <aside aria-label="Реклама" className="rounded border border-border bg-card p-6">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Реклама
      </p>
      <ul className="mt-3 space-y-4">
        {offers.map((o) => (
          <li key={o.id}>
            <a
              href={o.url}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="font-semibold text-accent-foreground underline underline-offset-4"
            >
              {o.title}
            </a>
            {o.note && <p className="mt-1 text-sm text-muted-foreground">{o.note}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              Рекламодатель: {o.advertiser} · erid: {o.erid}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Место под рекламный блок. Пока слот выключен в config, ничего не выводит и не резервирует место. */
export function AdSlot({ id }: { id: AdSlotId }) {
  if (!ADS[id]) return null;
  return (
    <div
      data-ad-slot={id}
      aria-label="Реклама"
      className="min-h-32 rounded border border-dashed border-border"
    />
  );
}
