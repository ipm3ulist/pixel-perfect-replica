/** Единая маркировка рекламы: «Реклама · рекламодатель · erid». */
export function AdLabel({
  advertiser,
  erid,
}: {
  advertiser?: string | undefined;
  erid?: string | undefined;
}) {
  return (
    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
      Реклама{advertiser ? ` · ${advertiser}` : ""}
      {erid ? ` · erid: ${erid}` : ""}
    </p>
  );
}

export function DemoLabel() {
  return (
    <p className="inline-block rounded-sm border border-dashed border-primary px-2 py-0.5 text-[11px] font-semibold text-primary uppercase">
      Демонстрационный пример — не предложение
    </p>
  );
}
