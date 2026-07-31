// scripts/lib/contentDriftRules.mjs
// SINGLE SOURCE OF TRUTH for the canonical-facts content-drift denylist.
// Pure, zero-dependency ESM (no fs / no node built-ins) so it can be imported by
// BOTH the CLI gate (scripts/validate-content-drift.mjs, via `node`) AND the
// runtime admin gate (src/app/(api)/api/content-validate/route.ts, bundled by
// Next). Kept under scripts/ (NOT src/) on purpose: the RULES regex sources
// literally contain forbidden strings ("112", "blue fire…guarantee", "30% deposit"),
// and the validator only scans src/ + root *-config.json + public/llms*.txt +
// CANONICAL_FACTS.md — so a rules file inside src/ would self-trigger the scan.
//
// Enforces docs/CANONICAL_FACTS.md. Every hit of any rule on a non-whitelisted
// line = a violation. A line containing `drift-ok:` is whitelisted.

export const WHITELIST_MARKER = "drift-ok:";

export const RULES = [
  {
    name: "stale-address-linebreak",
    re: /Banyuwangi, East Java,\s*<br/i,
  },
  {
    name: "stale-review-counts",
    // canonical: Trustpilot 4.8/51 · Google 4.9/123 · TripAdvisor 4.95/21 · cross-platform 4.8/195
    // Bare 112/92 as review counts (e.g. `reviewCount: 112`, "112 reviews") are
    // forbidden values per the facts lock, not just the "112+" / compound forms.
    re: /\b112\+|4\.9\s*\/\s*5 · 92|47 reviews|5\.0\s*\/\s*5\b|reviewCount["'\s:=]*11[2]\b|reviewCount["'\s:=]*92\b|4\.9\s*\/\s*112\b|\b112\s*reviews?\b|\b92\s*reviews?\b/i,
  },
  {
    name: "wrong-founding-year",
    // canonical foundingDate/since = 2015 (docs/CANONICAL_FACTS.md). 2023 is
    // legitimate for legal/PT-formalization context (e.g. "TDUP issued
    // 2023-02-11") but forbidden specifically as a foundingDate value — so
    // only that alternative gains |23, not "incorporated"/"EST".
    //
    // Widened 2026-07-31: "incorporated 20XX" alone missed prose like "Mr. Sam
    // incorporated PT Java Volcano Rendezvous on 2016-01-01" — same word, just
    // not adjacent to the year. Added a within-one-sentence variant.
    re: /incorporated 20(16|19|20)|incorporated[^.]{0,60}20(16|19|20)\b|EST\.? 20(16|19|20)|foundingDate["']?\s*[:=]\s*["']20(16|19|20|23)/i,
  },
  {
    name: "brand-config-json-pattern",
    // retired root jvto-config.json duplicate brand-config shape — must never reappear
    re: /"sinceOperational"|"incorporated":\s*"?20\d\d/,
  },
  {
    name: "blue-fire-guarantee",
    // blue fire = natural phenomenon, cannot be guaranteed
    // Both orders: "blue fire … guaranteed" and "100% / guaranteed … blue fire".
    re: /[Bb]lue\s*[Ff]ire[^.]{0,40}(guarantee|100%)|(guarantee|100%)[^.]{0,40}[Bb]lue\s*[Ff]ire/,
    // CANONICAL_FACTS.md mandates the negated form ("cannot be guaranteed"), which the
    // bare `re` above would itself flag — that false positive is why the OKF snapshot got
    // hand-edited to "cannot be promised", diverging from upstream. Allow the negated
    // form so syncing OKF verbatim stays lossless; positive claims still fail.
    // (?:\s|\\n|\\r) also matches a literal two-char `\n`/`\r` escape sequence —
    // JSON string values (e.g. src/data/okf/policy-cards.json) sometimes embed
    // markdown line breaks as literal backslash-n inside one physical file line.
    allow: /\b(cannot|can ?not|can't|never|not|no|isn't|aren't)(?:\s|\\n|\\r)+(be(?:\s|\\n|\\r)+)?guarantee/i,
  },
  {
    name: "stale-conditional-health-wording",
    // Ijen health screening is MANDATORY (adjudicated 2026-07-06, supersedes the prior
    // conditional decision) — catches the old "when BBKSDA rules require it" / "can
    // require" / "— conditional" framing so it can't silently regress.
    //
    // Widened 2026-07-31: the original window (`When` within 15 chars of `BBKSDA`) was
    // too tight and missed both phrasings actually shipping on /travel-guide/* —
    // "When the East Java conservation authority (BBKSDA) requires it" (36 chars) and
    // "...certificate when their regulations are in effect" (no BBKSDA token at all).
    re: /health screening.{0,15}conditional|conditional.{0,15}health|can require a[^.]{0,25}health certificate|[Ww]hen[^.]{0,60}BBKSDA[^.]{0,40}(require|rules)|when (it|access rules?) (applies|require)|(screening|certificate)[^.]{0,60}(when|where)[^.]{0,40}(require|regulations?|rules?)|(when|where)[^.]{0,40}(regulations?|rules?)[^.]{0,20}(in effect|apply|applies)/i,
  },
  {
    name: "non-idr-currency",
    // prices are IDR-only, format `IDR 1,550,000/person`
    re: /\$\s?\d|EUR\s?\d|USD\s?\d{2,}|Rp\s?\d/,
  },
  {
    name: "stale-deposit-terms",
    // canonical: 20% deposit; cancellation = 100% Lifetime Package Credit
    re: /30% deposit|balance[^.]{0,20}at pickup/i,
  },
  {
    name: "stale-group-threshold",
    // police-escort threshold is ~18 guests, not 6. \b guards on both sides
    // of the digit so "16+ guest reviews" / "party of 60" don't false-hit,
    // and "group" is singular-or-plural to catch "Group of 6+?" headings.
    re: /[Gg]roups? of 6\b|\b6\+ ?(guests?|travel(l)?ers?|people|pax)/,
  },
  {
    name: "unverified-press-names",
    re: /Trip\.com|Travel \+ Leisure|Cond[eé] Nast/,
  },
];

/** Collapse whitespace + cap length for a readable matched-text preview. */
export function truncate(text, max = 80) {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? oneLine.slice(0, max - 1) + "…" : oneLine;
}

/**
 * Scan in-memory text against every rule. Returns an array of
 * { rel, line, rule, text } hits. `rel` is a caller-supplied label (a file path
 * for the CLI, or e.g. '<stdin-draft>' for the runtime gate). Pure — no I/O.
 */
export function scanText(content, rel) {
  const hits = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(WHITELIST_MARKER)) continue;
    for (const rule of RULES) {
      // Rule-level escape hatch: a line matching `allow` is exempt from THIS rule only.
      // Line-granular by design — a line mixing an allowed phrasing with a real
      // violation is exempted, which is the accepted trade for letting canonical
      // negated wording ("cannot be guaranteed") through unmodified.
      if (rule.allow && rule.allow.test(line)) continue;
      const m = rule.re.exec(line);
      if (m) hits.push({ rel, line: i + 1, rule: rule.name, text: truncate(m[0]) });
    }
  }
  return hits;
}
