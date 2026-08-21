// app/(website)/entity/page.tsx
//
// The entity hub. JVTO's schema graph references third-party organisations by
// @id from many pages — memberOf, recognizedBy, publisher — and every one of
// those @ids pointed at https://javavolcano-touroperator.com/entity/#org-*,
// a URL that returned 404 until 2026-08-21. A reference to an @id nothing
// defines is a dangling node: it tells a crawler an entity exists without ever
// saying what it is, so the references never consolidate into one real-world
// organisation.
//
// This page resolves them. One full definition per organisation, sourced from
// jvto-ekosistem's external-entities.json (the SSOT), published both as JSON-LD
// at the @id the rest of the graph already points to, and as readable text.
import type { Metadata } from "next";
import Link from "@/components/website/AppLink";
import StructuredData from "@/components/website/StructuredData";
import { getEcosystemExternalEntities } from "@/lib/ecosystemContent/externalEntities";

export const revalidate = 86400;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

const TITLE = "Entity Registry";
const DESCRIPTION =
  "Every third-party organisation referenced in JVTO's structured data — ministries, the conservation authority, press outlets and associations — each defined once at a stable identifier.";

export const metadata: Metadata = {
  title: `${TITLE} | Java Volcano Tour Operator`,
  description: DESCRIPTION,
  alternates: {
      canonical: `${SITE_URL}/entity`,
      languages: { en: `${SITE_URL}/entity`, "x-default": `${SITE_URL}/entity` },
    },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/entity`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
  },
};

/** Roles are stored as machine keys; these are the reader-facing labels. */
const ROLE_LABEL: Record<string, string> = {
  credentialIssuer: "Issues a credential JVTO holds",
  regulator: "Regulates where JVTO operates",
  supervisor: "Supervises an association JVTO belongs to",
  publisher: "Published coverage referencing JVTO",
  partner: "Partner organisation",
};

export default async function EntityPage() {
  const entities = await getEcosystemExternalEntities();

  const graph = entities.map((entity) => ({
    "@type": entity.schemaType ?? "Organization",
    "@id": entity.id,
    name: entity.canonicalName,
    ...(entity.aliases?.length ? { alternateName: entity.aliases } : {}),
    ...(entity.description ? { description: entity.description } : {}),
    ...(entity.sameAs?.length
      ? { sameAs: entity.sameAs.length === 1 ? entity.sameAs[0] : entity.sameAs }
      : {}),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/entity#webpage`,
        url: `${SITE_URL}/entity`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      ...graph,
    ],
  };

  return (
    <>
      <StructuredData data={schema} />

      <header className="bg-jvto-navy text-white py-16 px-6 md:px-10 pt-32 mt-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-jvto-lime mb-3">
            Structured data · {entities.length} organisations
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            Entity Registry
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
            {DESCRIPTION}
          </p>
          <p className="mt-3 text-xs text-white/50">
            None of these are JVTO. They are the outside bodies our documents
            and pages point at — listed here so each reference resolves to one
            organisation rather than to a name repeated in isolation.
          </p>
        </div>
      </header>

      <main className="bg-[#F6F5F2] py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          {entities.length === 0 ? (
            <p className="text-jvto-navy text-[15px]">
              The registry is temporarily unavailable.
            </p>
          ) : (
            <ul className="space-y-5">
              {entities.map((entity) => (
                <li
                  key={entity.key}
                  id={`org-${entity.key}`}
                  className="bg-white border border-[#E3E0DA] rounded-xl px-6 py-5 scroll-mt-28"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-semibold text-jvto-navy text-[17px]">
                      {entity.canonicalName}
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af]">
                      {entity.schemaType ?? "Organization"}
                    </span>
                    {entity.evidenceStatus === "candidate" ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b45309]">
                        no confirmed URL
                      </span>
                    ) : null}
                  </div>

                  {entity.description ? (
                    <p className="mt-2 text-jvto-navy/80 text-[14px] leading-relaxed font-light">
                      {entity.description}
                    </p>
                  ) : null}

                  {entity.role?.length ? (
                    <p className="mt-2 text-[13px] text-jvto-navy/70">
                      {entity.role
                        .map((role) => ROLE_LABEL[role] ?? role)
                        .join(" · ")}
                    </p>
                  ) : null}

                  {entity.sameAs?.length ? (
                    <ul className="mt-3 space-y-1">
                      {entity.sameAs.map((href) => (
                        <li key={href}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-jvto-orange break-all hover:opacity-75 transition-opacity"
                          >
                            {href}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {entity.definedOn ? (
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af]">
                      Referenced from{" "}
                      <Link
                        href={entity.definedOn}
                        prefetch={false}
                        className="text-jvto-orange hover:opacity-75 transition-opacity"
                      >
                        {entity.definedOn}
                      </Link>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
