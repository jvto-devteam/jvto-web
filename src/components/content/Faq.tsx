import React from "react";

type FaqItem = { q: string; a: string };

export function Faq({
  items,
  title = "FAQ",
}: {
  items?: FaqItem[];
  title?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <details
            key={`${idx}-${it.q}`}
            className="rounded-lg border border-neutral-200 p-4"
          >
            <summary className="cursor-pointer list-none font-medium">
              {it.q}
            </summary>
            <div className="mt-3 whitespace-pre-wrap text-neutral-800">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
