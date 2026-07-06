// src/components/website/Home/HomeDestinations.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { WebDestinationListItem } from "@/lib/destinations/getWebDestinationsList";

// Regency/location context — geographic fact, not review content. Mirrors the
// same regencies already published on the merged destination detail pages.
const REGENCY_BY_SLUG: Record<string, string> = {
  "mount-bromo": "Probolinggo",
  "ijen-crater": "Banyuwangi",
  "tumpak-sewu-waterfall": "Lumajang",
  "madakaripura-waterfall": "Probolinggo",
  "papuma-beach": "Jember",
};

const TAG_BY_SLUG: Record<string, string> = {
  "mount-bromo": "Tengger caldera · Sea of sand",
  "ijen-crater": "Blue fire · World's highest-volume acidic lake",
  "tumpak-sewu-waterfall": "Curtain falls · Optional canyon descent",
  "madakaripura-waterfall": "Tallest in Java · Canyon chamber",
  "papuma-beach": "White-sand cove · East Java coast",
};

interface HomeDestinationsProps {
  destinations: WebDestinationListItem[];
}

// getWebDestinationsList's `geo.altitude` is typed as string but the
// underlying Prisma field (destinations.altitude) is a plain Int (meters) —
// format defensively so a bare number renders as "2,329 m" either way.
function formatAltitude(altitude: string | null): string | null {
  if (!altitude) return null;
  const trimmed = String(altitude).trim();
  if (/m\b/i.test(trimmed)) return trimmed;
  const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric) || numeric === 0) return trimmed;
  return `${numeric.toLocaleString("en-US")} m`;
}

export default function HomeDestinations({ destinations }: HomeDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <section aria-labelledby="landscapes-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 05
            </p>
            <h2
              id="landscapes-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Iconic <span className="text-jvto-orange">landscapes.</span>
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-jvto-muted">
            {destinations.map((d) => d.name).filter(Boolean).join(" · ")}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {destinations.map((dest, i) => {
            const slug = dest.slug ?? "";
            const regency = REGENCY_BY_SLUG[slug];
            const tag = TAG_BY_SLUG[slug] ?? dest.highlight ?? "";
            const altitude = formatAltitude(dest.geo.altitude);
            return (
              <Link
                key={dest.id}
                href={`/destinations/${slug}`}
                className="group relative overflow-hidden rounded-sm aspect-[3/4]"
              >
                {dest.banner.url && (
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name || "JVTO destination"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-mono text-[10px] font-bold text-white/60 mb-1">
                    {String(i + 1).padStart(2, "0")}
                    {altitude ? ` · ${altitude}` : ""}
                    {regency ? ` · ${regency}` : ""}
                  </p>
                  <p className="font-black text-white text-base md:text-lg leading-tight mb-1">
                    {dest.name}
                  </p>
                  {tag && <p className="text-white/60 text-xs leading-snug">{tag}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
