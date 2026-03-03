export default function VerifyTeaser({
  title,
  paragraphs,
  bullets,
}: {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
}) {
  return (
    <section className="rounded-2xl border p-6">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
      {paragraphs?.length ? (
        <div className="mt-3 space-y-2 text-neutral-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
      {bullets?.length ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
