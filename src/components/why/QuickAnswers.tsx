export default function QuickAnswers({ sections }: { sections: any[] }) {
  const qaSections = sections.filter((s) => Array.isArray(s?.qa) && s.qa.length);
  if (!qaSections.length) return null;

  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-xl font-semibold">Quick answers</h2>
      <div className="mt-5 space-y-6">
        {qaSections.map((s, idx) => (
          <div key={idx}>
            {s.title ? <div className="text-sm font-semibold">{s.title}</div> : null}
            <div className="mt-3 space-y-3">
              {s.qa.map((q: any, i: number) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">{q.q}</div>
                  <div className="mt-2 text-sm text-neutral-700">{q.a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}