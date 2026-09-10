#!/usr/bin/env node
/**
 * Tour FAQ parity gate — the live half of backlog task T05B.
 *
 * Asserts, against a RUNNING server, that every question in a tour page's
 * FAQPage.mainEntity is actually rendered on that page, and that nothing is
 * rendered which the schema omits. Before T05B the two lists were built
 * separately and had drifted badly: 905 of 1162 Question nodes site-wide had no
 * on-page counterpart, 779 of them on these 17 routes.
 *
 * WHY THIS EXISTS AT ALL. CI cannot catch this. `npm run validate schema` is a
 * static analyser over page.tsx files and never sees the PDP FAQPage — that node
 * is built in src/lib/schemas/buildTourSchemas.ts and emitted through a
 * standalone <JsonLd>, out of the parser's reach. No test:* script runs in CI,
 * and tsc there is continue-on-error. This sweep is the only real evidence.
 *
 * HOW PARITY IS MEASURED. The primary check is text-based, not structural: every
 * Question.name AND its acceptedAnswer.text must appear in the page's rendered
 * text. That is the claim we actually care about ("the schema does not assert
 * unseen content") and it does not depend on CSS class names, which change.
 * Comparison ignores whitespace on both sides, because stripping inline markup
 * such as <strong> inserts spaces a reader never sees.
 *
 * A secondary structural count catches the inverse case — content rendered but
 * left out of the schema. The spine surface is bounded (8-9 open cards); the
 * other two are not, because their sizes are per-route content, so only their
 * sum against mainEntity is asserted. Do not describe this as a full per-surface
 * check: it is not one.
 *
 * THREE VISIBLE SURFACES, on purpose. Open Quick Answers cards carry the 8-9
 * canonical spine items; a collapsed "Tour FAQs" section carries the 13-71
 * per-package FAQs; the Ijen requirements accordion carries the requirement
 * items. All three are visible to a reader — <details> keeps its text in the
 * HTML, only the visual state is folded — and all three count. Each is asserted
 * separately as well as in sum, because a sum-only check would pass if items
 * silently migrated between surfaces.
 *
 * Exit codes (same contract as scripts/verify-live.mjs):
 *   0  every route passed
 *   1  the site failed a check
 *   2  usage error, or the route list could not be built
 *
 * Usage:
 *   npm run validate:tour-faq-parity
 *   npm run validate:tour-faq-parity -- --base http://localhost:3000
 *   npm run validate:tour-faq-parity -- --json out.json --quiet
 */
import { writeFile } from "node:fs/promises";
import { getEcosystemTourPackageRoutes } from "../src/lib/ecosystemContent/tourPackageDetail.ts";

const DEFAULT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
const BASE_EXPECTED = "a bare origin like https://example.com";
const MAX_CONCURRENCY = 64;

/**
 * A route that must NOT change, swept alongside the PDPs. A sample made only of
 * routes we expect to change cannot tell a fix from a site-wide break.
 */
const CONTROL_ROUTE = "/travel-guide/ijen-health-screening";

/**
 * The canonical spine is 9 items, one of them ijen_only, so a PDP renders 8 or 9
 * open cards. Anything else means another surface's content leaked into them.
 */
const SPINE_MIN = 8;
const SPINE_MAX = 9;

/** Floors from scripts/validate-public-route-contract.mjs — a partial read must not pass. */
const PDP_FLOORS = { "tours/from-bali": 4, "tours/from-surabaya": 13 };

const wholeNumber = (min, max = Infinity) => (v) =>
  Number.isInteger(v) && v >= min && v <= max;
const bareOrigin = (v) => {
  try {
    const u = new URL(v);
    return (
      (u.protocol === "https:" || u.protocol === "http:") &&
      u.pathname === "/" &&
      !u.search &&
      !u.hash &&
      !u.username &&
      !u.password
    );
  } catch {
    return false;
  }
};
const normalizeBase = (v) => String(v).trim().replace(/\/+$/, "");

const FLAGS = {
  "--quiet": { boolean: true, key: "quiet" },
  "--base": {
    key: "base",
    coerce: normalizeBase,
    validate: bareOrigin,
    expected: BASE_EXPECTED,
  },
  "--json": { key: "json" },
  "--concurrency": {
    key: "concurrency",
    coerce: Number,
    validate: wholeNumber(1, MAX_CONCURRENCY),
    expected: `a whole number from 1 to ${MAX_CONCURRENCY}`,
  },
};

const refuse = (message) => {
  console.error(`${message} — refusing to run`);
  process.exit(2);
};

function parseArgs(argv) {
  const opts = { base: DEFAULT_BASE, concurrency: 6, json: null, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const spec = Object.hasOwn(FLAGS, flag) ? FLAGS[flag] : undefined;
    if (!spec) refuse(`unknown argument: ${flag}`);
    if (spec.boolean) {
      opts[spec.key] = true;
      continue;
    }
    const raw = argv[i + 1];
    if (raw === undefined || raw === "" || raw.startsWith("--")) {
      refuse(`${flag} needs a value`);
    }
    i += 1;
    const parsed = spec.coerce ? spec.coerce(raw) : raw;
    if (spec.validate && !spec.validate(parsed)) {
      refuse(`${flag} must be ${spec.expected}, got ${JSON.stringify(raw)}`);
    }
    opts[spec.key] = parsed;
  }
  opts.base = normalizeBase(opts.base);
  if (!bareOrigin(opts.base)) {
    refuse(`base must be ${BASE_EXPECTED}, got ${JSON.stringify(opts.base)}`);
  }
  return opts;
}

// `connection: close` is not cosmetic: undici keep-alive sockets abort the
// process on Windows and the shell then sees 127 instead of our exit code.
const get = (url, init = {}) =>
  fetch(url, {
    ...init,
    headers: {
      "user-agent": "jvto-tour-faq-parity",
      connection: "close",
      ...(init.headers ?? {}),
    },
  });

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
  "&nbsp;": " ",
};

/** Rendered text as a reader sees it: tags stripped, entities decoded, whitespace collapsed. */
function renderedText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

const decodeEntities = (s) =>
  String(s).replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m);

const normalizeQuestion = (s) => decodeEntities(s).replace(/\s+/g, " ").trim();

/**
 * Whitespace-insensitive form, for the containment tests.
 *
 * Stripping tags turns `<strong>x</strong>` into a space on either side, so an
 * answer whose source string is "…absolutely mandatory. You…" renders as
 * "…absolutely mandatory . You…". Comparing on the exact string reports a
 * mismatch that does not exist for a reader. Dropping whitespace on BOTH sides
 * compares the words themselves, which is the claim we actually make.
 */
const squash = (s) => decodeEntities(s).replace(/\s+/g, "");

/** Same regex as verify-live.mjs — tolerates attribute order and quote style. */
function extractJsonLd(html) {
  const nodes = [];
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  for (const b of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(b[1]);
    } catch {
      return { nodes: [], parseError: true };
    }
    const graph = parsed?.["@graph"];
    if (Array.isArray(graph)) nodes.push(...graph);
    else if (Array.isArray(parsed)) nodes.push(...parsed);
    else if (parsed) nodes.push(parsed);
  }
  return { nodes, parseError: false };
}

const typeOf = (node) => {
  const t = node?.["@type"];
  return Array.isArray(t) ? t : [t];
};

/** Quick Answers cards. Structural, secondary to the text check. */
const countQuickAnswers = (html) =>
  [...html.matchAll(/text-base font-bold text-jvto-navy mb-3 leading-snug/g)].length;

/** Ijen requirements accordion. */
const countAccordion = (html) =>
  [...html.matchAll(/<summary[^>]*cursor-pointer font-semibold text-gray-800/g)].length;

/** Collapsed per-package "Tour FAQs" section. */
const countPackage = (html) =>
  [...html.matchAll(/<summary[^>]*cursor-pointer text-sm font-bold text-jvto-navy/g)].length;

function checkPdp(html) {
  const failures = [];
  const warnings = [];

  const { nodes, parseError } = extractJsonLd(html);
  if (parseError) return { failures: ["JSON-LD does not parse"], warnings };

  const faqPages = nodes.filter((n) => typeOf(n).includes("FAQPage"));
  if (faqPages.length === 0) return { failures: ["no FAQPage node"], warnings };
  if (faqPages.length > 1) failures.push(`${faqPages.length} FAQPage nodes, expected 1`);

  const faq = faqPages[0];
  if (typeof faq["@id"] !== "string" || !faq["@id"].endsWith("#faq")) {
    failures.push(`FAQPage @id missing or not #faq: ${JSON.stringify(faq["@id"])}`);
  }

  const mainEntity = Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
  if (mainEntity.length === 0) failures.push("FAQPage.mainEntity is empty");

  // PRIMARY CHECK: every claimed question is on the page.
  const squashedText = squash(renderedText(html));
  const missingQ = [];
  const missingA = [];
  for (const q of mainEntity) {
    const name = normalizeQuestion(q?.name ?? "");
    if (!name) {
      failures.push("a Question has no name");
      continue;
    }
    if (!squashedText.includes(squash(name))) missingQ.push(name);

    // The answer half. This was missing until 2026-09-11 and its absence hid a
    // real mismatch: an answer is half the claim a FAQPage makes, and schema
    // text that no reader can find is the whole defect T05B exists to remove.
    const answer = normalizeQuestion(q?.acceptedAnswer?.text ?? "");
    if (!answer) {
      failures.push(`Question has no acceptedAnswer.text: "${name.slice(0, 60)}"`);
      continue;
    }
    if (!squashedText.includes(squash(answer))) missingA.push(name);
  }
  if (missingQ.length) {
    failures.push(
      `${missingQ.length}/${mainEntity.length} Question(s) not rendered: ` +
        missingQ.map((m) => `"${m.slice(0, 50)}"`).join(", "),
    );
  }
  if (missingA.length) {
    failures.push(
      `${missingA.length}/${mainEntity.length} Answer(s) not rendered, for: ` +
        missingA.map((m) => `"${m.slice(0, 50)}"`).join(", "),
    );
  }

  // SECONDARY: the inverse direction — visible surfaces vs schema count.
  const quick = countQuickAnswers(html);
  const pkg = countPackage(html);
  const accordion = countAccordion(html);
  const visible = quick + pkg + accordion;
  // Per-surface, then the sum. The sum alone would pass if every package FAQ
  // were misrouted into the open cards (quick=80, pkg=0) — so the spine bound
  // below is what actually pins the surfaces apart. There is deliberately no
  // bound on `pkg` or `accordion`: their sizes are per-route content (13-71 and
  // 0-N), so any bound would be invented rather than derived.
  if (quick < SPINE_MIN || quick > SPINE_MAX) {
    failures.push(
      `Quick Answers rendered ${quick} cards, expected the spine's ${SPINE_MIN}-${SPINE_MAX} ` +
        `(package FAQs belong in their own folded section, not here)`,
    );
  }
  if (visible !== mainEntity.length) {
    failures.push(
      `visible ${quick} quick-answers + ${pkg} package + ${accordion} accordion = ${visible}, ` +
        `but mainEntity has ${mainEntity.length}`,
    );
  }

  // Pillars are taxonomy labels, never questions. Their reappearance is the
  // specific regression T05B removed.
  const pillarish = mainEntity
    .map((q) => normalizeQuestion(q?.name ?? ""))
    .filter((n) => n.length > 0 && n.length < 40 && !n.includes("?"));
  if (pillarish.length) {
    warnings.push(
      `${pillarish.length} Question name(s) look like pillars, not questions: ` +
        pillarish.map((p) => `"${p}"`).join(", "),
    );
  }

  return { failures, warnings, counts: { quick, pkg, accordion, schema: mainEntity.length } };
}

function checkControl(html) {
  const { nodes, parseError } = extractJsonLd(html);
  if (parseError) return { failures: ["JSON-LD does not parse"], warnings: [] };
  const faq = nodes.find((n) => typeOf(n).includes("FAQPage"));
  if (!faq) return { failures: ["control route lost its FAQPage"], warnings: [] };
  const n = Array.isArray(faq.mainEntity) ? faq.mainEntity.length : 0;
  if (n === 0) return { failures: ["control route FAQPage has no questions"], warnings: [] };
  return { failures: [], warnings: [], counts: { schema: n } };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // Never hand-type slugs. The floors stop a partial read reporting a pass.
  const pdps = [];
  for (const [prefix, floor] of Object.entries(PDP_FLOORS)) {
    const routes = getEcosystemTourPackageRoutes(prefix);
    if (routes.length < floor) {
      console.error(
        `${prefix}: got ${routes.length} routes, floor is ${floor} — refusing to run`,
      );
      process.exit(2);
    }
    for (const r of routes) pdps.push(`/${prefix}/${r.slug}`);
  }

  const targets = [...pdps.map((p) => ({ path: p, kind: "pdp" })), { path: CONTROL_ROUTE, kind: "control" }];
  const results = [];
  let cursor = 0;

  async function worker() {
    while (cursor < targets.length) {
      const t = targets[cursor++];
      const url = `${opts.base}${t.path}`;
      try {
        const res = await get(url, { redirect: "manual" });
        if (res.status !== 200) {
          results.push({ ...t, status: res.status, failures: [`HTTP ${res.status}`], warnings: [] });
          continue;
        }
        const html = await res.text();
        const checked = t.kind === "pdp" ? checkPdp(html) : checkControl(html);
        results.push({ ...t, status: 200, ...checked });
      } catch (e) {
        results.push({
          ...t,
          status: 0,
          failures: [`fetch failed: ${String(e.message ?? e).slice(0, 80)}`],
          warnings: [],
        });
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(opts.concurrency, targets.length) }, worker),
  );

  results.sort((a, b) => a.path.localeCompare(b.path));
  const failed = results.filter((r) => r.failures.length > 0);

  if (!opts.quiet) {
    for (const r of results) {
      const tag = r.failures.length ? "FAIL" : "ok  ";
      const c = r.counts
        ? ` [visible ${(r.counts.quick ?? 0) + (r.counts.pkg ?? 0) + (r.counts.accordion ?? 0)} / schema ${r.counts.schema}]`
        : "";
      console.log(`${tag} ${r.path}${c}`);
      for (const f of r.failures) console.log(`       ${f}`);
      for (const w of r.warnings) console.log(`       warn: ${w}`);
    }
    console.log(
      `\n${results.length - failed.length} pass, ${failed.length} fail ` +
        `(${pdps.length} PDPs + 1 control) against ${opts.base}`,
    );
  }

  if (opts.json) {
    await writeFile(opts.json, `${JSON.stringify({ base: opts.base, results }, null, 2)}\n`);
  }

  // process.exitCode, never process.exit — see the connection:close note above.
  process.exitCode = failed.length > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error(String(e?.stack ?? e));
  process.exitCode = 2;
});
