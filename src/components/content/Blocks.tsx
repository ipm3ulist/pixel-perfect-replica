import { Info, TriangleAlert } from "lucide-react";
import type { Block } from "@/content";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-dk">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-28">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-28">
                {b.text}
              </h3>
            );
          case "list":
            return b.ordered ? (
              <ol key={i}>
                {b.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className={`not-prose my-6 flex gap-3 rounded border p-5 text-[0.95rem] ${b.tone === "warning" ? "border-warning/40 bg-warning-surface" : "border-border bg-stone"}`}
              >
                {b.tone === "warning" ? (
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                ) : (
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                )}
                <p className="m-0">{b.text}</p>
              </aside>
            );
          case "table":
            return (
              <div
                key={i}
                role="region"
                aria-label="Таблица: прокручиваемое содержимое"
                tabIndex={0}
                className="my-6 overflow-x-auto border-y border-border focus-visible:outline-2 focus-visible:outline-primary"
              >
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="py-3 pr-4 font-display font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-b border-border last:border-0 align-top">
                        {r.map((c, k) => (
                          <td
                            key={k}
                            className={`py-3 pr-4 ${k === 0 ? "font-medium" : "text-muted-foreground"}`}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <figure key={i} className="my-8">
                <img
                  src={b.image.src}
                  alt={b.image.alt}
                  loading="lazy"
                  className="w-full rounded-sm"
                />
                {b.caption && (
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
