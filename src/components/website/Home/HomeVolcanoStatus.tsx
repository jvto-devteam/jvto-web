const VOLCANOES = [
  {
    name: "Mount Bromo",
    elevation: "2,329m",
    level: "II",
    levelName: "Waspada",
    levelColor: "bg-yellow-500",
    textColor: "text-yellow-500",
    status: "Advisory",
    description:
      "Elevated seismic activity. Tours operate normally with standard safety distance maintained at the crater viewpoint.",
    source: "PVMBG / MAGMA Indonesia",
    sourceUrl: "https://magma.esdm.go.id/",
    tours: true,
  },
  {
    name: "Mount Ijen",
    elevation: "2,769m",
    level: "I",
    levelName: "Normal",
    levelColor: "bg-jvto-green",
    textColor: "text-jvto-green",
    status: "Normal",
    description:
      "Standard activity. Pre-ascent health screening (SpO2 & blood pressure) required for all JVTO guests before crater descent.",
    source: "PVMBG / MAGMA Indonesia",
    sourceUrl: "https://magma.esdm.go.id/",
    tours: true,
  },
] as const;

export default function HomeVolcanoStatus() {
  return (
    <section aria-labelledby="volcano-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              Live Status
            </p>
            <h2
              id="volcano-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Volcano Activity
            </h2>
          </div>
          <a
            href="https://magma.esdm.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-jvto-muted hover:text-jvto-navy transition-colors"
          >
            Source: PVMBG / MAGMA Indonesia ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOLCANOES.map((v) => (
            <div
              key={v.name}
              className="bg-white rounded-sm border border-jvto-border p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-black text-jvto-navy text-lg mb-0.5">{v.name}</h3>
                  <p className="text-jvto-muted text-xs">{v.elevation}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${v.levelColor}`} aria-hidden="true" />
                  <div className="text-right">
                    <p className={`text-sm font-black ${v.textColor}`}>
                      Level {v.level}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-jvto-muted">
                      {v.levelName}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-jvto-muted text-sm leading-relaxed mb-4">
                {v.description}
              </p>

              <div className="flex items-center gap-2 pt-3 border-t border-jvto-border">
                <span className={`text-xs font-bold ${v.tours ? "text-jvto-green" : "text-red-500"}`}>
                  {v.tours ? "● Tours operating" : "● Tours suspended"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
