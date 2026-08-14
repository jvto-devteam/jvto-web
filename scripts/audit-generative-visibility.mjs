const BASE_URL = (
  process.env.GEO_AUDIT_BASE_URL ?? "https://javavolcano-touroperator.com"
).replace(/\/$/, "");

const CRITICAL_AI_BOTS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
];

const ROUTES = [
  "/",
  "/tours",
  "/destinations",
  "/why-jvto",
  "/policy",
  "/travel-guide",
  "/verify-jvto",
  "/tours/from-surabaya",
  "/tours/from-bali",
  "/markets/malaysia",
  "/markets/singapore",
];

const GENERIC_H1 = new Set(["all destinations tours", "destinations", "tours"]);

function parseRobotsGroups(robotsText) {
  const groups = [];
  let current = null;

  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) continue;
    const [rawKey, ...rawValueParts] = line.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValueParts.join(":").trim();
    if (!key || !value) continue;

    if (key === "user-agent") {
      current = { userAgent: value.toLowerCase(), rules: [] };
      groups.push(current);
      continue;
    }
    if (!current) continue;
    if (key === "allow" || key === "disallow") {
      current.rules.push({ directive: key, path: value });
    }
  }

  return groups;
}

function botAccess(robotsText, bot) {
  const groups = parseRobotsGroups(robotsText);
  const normalizedBot = bot.toLowerCase();
  const matched = groups.filter(
    (group) => group.userAgent === normalizedBot || group.userAgent === "*",
  );
  const exactMatched = matched.filter((group) => group.userAgent === normalizedBot);
  const applicable = exactMatched.length ? exactMatched : matched;
  const rootRules = applicable.flatMap((group) =>
    group.rules.filter((rule) => rule.path === "/" || rule.path === ""),
  );
  const hasDisallowRoot = rootRules.some(
    (rule) => rule.directive === "disallow" && rule.path === "/",
  );
  const hasAllowRoot = rootRules.some(
    (rule) => rule.directive === "allow" && rule.path === "/",
  );

  return {
    bot,
    allowed: hasAllowRoot || !hasDisallowRoot,
    hasAllowRoot,
    hasDisallowRoot,
    ambiguous: hasAllowRoot && hasDisallowRoot,
  };
}

function extractMeta(html, name) {
  const pattern = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`,
    "i",
  );
  return html.match(pattern)?.[1] ?? "";
}

function extractH1(html) {
  return (
    html
      .match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function firstWords(text, limit) {
  return text.split(/\s+/).slice(0, limit).join(" ");
}

function factSignals(text) {
  const patterns = [
    /\b\d+(?:[.,]\d+)?\s?(?:★|m|km|kg|pax|guests?|reviews?|routes?|days?|hours?)\b/gi,
    /\bIDR\s?\d+(?:[.,]\d+)?\s?M?\b/gi,
    /\bNIB\s?\d+/gi,
    /\bTDUP\b/gi,
    /\bBBKSDA\b/gi,
    /\bBSrE\b/gi,
    /\bSE\.\d+/gi,
    /\bTrustpilot\b/gi,
    /\bTourist Police\b/gi,
    /\bSurabaya\b/gi,
    /\bBali\b/gi,
    /\bSingapore\b/gi,
    /\bMalaysia\b/gi,
    /\bHong Kong\b/gi,
    /\bTaiwan\b/gi,
  ];
  return patterns.reduce((count, pattern) => count + (text.match(pattern) ?? []).length, 0);
}

async function fetchText(pathname, init = {}) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    headers: { "cache-control": "no-cache", ...(init.headers ?? {}) },
    ...init,
  });
  return { response, text: await response.text() };
}

const failures = [];
const warnings = [];

const robots = await fetchText("/robots.txt");
if (!robots.response.ok) {
  failures.push(`robots.txt returned HTTP ${robots.response.status}`);
}

const botMatrix = CRITICAL_AI_BOTS.map((bot) => botAccess(robots.text, bot));
for (const item of botMatrix) {
  if (!item.allowed || item.hasDisallowRoot) {
    failures.push(
      `${item.bot} is not cleanly allowed in robots.txt (allow=${item.hasAllowRoot}, disallow=${item.hasDisallowRoot})`,
    );
  }
  if (item.ambiguous) {
    warnings.push(`${item.bot} has both Allow and Disallow for /`);
  }
}

const rows = [];
for (const route of ROUTES) {
  const { response, text: html } = await fetchText(route);
  const text = visibleText(html);
  const first120 = firstWords(text, 120);
  const description = extractMeta(html, "description");
  const robotsMeta = extractMeta(html, "robots");
  const h1 = extractH1(html);
  const row = {
    route,
    status: response.status,
    contentSignal: response.headers.get("content-signal") ?? "",
    h1,
    descriptionLength: description.length,
    maxSnippet: robotsMeta.includes("max-snippet:-1"),
    first120FactSignals: factSignals(first120),
    hasLastReviewed:
      /last\s+(reviewed|updated)\s+(?:\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{4})/i.test(text),
  };
  rows.push(row);

  if (response.status !== 200) failures.push(`${route} returned HTTP ${response.status}`);
  if (row.contentSignal !== "search=yes,ai-train=no,use=reference") {
    failures.push(`${route} missing expected Content-Signal header`);
  }
  if (!row.maxSnippet) failures.push(`${route} missing max-snippet:-1`);
  if (!h1 || GENERIC_H1.has(h1.toLowerCase())) warnings.push(`${route} has generic or missing H1: "${h1}"`);
  if (description.length < 120 || description.length > 170) {
    warnings.push(`${route} meta description length is ${description.length}`);
  }
  if (row.first120FactSignals < 3) {
    warnings.push(`${route} has only ${row.first120FactSignals} fact signals in first 120 words`);
  }
  if (["/tours", "/destinations", "/why-jvto", "/policy", "/travel-guide"].includes(route) && !row.hasLastReviewed) {
    warnings.push(`${route} does not expose a Last reviewed marker`);
  }
}

console.log(JSON.stringify(
  {
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    robots: botMatrix,
    routes: rows,
    warnings,
    failures,
  },
  null,
  2,
));

if (failures.length) {
  process.exitCode = 1;
}
