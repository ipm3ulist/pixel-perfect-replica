import { track } from "@/lib/analytics";
import { DEMO_STORE, STORES } from "../data/stores";
import { displayPrice } from "../select";
import type { Placement, Product } from "../types";
import { AdLabel, DemoLabel } from "./AdLabel";

export function ProductCard({ p, placement }: { p: Product; placement: Placement }) {
  const store = p.demo ? DEMO_STORE : STORES.find((s) => s.id === p.storeId);
  const price = displayPrice(p);
  return (
    <article className="flex flex-col border border-border bg-card p-5">
      {p.demo ? (
        <DemoLabel />
      ) : (
        <AdLabel advertiser={store?.advertiserLegal ?? store?.name} erid={p.erid} />
      )}
      {p.image && (
        <img
          src={p.image.src}
          alt={p.image.alt}
          loading="lazy"
          className="mt-4 aspect-[4/3] w-full object-cover"
        />
      )}
      <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
      <div className="mt-auto pt-4">
        {price && (
          <p className="text-sm">
            <span className="font-semibold tabular-nums">
              {price.amount.toLocaleString("ru-RU")} ₽
            </span>
            {price.unit && ` / ${price.unit}`}
            <span className="block text-xs text-muted-foreground">
              по данным {price.source} на {price.checkedAt}
            </span>
          </p>
        )}
        {p.demo ? (
          <span className="mt-3 inline-block text-sm text-muted-foreground">
            Ссылка появится после подключения магазина
          </span>
        ) : (
          <a
            href={p.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() =>
              track("store_clicked", {
                store_id: p.storeId,
                product_id: p.id,
                section: p.section,
                placement,
              })
            }
            className="mt-3 inline-block font-semibold text-accent-foreground underline underline-offset-4"
          >
            Смотреть в магазине {store?.name}
          </a>
        )}
      </div>
    </article>
  );
}

export function ProductList({ items, placement }: { items: Product[]; placement: Placement }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} placement={placement} />
      ))}
    </div>
  );
}
