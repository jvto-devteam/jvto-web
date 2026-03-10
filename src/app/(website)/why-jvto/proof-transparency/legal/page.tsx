import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SSOTRenderer from "@/components/why/SSOTRenderer";
import { Container, H1, Lead } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getPageByRoute } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "Legal & Accountability Proof — JVTO",
  description: "Business identity, licenses, and accountability references (as listed in the SSOT).",
};

export default function ProofLegalPage() {
  const pathname = "verify-jvto/legal/";
  const page = getPageByRoute("verify-jvto/legal/");

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto" },
        { name: "Proof & Transparency", path: "/why-jvto/proof-transparency/" },
        { name: "Legal", path: "verify-jvto/legal/" },
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
