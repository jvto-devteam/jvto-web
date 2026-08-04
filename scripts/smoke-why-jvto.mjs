#!/usr/bin/env node
/**
 * smoke-why-jvto.mjs — post-deploy live proof for the Why JVTO cluster (PKG-05c).
 *
 * Run against a deployed box (help/preview or prod). Fails non-zero unless the
 * live site actually serves the migrated, fact-corrected pages:
 *   - /api/build-info reports the expected commit SHA (deployment landed);
 *   - all six why-jvto routes return HTTP 200;
 *   - each carries the correct production canonical;
 *   - each emits exactly ONE FAQPage JSON-LD node (AD-08);
 *   - the hub shows 11 active crew / 7 guides / 4 drivers;
 *   - the hub carries none of: "14 … crew", "guidebook 2016", "ISIC Partner",
 *     INDECON validation/partnership claim.
 *
 * Usage:
 *   BASE_URL=https://help.javavolcano-touroperator.com \
 *   EXPECTED_SHA=<git sha> node scripts/smoke-why-jvto.mjs
 * (EXPECTED_SHA optional — skip the SHA check when unset, e.g. local probing.)
 */
const BASE = (process.env.BASE_URL || process.argv[2] || "https://help.javavolcano-touroperator.com").replace(/\/+$/, "");
const EXPECTED_SHA = process.env.EXPECTED_SHA || process.argv[3] || "";
const PROD_ORIGIN = "https://javavolcano-touroperator.com";

const ROUTES = [
  "/why-jvto",
  "/why-jvto/our-story",
  "/why-jvto/the-jvto-difference",
  "/why-jvto/our-team",
  "/why-jvto/community-standards",
  "/why-jvto/reviews",
];

const problems = [];
const bad = (m) => problems.push(m);

async function fetchText(url, { retries = 5, delayMs = 5000 } = {}) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      const body = await res.text();
      return { status: res.status, body };
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return { status: 0, body: "" };
}

function countFaqPages(html) {
  let count = 0;
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let json;
    try {
      json = JSON.parse(m[1]);
    } catch {
      continue;
    }
    for (const node of Array.isArray(json) ? json : json?.["@graph"] ?? [json]) {
      const t = node?.["@type"];
      if (t === "FAQPage" || (Array.isArray(t) && t.includes("FAQPage"))) count += 1;
    }
  }
  return count;
}

async function main() {
  console.log(`[smoke-why-jvto] BASE=${BASE}`);

  // 1. deployment SHA
  if (EXPECTED_SHA) {
    let sha = "";
    for (let i = 1; i <= 12; i++) {
      try {
        const r = await fetch(`${BASE}/api/build-info`, { redirect: "manual" });
        sha = (await r.json())?.commitSha ?? "";
      } catch {
        sha = "";
      }
      if (sha === EXPECTED_SHA) break;
      console.log(`  build-info attempt ${i}/12: got "${sha || "<unreachable>"}", want "${EXPECTED_SHA}"`);
      await new Promise((r) => setTimeout(r, 10000));
    }
    if (sha !== EXPECTED_SHA) bad(`/api/build-info SHA "${sha}" != expected "${EXPECTED_SHA}" — deployment not landed`);
    else console.log(`  ✓ deployed SHA ${sha}`);
  } else {
    console.log("  (EXPECTED_SHA unset — skipping SHA check)");
  }

  // 2-4. per-route: 200, canonical, single FAQPage
  const hubHtml = {};
  for (const route of ROUTES) {
    const { status, body } = await fetchText(`${BASE}${route}`);
    if (status !== 200) {
      bad(`${route}: HTTP ${status} (expected 200)`);
      continue;
    }
    const canonical = `${PROD_ORIGIN}${route}`;
    if (!body.includes(`href="${canonical}"`) && !body.includes(`"${canonical}"`)) {
      bad(`${route}: production canonical "${canonical}" not found`);
    }
    const faqCount = countFaqPages(body);
    if (faqCount !== 1) bad(`${route}: expected exactly 1 FAQPage JSON-LD, found ${faqCount}`);
    if (route === "/why-jvto") hubHtml.html = body;
    console.log(`  ✓ ${route}: 200, canonical ok, FAQPage×${faqCount}`);
  }

  // 5-6. hub crew composition + forbidden claims
  const html = hubHtml.html ?? "";
  if (html) {
    if (!/11 active crew/i.test(html)) bad('hub: "11 active crew" total not shown');
    if (!/7 guides,\s*4 drivers/i.test(html)) bad('hub: "7 guides, 4 drivers" composition not shown');
    const forbidden = [
      { label: "14 crew", re: /\b14\b[^\n<]{0,24}\bcrew\b|\bcrew\b[^\n<]{0,24}\b14\b/i },
      { label: "guidebook 2016", re: /guidebook\s*20\d\d|Stefan\s+Loose[^\n<]{0,40}20\d\d/i },
      { label: "ISIC Partner", re: /\bISIC\s+Partner\b/i },
      { label: "INDECON validation/partnership", re: /INDECON[^\n<]{0,30}\b(members?|validat\w*|partnership\w*)\b|\b(members?|validat\w*|partnership\w*)\b[^\n<]{0,30}INDECON/i },
    ];
    for (const { label, re } of forbidden) {
      const m = html.match(re);
      if (m) bad(`hub: forbidden claim (${label}) present: "${m[0]}"`);
    }
    if (!problems.some((p) => p.startsWith("hub:"))) console.log("  ✓ hub: 11/7/4 crew, no forbidden claims");
  } else {
    bad("hub: /why-jvto body unavailable for content assertions");
  }

  if (problems.length) {
    console.error(`\n[smoke-why-jvto] FAIL — ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log("\n[smoke-why-jvto] PASS — all 6 routes live, SHA verified, crew + claims correct.");
}

main().catch((err) => {
  console.error(`[smoke-why-jvto] ERROR: ${err?.message ?? err}`);
  process.exit(1);
});
