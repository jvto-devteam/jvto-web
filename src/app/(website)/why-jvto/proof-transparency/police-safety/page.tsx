import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SSOTRenderer from "@/components/why/SSOTRenderer";
import { Container, H1, Lead } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getPageByRoute } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "Police & Safety Proof — JVTO",
  description: "Evidence links and safety references as listed in the SSOT proof library.",
};

export default function ProofPoliceSafetyPage() {
  const pathname = "/why-jvto/proof-transparency/police-safety/";
  const page = getPageByRoute("/why-jvto/proof-transparency/police-safety/");

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto/" },
        { name: "Proof & Transparency", path: "/why-jvto/proof-transparency/" },
        { name: "Police & Safety", path: "/why-jvto/proof-transparency/police-safety/" },
      ],
    }),
  ];

  if (!page) return null;

  return (
    <Container>
      <JsonLd data={jsonLd} />
      <H1>{page.h1}</H1>
      {page.hero_subhead ? <Lead>{page.hero_subhead}</Lead> : null}
      <SSOTRenderer page={page} />
    </Container>
  );
}
