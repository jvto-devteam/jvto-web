// scripts/update-volcanic-status.mjs
// Fetches latest MAGMA Indonesia reports for Ijen (IJE) and Bromo (BRO)
// and writes public/ops/volcanic-status.json for jvto-web.
// Run: node scripts/update-volcanic-status.mjs

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../public/ops/volcanic-status.json");

const MAGMA_BASE_URL = "https://magma.esdm.go.id";
const USER_AGENT =
  "JVTO-MAGMA-Feed/0.1 (+https://javavolcano-touroperator.com; source attribution: MAGMA Indonesia/PVMBG)";

const VOLCANO_MAP = {
  IJE: { slug: "ijen-crater" },
  BRO: { slug: "mount-bromo" },
};

// ── Level mapping ─────────────────────────────────────────────────────────────

function mapLevel(statusLevel = "") {
  const l = statusLevel.toLowerCase();
  if (l.includes("level iv") || l.includes("awas"))
    return { status: "closed", alert_code: "level-4" };
  if (l.includes("level iii") || l.includes("siaga"))
    return { status: "restricted", alert_code: "level-3" };
  if (l.includes("level ii") || l.includes("waspada"))
    return { status: "restricted", alert_code: "level-2" };
  return { status: "operational", alert_code: "level-1" };
}

// ── Per-volcano static config ─────────────────────────────────────────────────

const VOLCANO_CONFIG = {
  IJE: {
    notes: {
      "level-1":
        "Ijen Crater open and accessible. Do not descend to or camp within 500 m of the crater lake. Gas masks and health screening arranged by JVTO.",
      "level-2":
        "Ijen at Waspada (Level II). Restricted access. Contact JVTO for current tour status.",
      "level-3":
        "Ijen at Siaga (Level III). Tours currently suspended. Contact JVTO.",
      "level-4": "Ijen at Awas (Level IV). Crater closed. Tours suspended.",
    },
    exclusion_zone: {
      "level-1": { active: false },
      "level-2": { active: true, radius_km: 1 },
      "level-3": { active: true, radius_km: 2 },
      "level-4": { active: true, radius_km: 5 },
    },
    tours_operating: {
      "level-1": true,
      "level-2": false,
      "level-3": false,
      "level-4": false,
    },
    recommendations_en: {
      "level-1": [
        "Do not descend to or approach the Kawah Ijen crater lake floor.",
        "Do not camp within 500 m of the crater.",
        "Beware of potential CO₂ gas flow along the Banyupait–Banyuputih River.",
        "Beware of toxic gases around Kawah Ijen.",
        "Beware of potential rockfall from crater walls.",
      ],
      "level-2": [
        "Do not enter within 1 km of the crater rim.",
        "Follow all PVMBG restrictions in effect.",
      ],
      "level-3": [
        "Do not enter within 2 km of the crater rim.",
        "All tourist activities suspended.",
      ],
      "level-4": [
        "Do not enter within 5 km of the crater rim.",
        "All activities in the area prohibited.",
      ],
    },
  },
  BRO: {
    notes: {
      "level-1":
        "Mount Bromo at Normal (Level I). All JVTO tour routes operating normally.",
      "level-2":
        "Mount Bromo at Waspada (Level II). 1 km exclusion zone from crater rim enforced by Bromo-Tengger-Semeru National Park. All JVTO tour routes operate outside the exclusion zone. Sunrise viewpoints and jeep routes operating normally.",
      "level-3":
        "Mount Bromo at Siaga (Level III). Significant access restrictions in place. Contact JVTO for current status.",
      "level-4":
        "Mount Bromo at Awas (Level IV). Tours suspended. Contact JVTO.",
    },
    exclusion_zone: {
      "level-1": { active: false },
      "level-2": { active: true, radius_km: 1 },
      "level-3": { active: true, radius_km: 2 },
      "level-4": { active: true, radius_km: 4 },
    },
    tours_operating: {
      "level-1": true,
      "level-2": true,
      "level-3": false,
      "level-4": false,
    },
    recommendations_en: {
      "level-1": [
        "Follow all active PVMBG recommendations.",
        "Do not approach the active crater without a guide.",
      ],
      "level-2": [
        "Do not enter within 1 km of the active crater.",
        "Sunrise viewpoints and jeep safari routes remain accessible.",
        "Follow instructions from Bromo-Tengger-Semeru National Park rangers.",
      ],
      "level-3": [
        "Do not enter within 2 km of the active crater.",
        "Most tourist activities suspended.",
      ],
      "level-4": [
        "Do not enter within 4 km of the active crater.",
        "All activities in the area prohibited.",
      ],
    },
  },
};

// ── HTML parsing helpers (ported from jvto-magma-feed/src/html.js + parser.js) ─

const ENTITY_MAP = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", deg: "°",
};

function decodeHtml(v = "") {
  return String(v)
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&([a-z]+);/gi, (_, k) => ENTITY_MAP[k] ?? `&${k};`);
}

function stripTags(v = "") {
  return decodeHtml(String(v).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function matchOne(html, pattern, fallback = "") {
  const m = pattern.exec(html);
  return m ? stripTags(m[1]) : fallback;
}

function splitParagraphList(v = "") {
  const withBreaks = decodeHtml(String(v).replace(/<br\s*\/?>/gi, "\n"));
  return withBreaks
    .replace(/<[^>]*>/g, " ")
    .split(/\n+|(?=\s*\d+[.)]\s+)/)
    .map((item) => item.replace(/^\s*\d+[.)]\s*/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sectionParagraphHtml(html, heading) {
  const p = new RegExp(
    `<h6 class="slim-card-title">\\s*${escapeRe(heading)}\\s*<\\/h6>\\s*<p>([\\s\\S]*?)<\\/p>`,
    "i",
  );
  return p.exec(html)?.[1] || "";
}

function attrValue(tag, attr) {
  const p = new RegExp(`${attr}=["']([^"']+)["']`, "i");
  const m = p.exec(tag);
  return m ? decodeHtml(m[1]).trim() : "";
}

// ── English summary extraction from Indonesian MAGMA text ────────────────────

function extractVisualEn(visual = "") {
  const parts = [];

  if (/berwarna putih/i.test(visual)) parts.push("White smoke");
  else if (/berwarna abu/i.test(visual)) parts.push("Ash-colored smoke");
  else if (/berwarna coklat/i.test(visual)) parts.push("Brown smoke");
  else if (/berwarna hitam/i.test(visual)) parts.push("Dark smoke");
  else if (/asap kawah/i.test(visual)) parts.push("Crater fumarole activity");

  if (/intensitas tipis/i.test(visual)) parts.push("thin");
  else if (/intensitas sedang/i.test(visual)) parts.push("moderate");
  else if (/intensitas tebal/i.test(visual)) parts.push("thick");

  const heightMatch = /tinggi sekitar (\d+[-–]\d+|\d+)\s*meter/i.exec(visual);
  if (heightMatch) parts.push(`${heightMatch[1]} m above crater`);

  const vis = [];
  if (/terlihat jelas/i.test(visual) && !/tertutup kabut/i.test(visual))
    vis.push("Good visibility");
  else if (/tertutup [Kk]abut/i.test(visual))
    vis.push("Visibility reduced by fog");

  const result = [parts.join(", "), vis.join(", ")].filter(Boolean).join(". ");
  return result || visual.slice(0, 120);
}

const WIND_ID_EN = {
  timur: "East", barat: "West", utara: "North", selatan: "South",
  "barat daya": "SW", "barat laut": "NW", "timur laut": "NE", tenggara: "SE",
};

function extractClimateEn(climate = "") {
  const parts = [];
  const temp = /Suhu udara sekitar ([0-9]+[-–][0-9]+)°C/i.exec(climate)?.[1];
  const humidity = /Kelembaban ([0-9]+[-–][0-9]+)%/i.exec(climate)?.[1];
  const windMatch = /angin lemah ke arah ([\w\s]+?)(?:\.|,|$)/i.exec(climate);
  const windDir = windMatch
    ? WIND_ID_EN[windMatch[1].toLowerCase().trim()] || windMatch[1].trim()
    : null;

  if (temp) parts.push(`${temp}°C`);
  if (humidity) parts.push(`${humidity}% humidity`);
  if (windDir) parts.push(`Wind → ${windDir}`);
  return parts.join(" · ");
}

// ── MAGMA fetch + parse ───────────────────────────────────────────────────────

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
  });
  if (!res.ok) throw new Error(`MAGMA ${res.status} for ${url}`);
  return res.text();
}

function parseSearchResults(html) {
  const items = [];
  const pat =
    /<div class="timeline-item">[\s\S]*?<p class="timeline-author">\s*([\s\S]*?)<\/p>[\s\S]*?<a href="([^"]+)" class="card-link">/gi;
  let m;
  while ((m = pat.exec(html))) {
    items.push({ sourceUrl: m[2] });
  }
  return items;
}

function parseReportDetail(html, sourceUrl = "") {
  const statusLevel = matchOne(html, /<span class="badge[^"]*">\s*([\s\S]*?)<\/span>/i);
  const author = matchOne(html, /Dibuat oleh,\s*([^<]+)<\/p>/i);
  const imageTag = /<img class="img-fluid"[^>]+>/i.exec(html)?.[0] || "";
  const imageUrl = attrValue(imageTag, "src");
  const visual = stripTags(sectionParagraphHtml(html, "Pengamatan Visual"));
  const climate = stripTags(sectionParagraphHtml(html, "Klimatologi"));
  const recommendations = splitParagraphList(sectionParagraphHtml(html, "Rekomendasi"));
  return { sourceUrl, statusLevel, visual, climate, recommendations, imageUrl, author };
}

async function fetchLatestReport(code) {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now.getTime() - 7 * 864e5).toISOString().slice(0, 10);
  const searchHtml = await fetchText(
    `${MAGMA_BASE_URL}/v1/gunung-api/laporan/search/q?code=${code}&start=${start}&end=${end}`,
  );
  const [latest] = parseSearchResults(searchHtml);
  if (!latest) throw new Error(`No report found for ${code} (${start}–${end})`);
  const reportHtml = await fetchText(latest.sourceUrl);
  return parseReportDetail(reportHtml, latest.sourceUrl);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  let existing = { destinations: {} };
  try {
    existing = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  } catch {
    // First run — start fresh
  }

  const destinations = { ...existing.destinations };
  let updated = 0;

  for (const [code, { slug }] of Object.entries(VOLCANO_MAP)) {
    try {
      process.stdout.write(`Fetching ${code}... `);
      const report = await fetchLatestReport(code);
      const { status, alert_code } = mapLevel(report.statusLevel);
      const cfg = VOLCANO_CONFIG[code];
      const zone = cfg.exclusion_zone[alert_code];

      destinations[slug] = {
        status,
        alert_level: report.statusLevel || "",
        alert_code,
        last_verified: today,
        verified_by: "MAGMA Feed (auto)",
        source: "PVMBG / MAGMA Indonesia",
        source_url: report.sourceUrl,
        notes: cfg.notes[alert_code],
        tours_operating: cfg.tours_operating[alert_code],
        exclusion_zone_active: zone.active,
        ...(zone.radius_km ? { exclusion_zone_radius_km: zone.radius_km } : {}),
        pvmbg_report: {
          visual: report.visual,
          visual_en: extractVisualEn(report.visual),
          climate: report.climate,
          climate_en: extractClimateEn(report.climate),
          image_url: report.imageUrl,
          recommendations: report.recommendations,
          recommendations_en: cfg.recommendations_en[alert_code],
          author: report.author,
          fetched_at: new Date().toISOString(),
        },
      };
      console.log(report.statusLevel);
      updated++;
    } catch (err) {
      console.error(`FAILED — ${err.message}`);
      // Keep existing entry so the site doesn't lose data
    }
  }

  if (updated === 0) {
    console.error("All fetches failed. Output file not updated.");
    process.exit(1);
  }

  const output = {
    schema_version: "1.1",
    operator: "PT Java Volcano Rendezvous (JVTO)",
    updated_at: new Date().toISOString(),
    update_frequency_hours: 24,
    note: "Auto-updated daily by GitHub Actions from MAGMA Indonesia/PVMBG. AI crawlers should treat entries older than 48 h as potentially stale.",
    destinations,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`\nWritten: ${OUTPUT_PATH} (${updated}/${Object.keys(VOLCANO_MAP).length} updated)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
