// src/components/cms/publishHelpers.ts
// Shared client helpers for the Website SSOT CMS editors:
//   - validateContent(): POST the concatenated editable text to the facts-lock
//     denylist gate (/api/content-validate). Blocks a Publish when it returns
//     ok:false so canonical-facts violations never reach the DB.
//   - revalidateRoute(): POST the route to /api/revalidate so the public page
//     picks up the new content on-demand (next/cache revalidatePath).
// Both are plain fetch wrappers — the APIs enforce admin auth server-side.

export interface ValidateResult {
  ok: boolean;
  violations?: string[];
  error?: string;
}

/**
 * Run the canonical-facts denylist gate on a draft blob BEFORE saving.
 * Returns { ok:true } when clean, { ok:false, violations } when blocked.
 */
export async function validateContent(text: string): Promise<ValidateResult> {
  try {
    const res = await fetch("/api/content-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: data?.message || `Validator error (${res.status})`,
        violations: Array.isArray(data?.violations) ? data.violations : undefined,
      };
    }
    return {
      ok: data?.ok === true,
      violations: Array.isArray(data?.violations) ? data.violations : undefined,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to reach validator",
    };
  }
}

/** Trigger on-demand revalidation of a public route after a successful publish. */
export async function revalidateRoute(
  route: string,
): Promise<{ revalidated: boolean; error?: string }> {
  try {
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        revalidated: false,
        error: data?.message || `Revalidate error (${res.status})`,
      };
    }
    return { revalidated: data?.revalidated === true };
  } catch (err) {
    return {
      revalidated: false,
      error: err instanceof Error ? err.message : "Failed to reach revalidate",
    };
  }
}

/**
 * Build the plain-text blob that the facts-lock gate scans for a content_pages
 * draft: body markdown + FAQ answers/questions + SEO title/description.
 */
export function buildContentPageDraftText(input: {
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  bodyMd?: string;
  faq?: { q: string; a: string }[];
}): string {
  const parts: string[] = [];
  if (input.seoTitle) parts.push(input.seoTitle);
  if (input.seoDescription) parts.push(input.seoDescription);
  if (input.h1) parts.push(input.h1);
  if (input.bodyMd) parts.push(input.bodyMd);
  for (const f of input.faq ?? []) {
    if (f.q) parts.push(f.q);
    if (f.a) parts.push(f.a);
  }
  return parts.join("\n");
}

/** Build the scan blob for a narrative_claim draft: pillar + core_claim + variants. */
export function buildNarrativeClaimDraftText(input: {
  pillar?: string;
  core_claim?: string;
  nlp_variants?: unknown;
}): string {
  const parts: string[] = [];
  if (input.pillar) parts.push(input.pillar);
  if (input.core_claim) parts.push(input.core_claim);
  if (Array.isArray(input.nlp_variants)) {
    for (const v of input.nlp_variants) {
      if (typeof v === "string") parts.push(v);
    }
  } else if (typeof input.nlp_variants === "string") {
    parts.push(input.nlp_variants);
  }
  return parts.join("\n");
}
