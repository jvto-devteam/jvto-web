// src/components/website/Home/HomeDestinations.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { WebDestinationListItem } from "@/lib/destinations/getWebDestinationsList";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

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

// PKG-11a: the plate cards get the strongest photographic treatment on the page
// — taller crop, a deeper floor so the caption always clears contrast, a slow
// scale on hover, and a lime "trail" rule that draws across the base. The mono
// index/altitude/regency line is the expedition-log signature.
export default function HomeDestinations({ destinations }: HomeDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <Section surface="off" labelledBy="landscapes-heading">
      <SectionHeading
        id="landscapes-heading"
        eyebrow="§ 05"
        title={
          <>
            Iconic <span className="text-jvto-orange">landscapes.</span>
          </>
        }
        aside={destinations.map((d) => d.name).filter(Boolean).join(" · ")}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {destinations.map((dest, i) => {
          const slug = dest.slug ?? "";
          const regency = REGENCY_BY_SLUG[slug];
          const tag = TAG_BY_SLUG[slug] ?? dest.highlight ?? "";
          const altitude = formatAltitude(dest.geo?.altitude ?? null);
          return (
            <Link
              key={dest.id}
              href={`/destinations/${slug}`}
              className="jvto-focus group relative aspect-[3/4] overflow-hidden rounded-sm bg-jvto-navy shadow-jvto-soft transition-shadow duration-300 hover:shadow-jvto-card-hover"
            >
              {dest.banner.url && (
                <Image
                  src={dest.banner.url}
                  alt={dest.banner.alt || dest.name || "JVTO destination"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-jvto-navy-deep via-jvto-navy-deep/35 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute right-0 bottom-0 left-0 p-4">
                <p className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-jvto-on-navy-dim">
                  {String(i + 1).padStart(2, "0")}
                  {altitude ? ` · ${altitude}` : ""}
                  {regency ? ` · ${regency}` : ""}
                </p>
                <p className="font-jvto-heading mb-1 text-base leading-tight font-black text-white md:text-lg">
                  {dest.name}
                </p>
                {tag && (
                  <p className="text-xs leading-snug text-jvto-on-navy">{tag}</p>
                )}
                {/* Trail rule — draws across on hover/focus. */}
                <span
                  aria-hidden="true"
                  className="mt-3 block h-0.5 w-8 bg-jvto-lime transition-all duration-500 ease-out group-hover:w-full group-focus-visible:w-full"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
