export default function TrustStackGrid({
  title,
  paragraphs,
  cards,
}: {
  title?: string;
  paragraphs?: string[];
  cards: Array<{ title: string; summary?: string; link: string }>;
}) {
  return (
    <section>
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
      {paragraphs?.length ? (
        <div className="mt-2 space-y-2 text-neutral-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <a
            key={c.link}
            href={c.link}
            className="rounded-2xl border p-5 hover:bg-neutral-50"
          >
            <div className="text-base font-semibold">{c.title}</div>
            {c.summary ? (
              <div className="mt-2 text-sm text-neutral-700">{c.summary}</div>
            ) : null}
          </a>
        ))}
      </div>
    </section>
  );
}
