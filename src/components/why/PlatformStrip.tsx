export default function PlatformStrip({
  items,
}: {
  items: Array<{ platform: string; url: string }>;
}) {
  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-xl font-semibold">Independent platforms</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border p-4 hover:bg-neutral-50"
          >
            <div className="text-sm font-semibold">{p.platform}</div>
            <div className="mt-1 text-xs text-neutral-600 break-all">{p.url}</div>
          </a>
        ))}
      </div>
    </section>
  );
}