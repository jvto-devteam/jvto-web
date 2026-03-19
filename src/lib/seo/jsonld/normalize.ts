type JsonLdNode = Record<string, any>;
type JsonLdInput = JsonLdNode | JsonLdNode[] | null | undefined;

const SCHEMA_CONTEXT = "https://schema.org";

function isRecord(value: unknown): value is JsonLdNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasType(node: JsonLdNode) {
  const type = node["@type"];
  if (Array.isArray(type)) return type.length > 0;
  return typeof type === "string" && type.trim().length > 0;
}

function stripNodeContext(node: JsonLdNode): JsonLdNode {
  const { "@context": _context, ...rest } = node;
  return rest;
}

function extractNodes(input: JsonLdInput): JsonLdNode[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.flatMap((item) => extractNodes(item));
  }

  if (!isRecord(input)) return [];

  const graph = input["@graph"];
  const ownNode = hasType(input) ? [stripNodeContext(input)] : [];
  const graphNodes = Array.isArray(graph) ? graph.flatMap((item) => extractNodes(item)) : [];

  return [...ownNode, ...graphNodes];
}

export function normalizeJsonLd(input: JsonLdInput) {
  const graph = extractNodes(input).filter((node) => hasType(node));

  if (!graph.length) return null;

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": graph,
  };
}
