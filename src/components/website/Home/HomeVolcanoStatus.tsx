import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";

/**
 * Homepage "Live Status" widget for Mount Bromo & Mount Ijen.
 *
 * Data-driven: reads the auto-updated PVMBG/MAGMA feed
 * (`public/ops/volcanic-status.json`) via the `statuses` prop, which the
 * homepage Server Component supplies through `getAllVolcanicStatus()`. Only the
 * presentation metadata that is NOT in the feed (display name, summit
 * elevation) is kept local. Everything else — alert level, tours-operating,
 * exclusion zone, verification date — reflects the live feed.
 */

type VolcanoMeta = {
  slug: string;
  name: string;
  elevation: string;
};

// Static presentation metadata (not carried in the volcanic-status feed).
const VOLCANO_META: VolcanoMeta[] = [
  { slug: "mount-bromo", name: "Mount Bromo", elevation: "2,329 m" },
  { slug: "ijen-crater", name: "Mount Ijen", elevation: "2,769 m" },
];

// alert_code → colour tokens (dot background + level text).
const ALERT_COLORS: Record<
  VolcanicStatusData["alert_code"],
  { dot: string; text: string }
> = {
  "level-1": { dot: "bg-jvto-lime", text: "text-jvto-lime" },
  "level-2": { dot: "bg-yellow-500", text: "text-yellow-500" },
  "level-3": { dot: "bg-orange-500", text: "text-orange-500" },
  "level-4": { dot: "bg-red-500", text: "text-red-500" },
};

/** Split "Level II (Waspada)" → { level: "II", name: "Waspada" }. */
function parseAlertLevel(alertLevel: string): { level: string; name: string } {
  const match = alertLevel.match(/Level\s+(\S+)\s*\((.+)\)/i);
  if (match) return { level: match[1], name: match[2] };
  return { level: alertLevel, name: "" };
}

export default function HomeVolcanoStatus({
  statuses,
}: {
  statuses: Record<string, VolcanicStatusData>;
}) {
  const cards = VOLCANO_META.map((meta) => ({
    meta,
    status: statuses[meta.slug],
  })).filter((c): c is { meta: VolcanoMeta; status: VolcanicStatusData } =>
    Boolean(c.status),
  );

  if (cards.length === 0) return null;

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
          {cards.map(({ meta, status }) => {
            const { level, name } = parseAlertLevel(status.alert_level);
            const colors = ALERT_COLORS[status.alert_code] ?? ALERT_COLORS["level-1"];
            return (
              <div
                key={meta.slug}
                className="bg-white rounded-sm border border-jvto-border p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-black text-jvto-navy text-lg mb-0.5">{meta.name}</h3>
                    <p className="text-jvto-muted text-xs">{meta.elevation}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} aria-hidden="true" />
                    <div className="text-right">
                      <p className={`text-sm font-black ${colors.text}`}>Level {level}</p>
                      {name && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-jvto-muted">
                          {name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-jvto-muted text-sm leading-relaxed mb-4">{status.notes}</p>

                {status.exclusion_zone_active && status.exclusion_zone_radius_km && (
                  <p className="text-[11px] font-bold text-jvto-muted mb-4">
                    ⚠ {status.exclusion_zone_radius_km} km exclusion zone active — JVTO routes
                    stay outside it.
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-jvto-border">
                  <span
                    className={`text-xs font-bold ${
                      status.tours_operating ? "text-jvto-lime-ink" : "text-red-500"
                    }`}
                  >
                    {status.tours_operating ? "● Tours operating" : "● Tours suspended"}
                  </span>
                  <a
                    href={status.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-wider text-jvto-muted hover:text-jvto-navy transition-colors"
                  >
                    Verified {status.last_verified} ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
