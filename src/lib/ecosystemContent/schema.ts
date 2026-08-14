const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const REVALIDATE_SECONDS = 60;

type EcosystemSchemaPayload = {
  route: string;
  payload?: {
    route?: string;
    json_ld?: {
      "@context"?: string;
      "@graph"?: unknown[];
    };
  };
};

type SchemaNode = Record<string, any>;

function ecosystemBaseUrl() {
  return (
    process.env.JVTO_ECOSYSTEM_BASE_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTEM_BASE_URL ||
    DEFAULT_ECOSYSTEM_BASE_URL
  ).replace(/\/+$/, "");
}

function nodeTypes(node: SchemaNode): string[] {
  const type = node["@type"];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return typeof type === "string" ? [type] : [];
}

function isJsonResponse(response: Response) {
  return response.headers.get("content-type")?.includes("application/json") ?? false;
}

export async function getEcosystemPageSchema(route: string) {
  const url = `${ecosystemBaseUrl()}/api/schema/page?route=${encodeURIComponent(route)}`;

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["ecosystem-schema"] },
    });
    if (!response.ok) return null;
    if (!isJsonResponse(response)) return null;

    const data = (await response.json()) as EcosystemSchemaPayload;
    const graph = data.payload?.json_ld;
    if (!graph || !Array.isArray(graph["@graph"])) return null;
    return graph as { "@context"?: string; "@graph": SchemaNode[] };
  } catch (error) {
    console.error(
      `[ecosystemContent] Failed to fetch schema for ${route}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

export async function getEcosystemOrganizationNode(route = "/travel-guide") {
  const graph = await getEcosystemPageSchema(route);
  return (
    graph?.["@graph"].find((node) =>
      nodeTypes(node).some((type) => type === "Organization" || type === "TravelAgency" || type === "LocalBusiness"),
    ) ?? null
  );
}

export function graphNodesFromSchema(schema: Awaited<ReturnType<typeof getEcosystemPageSchema>>) {
  return schema?.["@graph"] ?? [];
}
