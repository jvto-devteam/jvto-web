/**
 * Public route inventory builder — T01, 2026-09-06.
 *
 * Pure expansion of PUBLIC_ROUTE_CONTRACT against already-loaded route sources.
 * Performs no I/O and reads no clock, so the same sources always produce the
 * same bytes; all loading lives in scripts/validate-public-route-contract.mjs.
 *
 * Imports only its two siblings, keeping src/lib/routes loadable by plain node.
 */
import { normalizeRoute } from "./normalizeRoute";
import {
  PUBLIC_ROUTE_CONTRACT,
  type ArtifactExpectation,
  type RouteFamilyContract,
  type RouteSourceKey,
} from "./publicRouteContract";

export type RouteSources = Readonly<Record<RouteSourceKey, readonly string[]>>;

export type InventoryRoute = Readonly<{
  route: string;
  group: string;
  contractId: string;
  sitemapExpected: boolean;
  websiteOutputExpected: ArtifactExpectation;
  schemaOutputExpected: ArtifactExpectation;
  /** `${sourceKey}#${record}` for dynamic routes; null for declared static ones. */
  sourceRecord: string | null;
}>;

export type PublicRouteInventory = Readonly<{
  schemaVersion: "jvto/public-route-inventory/v1";
  generatedAt: string;
  routes: readonly InventoryRoute[];
}>;

/**
 * Expands every contract family into concrete routes.
 *
 * `generatedAt` is injected rather than read from the clock so two runs over
 * the same sources are byte-comparable — a diff of two inventories should show
 * route changes, not a timestamp.
 */
export function buildPublicRouteInventory(
  sources: RouteSources,
  options: {
    generatedAt?: string;
    contract?: readonly RouteFamilyContract[];
  } = {},
): PublicRouteInventory {
  const contract = options.contract ?? PUBLIC_ROUTE_CONTRACT;
  const routes: InventoryRoute[] = [];

  for (const family of contract) {
    const common = {
      group: family.group,
      contractId: family.id,
      sitemapExpected: family.sitemapExpected,
      websiteOutputExpected: family.websiteOutputExpected,
      schemaOutputExpected: family.schemaOutputExpected,
    };

    if (family.kind === "static") {
      for (const route of family.routes) {
        routes.push({ ...common, route: normalizeRoute(route), sourceRecord: null });
      }
      continue;
    }

    for (const record of sources[family.source]) {
      // An empty record would normalize to the family's own index route and be
      // indistinguishable from a legitimate entry, so it is a hard error.
      if (record.trim() === "") {
        throw new Error(
          `${family.id}: source "${family.source}" yielded an empty record. ` +
            `An empty id would silently produce the family's index route.`,
        );
      }
      const route = family.expansion === "route" ? record : `${family.prefix}/${record}`;
      routes.push({
        ...common,
        route: normalizeRoute(route),
        sourceRecord: `${family.source}#${record}`,
      });
    }
  }

  routes.sort(
    (a, b) => a.route.localeCompare(b.route) || a.contractId.localeCompare(b.contractId),
  );

  return {
    schemaVersion: "jvto/public-route-inventory/v1",
    generatedAt: options.generatedAt ?? "",
    routes,
  };
}

/** Routes claimed by more than one contract family. An empty array means clean. */
export function findDuplicateRoutes(inventory: PublicRouteInventory): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of inventory.routes) {
    if (seen.has(entry.route)) duplicates.add(entry.route);
    seen.add(entry.route);
  }
  return [...duplicates].sort();
}
