import fs from "node:fs";
import path from "node:path";

import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";

/**
 * Shared reader for the auto-updated PVMBG/MAGMA volcanic status feed at
 * `public/ops/volcanic-status.json` (refreshed daily by GitHub Actions).
 *
 * Server Components (homepage, destination pages) call these helpers directly
 * instead of self-fetching `/api/...` — see CLAUDE.md "Server Components →
 * Direct Helpers (NOT self-fetch)". The JSON is a build/runtime file read, so
 * there is no DB round-trip.
 */

export type VolcanoSlug = "ijen-crater" | "mount-bromo";

type VolcanicStatusFile = {
  destinations: Record<string, VolcanicStatusData>;
};

function readStatusFile(): VolcanicStatusFile | null {
  try {
    const statusPath = path.join(
      process.cwd(),
      "public",
      "ops",
      "volcanic-status.json",
    );
    const raw = fs.readFileSync(statusPath, "utf8");
    return JSON.parse(raw) as VolcanicStatusFile;
  } catch {
    return null;
  }
}

/** Single-destination status, or null if the slug is absent / file unreadable. */
export function getVolcanicStatus(slug: VolcanoSlug): VolcanicStatusData | null {
  const data = readStatusFile();
  return data?.destinations?.[slug] ?? null;
}

/**
 * All destination statuses keyed by slug. Returns an empty object when the feed
 * is unreadable so callers can render a graceful empty state instead of crashing.
 */
export function getAllVolcanicStatus(): Record<string, VolcanicStatusData> {
  return readStatusFile()?.destinations ?? {};
}
