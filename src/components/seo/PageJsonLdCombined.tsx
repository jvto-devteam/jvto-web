import prisma from "@/lib/prisma";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageJsonLd } from "@/lib/seo/buildPageJsonLd";

function dedupeById(schemas: Record<string, any>[]) {
  const seen = new Set<string>();
  const out: Record<string, any>[] = [];

  for (const s of schemas) {
    const id = typeof s?.["@id"] === "string" ? s["@id"] : "";
    const key = id || JSON.stringify([s["@type"], s.url, s.name]).slice(0, 200);

    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }

  return out;
}

/**
 * ONE script tag containing:
 * - Organization schema from organization_profile.schema_json
 * - WebPage + Breadcrumb + optional FAQ (+ optional extras)
 */
export async function PageJsonLdCombined({
  pageRow,
}: {
  pageRow: {
    route: string;
    lang: string;
    seo: any;
    content: any;
    created_at: Date;
    updated_at: Date;
  };
}) {
  const org = await prisma.organization_profile.findUnique({
    where: { id: 1n },
    select: { schema_json: true },
  });

  const orgSchema = (org?.schema_json as any) ?? null;
  const pageSchemas = buildPageJsonLd(pageRow);

  // Flatten org schema (object or array) + page schemas into one array
  const combined: Record<string, any>[] = [
    ...(Array.isArray(orgSchema) ? orgSchema : orgSchema ? [orgSchema] : []),
    ...pageSchemas,
  ];

  return <JsonLd data={dedupeById(combined)} />;
}
