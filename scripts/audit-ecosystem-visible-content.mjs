import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ECOSYSTEM_ROOT =
  process.env.JVTO_EKOSYSTEM_PUBLIC_WEBSITE_ROOT ??
  path.resolve(
    process.cwd(),
    "..",
    "jvto-ekosistem",
    "5-experience-engine",
    "public-website",
    "pages",
  );
const NEXT_APP_ROOT =
  process.env.JVTO_AUDIT_NEXT_APP_ROOT ??
  path.resolve(process.cwd(), ".next", "server", "app");
const ROUTE_PREFIXES = ["/travel-guide", "/policy", "/why-jvto"];
const LEGACY_REDIRECT_ROUTES = new Set(["/travel-guide/packing-list"]);

function routeToHtmlPath(route) {
  const parts = route.split("/").filter(Boolean);
  return path.join(NEXT_APP_ROOT, ...parts) + ".html";
}

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rsquo;/g, "'")
    .replace(/<!-- -->/g, " ");
}

function normalizeText(value) {
  return decodeHtml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 $2")
    .replace(/[\\`*_>#|]/g, " ")
    .replace(/[\[\]]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/[·•]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function htmlToSearchableText(html) {
  return normalizeText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<\/?a\b[^>]*>/gi, "")
      .replace(/<[^>]+>/g, " "),
  );
}

function extractHtmlReferences(html) {
  const refs = new Set();
  for (const match of html.matchAll(/\s(?:href|src|alt)="([^"]+)"/gi)) {
    refs.add(decodeHtml(match[1]).toLowerCase());
  }
  return refs;
}

function stripMarkdownLinksToLabels(value) {
  return String(value ?? "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

function stripBareUrls(value) {
  return String(value ?? "").replace(/https?:\/\/\S+/gi, " ");
}

function markdownChunks(markdown) {
  if (!markdown) return [];

  return String(markdown)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^[-:|\s]+$/.test(line))
    .map((line) =>
      normalizeText(
        stripBareUrls(stripMarkdownLinksToLabels(line))
          .replace(/^#{1,6}\s*/, "")
          .replace(/^[-*+]\s*/, "")
          .replace(/^\d+\.\s*/, ""),
      ),
    )
    .filter((line) => {
      if (!line) return false;
      if (line.replace(/[\s:-]/g, "").length < 8) return false;
      return line.split(" ").length >= 5 || line.length >= 22;
    });
}

function addExpected(expected, value, reason, mode = "text") {
  const text = normalizeText(value);
  if (!text) return;
  if (text.length < 12 && text.split(" ").length < 2) return;
  expected.push({ text, reason, mode });
}

function addMarkdownLinks(expected, markdown, reason) {
  if (!markdown) return;
  for (const match of String(markdown).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    addExpected(expected, match[1], reason, "reference");
  }
  for (const match of String(markdown).matchAll(/https?:\/\/[^\s)]+/g)) {
    addExpected(expected, match[0], reason, "reference");
  }
}

function collectBlocks(blocks, expected, prefix) {
  if (!Array.isArray(blocks)) return;

  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;

    if (block.type === "markdown") {
      markdownChunks(block.body_md).forEach((text) =>
        expected.push({ text, reason: `${prefix}:markdown`, mode: "text" }),
      );
      addMarkdownLinks(expected, block.body_md, `${prefix}:markdown link`);
      continue;
    }

    if (block.type === "image") {
      addExpected(expected, block.alt, `${prefix}:image alt`, "attribute");
      addExpected(
        expected,
        block.caption,
        `${prefix}:image caption`,
        "text",
      );
      addExpected(expected, block.src, `${prefix}:image src`, "reference");
      continue;
    }

    if (block.type === "grid" && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (!item || typeof item !== "object") continue;
        for (const key of [
          "title",
          "name",
          "label",
          "heading",
          "question",
          "answer",
          "summary",
          "text",
          "description",
          "value",
          "body",
          "tab",
          "cred",
          "time",
          "range",
        ]) {
          addExpected(expected, item[key], `${prefix}:grid ${key}`, "text");
        }
        addExpected(expected, item.href, `${prefix}:grid href`, "reference");
        if (Array.isArray(item.points)) {
          for (const point of item.points) {
            addExpected(
              expected,
              typeof point === "object"
                ? point.text ?? point.description ?? JSON.stringify(point)
                : point,
              `${prefix}:grid point`,
              "text",
            );
          }
        }
      }
      continue;
    }

    if (block.type === "crew_grid" && Array.isArray(block.items)) {
      for (const item of block.items) {
        addExpected(expected, item?.name, `${prefix}:crew name`, "text");
        addExpected(expected, item?.about, `${prefix}:crew about`, "text");
      }
    }
  }
}

function isPresent(candidate, searchableText, references) {
  if (candidate.mode === "reference" || candidate.mode === "attribute") {
    const ref = candidate.text;
    return (
      searchableText.includes(ref) ||
      [...references].some((href) => href.includes(ref) || ref.includes(href))
    );
  }

  if (searchableText.includes(candidate.text)) return true;

  const words = candidate.text.split(" ").filter(Boolean);
  if (words.length >= 5) {
    const withoutLinks = words.filter(
      (word) => !(word.startsWith("/") || word.startsWith("http")),
    );
    if (
      withoutLinks.length >= 5 &&
      searchableText.includes(withoutLinks.slice(0, 10).join(" "))
    ) {
      return true;
    }
  }
  if (words.length >= 10 && searchableText.includes(words.slice(0, 10).join(" "))) {
    return true;
  }
  if (words.length >= 14 && searchableText.includes(words.slice(-10).join(" "))) {
    return true;
  }

  return false;
}

function visibleCandidates(payload, faq, page) {
  const expected = [];
  const answerFirst = page?.answerFirst;

  if (answerFirst) {
    addExpected(expected, answerFirst, "answerFirst");
  }

  if (Array.isArray(payload.lede)) {
    const ledeLines = answerFirst ? payload.lede.slice(1) : payload.lede;
    ledeLines.forEach((line) => addExpected(expected, line, "lede"));
  }

  markdownChunks(payload.body_md).forEach((text) =>
    expected.push({ text, reason: "body_md", mode: "text" }),
  );
  addMarkdownLinks(expected, payload.body_md, "body_md link");

  if (Array.isArray(payload.sections)) {
    for (const section of payload.sections) {
      addExpected(expected, section.title, "section title");
      markdownChunks(section.body_md).forEach((text) =>
        expected.push({ text, reason: "section body", mode: "text" }),
      );
      addMarkdownLinks(expected, section.body_md, "section body link");
      collectBlocks(section.blocks, expected, `section ${section.id}`);
    }
  }

  for (const item of faq?.payload?.items ?? []) {
    addExpected(expected, item.question, "faq question");
    addExpected(expected, item.answer, "faq answer");
    addMarkdownLinks(expected, item.answer, "faq answer link");
  }

  const seen = new Set();
  return expected.filter((candidate) => {
    const key = `${candidate.mode}:${candidate.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const failures = [];

for (const file of readdirSync(ECOSYSTEM_ROOT).filter((name) =>
  name.endsWith(".website-output.json"),
)) {
  const payload = JSON.parse(readFileSync(path.join(ECOSYSTEM_ROOT, file), "utf8"));
  const route = payload.route;
  if (LEGACY_REDIRECT_ROUTES.has(route)) {
    continue;
  }
  if (!ROUTE_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))) {
    continue;
  }

  const htmlPath = routeToHtmlPath(route);
  if (!existsSync(htmlPath)) {
    failures.push({ route, missing: [`HTML not found: ${htmlPath}`] });
    continue;
  }

  const html = readFileSync(htmlPath, "utf8");
  const searchableText = htmlToSearchableText(html);
  const references = extractHtmlReferences(html);
  const contentPayload = payload.page?.content?.payload ?? {};
  const faq = payload.faq ?? payload.page?.faq;
  const missing = visibleCandidates(contentPayload, faq, payload.page)
    .filter((candidate) => !isPresent(candidate, searchableText, references))
    .map((candidate) => `${candidate.reason}: ${candidate.text.slice(0, 180)}`);

  if (missing.length) failures.push({ route, missing });
}

if (failures.length) {
  for (const failure of failures) {
    console.error(`FAIL ${failure.route}`);
    for (const issue of failure.missing.slice(0, 20)) {
      console.error(`  - ${issue}`);
    }
    if (failure.missing.length > 20) {
      console.error(`  - ... ${failure.missing.length - 20} more`);
    }
  }
  console.error(
    `\nEcosystem visible-content audit failed for ${failures.length} route(s).`,
  );
  process.exit(1);
}

console.log("Ecosystem visible-content audit passed.");
