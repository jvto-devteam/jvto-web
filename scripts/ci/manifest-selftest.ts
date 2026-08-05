/**
 * Milestone 0 self-test for the authority/consumer manifest generator.
 * Proves evidence-based consumer derivation + import-following, not blanket labels.
 * Run: npx tsx scripts/ci/manifest-selftest.ts
 */
import { build, type Row } from "../baseline/authority-consumer-manifest";

let failed = 0;
function check(cond: boolean, label: string) {
  console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
  if (!cond) failed = 1;
}

const rows: Row[] = build();
const routes = rows.filter((r) => r.kind === "route");
const by = (s: string) => routes.find((r) => r.surface === s);

console.log("[manifest-selftest] private routes are not public AI/sitemap consumers");
for (const s of ["/checkout", "/my-booking"]) {
  const r = by(s);
  check(!!r, `${s} present`);
  if (r) {
    check(r.private === true, `${s} flagged private`);
    check(r.consumers.includes("private"), `${s} has 'private' consumer`);
    check(!r.consumers.includes("AI/llms"), `${s} NOT an AI/llms consumer`);
    check(!r.consumers.some((c) => c.startsWith("sitemap")), `${s} NOT a sitemap consumer`);
    check(!r.consumers.includes("web"), `${s} not plain public 'web' (is 'web (auth)')`);
  }
}

console.log("[manifest-selftest] sitemap membership is evidence-derived");
const why = by("/why-jvto");
check(!!why && why.consumers.includes("sitemap"), "/why-jvto (in sitemap.data) → sitemap consumer");
check(!!why && why.consumers.includes("AI/llms"), "/why-jvto crawlable public → AI/llms consumer");
// A route absent from every sitemap.data.ts must not claim sitemap/AI.
const contact = by("/contact");
const anyNonSitemapPublic = routes.find((r) => !r.private && !r.consumers.some((c) => c.startsWith("sitemap")));
check(!!anyNonSitemapPublic, "at least one public route is correctly NOT in sitemap (no blanket assignment)");
if (anyNonSitemapPublic) check(!anyNonSitemapPublic.consumers.includes("AI/llms"), `${anyNonSitemapPublic.surface}: no sitemap ⇒ no AI/llms`);

console.log("[manifest-selftest] authority follows the import closure (indirect resolvers)");
check(
  routes.some((r) => r.resolution === "transitive"),
  "≥1 route resolves authority transitively (via imported component/resolver)",
);
check(
  routes.every((r) => ["direct", "transitive", "unresolved"].includes(r.resolution)),
  "every route resolution is direct | transitive | unresolved (never guessed)",
);
// Unresolved must be labelled honestly, not defaulted to a real authority.
for (const r of routes) {
  if (r.resolution === "unresolved") check(/unresolved/i.test(r.authority), `${r.surface}: unresolved authority labelled honestly`);
}

console.log("[manifest-selftest] no route claims blanket AI/llms + sitemap regardless of evidence");
check(routes.some((r) => !r.consumers.includes("AI/llms")), "not every route is an AI/llms consumer");

if (failed) {
  console.log("[manifest-selftest] FAIL");
  process.exit(1);
}
console.log(`[manifest-selftest] PASS (${routes.length} routes, ${routes.filter((r) => r.private).length} private)`);
