const ORDER = [
  "/why-jvto/",
  "/why-jvto/safety-leadership/",
  "/why-jvto/proof-transparency/",
  "/why-jvto/guest-voices-reviews/",
  "/why-jvto/partners-verification/",
  "/why-jvto/local-team-operations/",
  "/why-jvto/history-roots/",
];

export default function CtaRail({ currentRoute }: { currentRoute: string }) {
  const idx = ORDER.indexOf(currentRoute);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-6">
      <div>
        {prev ? (
          <a className="rounded-xl border px-4 py-2" href={prev}>
            ← Previous
          </a>
        ) : null}
      </div>
      <div>
        {next ? (
          <a className="rounded-xl bg-black px-4 py-2 text-white" href={next}>
            Next →
          </a>
        ) : null}
      </div>
    </nav>
  );
}