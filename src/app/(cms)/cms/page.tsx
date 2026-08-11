// app/cms/page.tsx
export default function CmsDashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">
          Overview
        </h2>
        <p className="text-sm text-slate-400">
          Ringkasan cepat konten yang kamu kelola dari CMS.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <div className="text-[10px] uppercase text-slate-500">FAQ</div>
          <div className="mt-1 text-2xl font-semibold text-slate-50">24</div>
          <div className="text-[10px] text-emerald-400">
            +3 updated this week
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <div className="text-[10px] uppercase text-slate-500">Posts</div>
          <div className="mt-1 text-2xl font-semibold text-slate-50">58</div>
          <div className="text-[10px] text-slate-500">
            Publishing stable
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <div className="text-[10px] uppercase text-slate-500">Last Deploy</div>
          <div className="mt-1 text-sm font-medium text-slate-200">
            Manual control via CMS
          </div>
          <div className="text-[10px] text-slate-500">
            Sync with main site content.
          </div>
        </div>
      </div>
    </section>
  );
}
