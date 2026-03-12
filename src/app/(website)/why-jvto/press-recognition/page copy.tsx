import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section, Notice } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getPressCoverage } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "Press & Recognition — JVTO",
  description:
    "Third-party context: articles, guidebooks, and historical recognition — with a direct path to proof assets.",
};

export default function PressRecognitionPage() {
  const pathname = "/why-jvto/press-recognition";
  const press = getPressCoverage();

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildItemListJsonLd({
      pathname,
      title: "Press coverage",
      items: press.map((p) => ({ name: `${p.publisher}: ${p.title}`, url: p.url })),
    }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto" },
        { name: "Press & Recognition", path: "/why-jvto/press-recognition" },
      ],
    }),
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>Press & Recognition</H1>
      <Lead>Context is not hype. It’s simply easier to trust claims that have a trail.</Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/verify-jvto/press-recognition/">Open press proof</ButtonLink>
        <ButtonLink variant="secondary" href="/verify-jvto/history-artifacts/">
          Open history artifacts
        </ButtonLink>
      </div>

      <Divider />

      <Section title="Media context (from SSOT)">
        <Grid>
          {press.map((p, i) => (
            <Card key={i} title={`${p.publisher} — ${p.date}`}>
              <div className="space-y-2">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm">{p.relevance}</div>
                <a className="break-all underline underline-offset-4" href={p.url} target="_blank" rel="noreferrer">
                  {p.url}
                </a>
              </div>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="Proof library (recommended)">
        <Notice title="Use the proof spokes">
          <div className="mt-2 space-y-2">
            <div>
              Press proof: <a className="underline underline-offset-4" href="/verify-jvto/press-recognition/">/verify-jvto/press-recognition/</a>
            </div>
            <div>
              History artifacts: <a className="underline underline-offset-4" href="/verify-jvto/history-artifacts/">/verify-jvto/history-artifacts/</a>
            </div>
          </div>
        </Notice>
      </Section>
    </Container>
  );
}
