import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SSOTRenderer from "@/components/why/SSOTRenderer";
import AuthorityShield from "@/components/why/AuthorityShield";
import { ButtonLink, Container, Divider, H1, Lead } from "@/components/ui";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld";
import { getPageByRoute } from "@/lib/why-ssot";
import EcosystemIndex from "@/components/why/EcosystemIndex";
import { WHY_JVTO_ECOSYSTEM_LINKS } from "@/lib/why-ecosystem";

export const metadata: Metadata = {
  title: "Why JVTO — Operational Certainty",
  description:
    "Proof-backed trust: police-led discipline, verified legality, documented history, local team execution, and safety innovation.",
};

export default function WhyJVTOHubPage() {
  const pathname = "/why-jvto/";
  const page = getPageByRoute("/why-jvto/");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://javavolcano-touroperator.com/why-jvto/#ecosystem",
      name: "Why JVTO Ecosystem Index",
      itemListElement: WHY_JVTO_ECOSYSTEM_LINKS.map((it, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: it.title,
        url: `https://javavolcano-touroperator.com${it.href.endsWith("/") ? it.href : it.href}`,
      })),
    },
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({
      pathname,
      title: metadata.title as string,
      description: metadata.description as string,
    }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto/" },
      ],
    }),
  ];

  if (!page) return null;

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>{page.h1}</H1>
      {page.hero_subhead ? <Lead>{page.hero_subhead}</Lead> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {page.primary_cta?.url ? (
          <ButtonLink href={page.primary_cta.url}>
            {page.primary_cta.label}
          </ButtonLink>
        ) : null}
        {page.secondary_cta?.url ? (
          <ButtonLink variant="secondary" href={page.secondary_cta.url}>
            {page.secondary_cta.label}
          </ButtonLink>
        ) : null}
      </div>

      <AuthorityShield />

      <Divider />
      <EcosystemIndex />
      <Divider />
      <SSOTRenderer page={page} />
    </Container>
  );
}
