// /llms.txt is ecosystem-first. The legacy Trust Bundle remains as a fallback
// so crawler output does not break if ekosistem is temporarily unreachable.

import {
  trustClaims,
  trustAeoSnippets,
  trustManifest,
  organizationSchema,
} from "@/lib/trust-bundle";
import { SHA256_ANCHORS } from "@/lib/forensic-anchors";

type OrgIdentifier = { propertyID?: string; value?: string };
type OrgSchema = {
  name?: string;
  legalName?: string;
  url?: string;
  identifier?: OrgIdentifier[];
  founder?: { name?: string; jobTitle?: string };
};

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";

function ecosystemBaseUrl() {
  return (
    process.env.JVTO_ECOSYSTEM_BASE_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTEM_BASE_URL ||
    DEFAULT_ECOSYSTEM_BASE_URL
  ).replace(/\/+$/, "");
}

async function getEcosystemLlmsTxt() {
  try {
    const response = await fetch(`${ecosystemBaseUrl()}/llms.txt`, {
      headers: { accept: "text/plain" },
      next: { revalidate: 60, tags: ["ecosystem-llms"] },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/plain")) return null;

    const body = await response.text();
    return body.trim() ? `${body.trim()}\n` : null;
  } catch (error) {
    console.error(
      `[llms.txt] Failed to fetch ekosistem llms.txt: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

function buildTrustBundleLlmsTxt(): string {
  const org = organizationSchema as OrgSchema;
  const lines: string[] = [];

  lines.push(`# ${org.name ?? "Java Volcano Tour Operator (JVTO)"}`);
  lines.push(
    `> Machine-readable entity dossier for LLM crawlers. Auto-generated from the ` +
      `JVTO Trust Bundle (compiler v${trustManifest.compiler_version}, compiled ` +
      `${trustManifest.compiled_at.slice(0, 10)}). Source: llm-wiki SSOT. Do not hand-edit.`,
  );
  lines.push("");

  // ── Entity identity (from the Organization JSON-LD in the bundle) ──
  lines.push("## Entity Identity");
  if (org.legalName) lines.push(`- **Legal name**: ${org.legalName}`);
  if (org.name) lines.push(`- **Brand name**: ${org.name}`);
  if (org.url) lines.push(`- **Website**: ${org.url}`);
  for (const id of org.identifier ?? []) {
    if (id.propertyID && id.value) lines.push(`- **${id.propertyID}**: ${id.value}`);
  }
  if (org.founder?.name) {
    const jt = org.founder.jobTitle ? ` — ${org.founder.jobTitle}` : "";
    lines.push(`- **Founder**: ${org.founder.name}${jt}`);
  }
  lines.push("");

  // ── Trust pillars (C1–C9) ──
  const aeoByClaim = new Map<string, string>();
  for (const s of trustAeoSnippets) {
    for (const cid of s.claim_ids ?? []) {
      if (!aeoByClaim.has(cid)) aeoByClaim.set(cid, s.tldr);
    }
  }
  lines.push(`## Trust Pillars (${trustClaims.length} canonical claims)`);
  lines.push("");
  for (const c of trustClaims) {
    lines.push(`### ${c.id} — ${c.name}`);
    lines.push(c.canonical_text);
    const tldr = c.narrative?.ai_snippet ?? aeoByClaim.get(c.id);
    if (tldr) lines.push(`- **TL;DR**: ${tldr}`);
    const proofs = [
      ...new Set((c.evidence ?? []).flatMap((e) => e.proof_ids ?? [])),
    ];
    if (proofs.length) lines.push(`- **Evidence**: ${proofs.join(", ")}`);
    lines.push("");
  }

  // ── AEO snippets (extraction-ready one-liners) ──
  lines.push("## AEO Snippets (extraction-ready)");
  for (const s of trustAeoSnippets) {
    lines.push(`- **${s.topic}**: ${s.tldr}`);
  }
  lines.push("");

  // ── SHA-256 forensic anchors (document hashes for tamper verification) ──
  // Published here so /verify-jvto/legal's "Forensic Anchors" cross-reference holds.
  lines.push("## Document Hashes (SHA-256 Forensic Anchors)");
  lines.push(
    "Download the file and compute its SHA-256 to confirm it has not been altered.",
  );
  for (const a of SHA256_ANCHORS) {
    lines.push(`- **${a.asset}**: ${a.hash}`);
  }
  lines.push("");

  // ── Provenance footer ──
  const inp = trustManifest.inputs ?? {};
  lines.push("---");
  lines.push(
    `Compiled ${trustManifest.compiled_at} from ${inp.claims ?? trustClaims.length} claims, ` +
      `${inp.evidence ?? "?"} evidence items, ${inp.entities ?? "?"} entities. ` +
      `Auto-synced from llm-wiki; regenerates on every Trust Bundle sync.`,
  );

  return lines.join("\n") + "\n";
}

export async function buildLlmsTxt(): Promise<string> {
  return (await getEcosystemLlmsTxt()) ?? buildTrustBundleLlmsTxt();
}
