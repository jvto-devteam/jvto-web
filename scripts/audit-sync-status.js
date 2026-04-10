/**
 * audit-sync-status.js
 *
 * Laporan lengkap status sinkronisasi antara SSOT JSON dan database jvto_dev.
 * Run: node scripts/audit-sync-status.js
 *
 * Read-only: tidak mengubah apapun.
 */

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev";

const SSOT_PATH = path.resolve(__dirname, "../JVTO_SSOT_v4_0_CLEAN.json");

const W = (s) => process.stdout.write(s);
const HR = (char = "─", len = 72) => console.log(char.repeat(len));
const H1 = (t) => { HR("═"); console.log(`  ${t}`); HR("═"); };
const H2 = (t) => { console.log(`\n${t}`); HR("─"); };

// ─── Field-level null check ───────────────────────────────────────────────────
function isBlank(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

async function run() {
  const ssot = JSON.parse(fs.readFileSync(SSOT_PATH, "utf8"));
  const c = new Client({ connectionString: DB_URL, connectionTimeoutMillis: 15000 });
  await c.connect();

  H1("JVTO SYNC AUDIT REPORT");
  console.log(`  SSOT : ${SSOT_PATH}`);
  console.log(`  DB   : jvto_dev @ 31.97.223.43`);
  console.log(`  Date : ${new Date().toISOString()}`);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. CREW
  // ══════════════════════════════════════════════════════════════════════════
  H2("1. CREW");

  const ssotCrew = ssot.crew_registry || [];
  const dbCrewRows = await c.query(
    "SELECT id, code, name, full_name, facebook_url, instagram_url, photo_url, about_me, phone, tags, type FROM crew_members WHERE deleted_at IS NULL ORDER BY id"
  );
  const dbCrew = dbCrewRows.rows;

  console.log(`  SSOT crew_registry : ${ssotCrew.length} entries`);
  console.log(`  DB   crew_members  : ${dbCrew.length} rows`);

  // Match SSOT ↔ DB (same partial matching as sync scripts)
  const crewGaps = [];
  for (const sc of ssotCrew) {
    const scNameLower = sc.name?.toLowerCase() || "";
    const scFirstWord = scNameLower.split(/[\s(]/)[0];
    const dc = dbCrew.find(
      (r) =>
        (r.code && r.code === sc.id) ||
        r.name?.toLowerCase() === scNameLower ||
        r.full_name?.toLowerCase() === scNameLower ||
        (scFirstWord.length >= 3 && r.name?.toLowerCase() === scFirstWord) ||
        (scFirstWord.length >= 4 && r.name?.toLowerCase().startsWith(scFirstWord))
    );

    const fb = sc.social_links?.facebook || null;
    const ig = sc.social_links?.instagram || null;
    const img = sc.profile_snapshot?.image_url || null;
    const phone = sc.internal_contact?.phone || null;
    const selfQuote = Array.isArray(sc.self_quote) ? sc.self_quote[0] : (sc.self_quote || null);
    const archTags = Array.isArray(sc.archetype_tags) ? sc.archetype_tags.join(", ") : null;

    const gaps = [];
    if (!dc) {
      gaps.push("❌ NOT IN DB");
    } else {
      if (fb && isBlank(dc.facebook_url)) gaps.push("facebook_url");
      if (ig && isBlank(dc.instagram_url)) gaps.push("instagram_url");
      if (img && isBlank(dc.photo_url)) gaps.push("photo_url");
      if (phone && isBlank(dc.phone)) gaps.push("phone");
      if (selfQuote && isBlank(dc.about_me)) gaps.push("about_me");
      if (archTags && isBlank(dc.tags)) gaps.push("tags");
    }

    crewGaps.push({ ssot: sc, db: dc, gaps, fb, ig, img, phone, selfQuote, archTags });
  }

  const crewWithGaps = crewGaps.filter((x) => x.gaps.length > 0);
  console.log(`\n  Crew yang perlu update di DB: ${crewWithGaps.length}/${ssotCrew.length}`);

  for (const { ssot: sc, gaps } of crewGaps) {
    if (gaps.length === 0) {
      console.log(`  ✅  ${sc.name} (${sc.role})`);
    } else {
      console.log(`  ⚠️   ${sc.name} (${sc.role}) — missing: ${gaps.join(", ")}`);
    }
  }

  // Check crew_member_roles
  const roleRows = await c.query("SELECT id, name FROM crew_roles WHERE deleted_at IS NULL");
  const dbRoles = roleRows.rows;
  const crewRoleRows = await c.query(
    "SELECT cm.name, cr.name as role FROM crew_member_roles cmr JOIN crew_members cm ON cm.id=cmr.crew_member_id JOIN crew_roles cr ON cr.id=cmr.crew_role_id WHERE cm.deleted_at IS NULL"
  );
  // Fuzzy role match: SSOT "Guide" → DB role name containing "guide" (excl "driver cum guide")
  //                   SSOT "Driver" → DB role name containing "driver"
  function roleMatches(ssotRole, dbRoleName) {
    const sl = (ssotRole || "").toLowerCase();
    const dl = (dbRoleName || "").toLowerCase();
    if (sl === "guide") return dl.includes("guide") && !dl.startsWith("driver");
    if (sl === "driver") return dl.includes("driver");
    return sl === dl;
  }
  const crewWithoutRole = crewGaps.filter(({ ssot: sc, db: dc }) => {
    if (!dc || !sc.role) return false;
    // Check if this crew has any matching role assigned in DB
    return !crewRoleRows.rows.some(
      (r) => {
        const scNameLower2 = sc.name?.toLowerCase() || "";
        const scFirst2 = scNameLower2.split(/[\s(]/)[0];
        const nameMatch =
          r.name?.toLowerCase() === scNameLower2 ||
          (scFirst2.length >= 3 && r.name?.toLowerCase() === scFirst2) ||
          (scFirst2.length >= 4 && r.name?.toLowerCase().startsWith(scFirst2));
        return nameMatch && roleMatches(sc.role, r.role);
      }
    );
  });
  console.log(`\n  DB crew_roles available: ${dbRoles.map((r) => r.name).join(", ")}`);
  console.log(`  Crew tanpa role assignment di DB: ${crewWithoutRole.length}`);
  for (const { ssot: sc } of crewWithoutRole) {
    console.log(`    → ${sc.name} (role SSOT: ${sc.role})`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. DESTINATIONS
  // ══════════════════════════════════════════════════════════════════════════
  H2("2. DESTINATIONS");

  const ssotDests = ssot.destinations || [];
  const dbDestRows = await c.query(
    `SELECT id, name, slug, short_slug, altitude, area_hectares, terrain,
     best_time_to_visit, difficulty_level, duration, physical_demand,
     cultural_depth, photo_potential, temperature_range, summary, highlight,
     permit_required, permit_details, guide_required, seo_title, seo_description,
     tags, "types", featured, published, local_tribes, rituals_festivals,
     description, trail_details, main_attractions, key_highlights, facilities,
     safety_notes, risk_factors, environmental_factors, emergency_contacts,
     physical_requirements, cultural_context, tips_for_visitors
     FROM destinations WHERE deleted_at IS NULL ORDER BY id`
  );
  const dbDests = dbDestRows.rows;

  console.log(`  SSOT destinations : ${ssotDests.length} entries`);
  console.log(`  DB   destinations : ${dbDests.length} rows`);

  // SSOT → DB gaps
  const SSOT_TO_DB_FIELDS = [
    ["altitude_masl", "altitude"],
    ["area_hectares", "area_hectares"],
    ["terrain", "terrain"],
    ["best_time_to_visit", "best_time_to_visit"],
    ["difficulty_level", "difficulty_level"],
    ["duration", "duration"],
    ["physical_demand", "physical_demand"],
    ["cultural_depth", "cultural_depth"],
    ["photo_potential", "photo_potential"],
    ["temperature_range", "temperature_range"],
    ["summary", "summary"],
    ["highlight", "highlight"],
    ["permit_details", "permit_details"],
    ["seo_title", "seo_title"],
    ["seo_description", "seo_description"],
  ];

  // DB → SSOT back-fill fields
  const DB_TO_SSOT_FIELDS = [
    "description", "trail_details", "main_attractions", "key_highlights",
    "facilities", "safety_notes", "risk_factors", "environmental_factors",
    "emergency_contacts", "physical_requirements", "cultural_context", "tips_for_visitors"
  ];

  console.log("\n  [SSOT → DB] Gaps per destination:");
  let totalSsotToDbGaps = 0;
  for (const sd of ssotDests) {
    const dd = dbDests.find((r) => String(r.id) === String(sd.db_id));
    if (!dd) {
      console.log(`  ❌  ${sd.name} — NOT IN DB (db_id=${sd.db_id})`);
      continue;
    }
    const missing = [];
    for (const [sf, df] of SSOT_TO_DB_FIELDS) {
      if (!isBlank(sd[sf]) && isBlank(dd[df])) missing.push(`${sf}→${df}`);
    }
    // Check booleans explicitly
    if (sd.permit_required !== null && sd.permit_required !== undefined && dd.permit_required === null) missing.push("permit_required");
    if (sd.guide_required !== null && sd.guide_required !== undefined && dd.guide_required === null) missing.push("guide_required");
    if (sd.featured !== null && sd.featured !== undefined && dd.featured === null) missing.push("featured");
    if (sd.published !== null && sd.published !== undefined && dd.published === null) missing.push("published");
    // tags
    if (Array.isArray(sd.tags) && sd.tags.length > 0 && (!dd.tags || dd.tags.length === 0)) missing.push("tags[]");
    // types
    if (Array.isArray(sd.types) && sd.types.length > 0 && isBlank(dd.types)) missing.push("types");
    // local_tribes
    if (Array.isArray(sd.local_tribes) && sd.local_tribes.length > 0 && (!dd.local_tribes || dd.local_tribes.length === 0)) missing.push("local_tribes[]");
    // rituals
    if (Array.isArray(sd.rituals) && sd.rituals.length > 0 && isBlank(dd.rituals_festivals)) missing.push("rituals_festivals");

    totalSsotToDbGaps += missing.length;
    if (missing.length === 0) {
      console.log(`  ✅  ${sd.name}`);
    } else {
      console.log(`  ⚠️   ${sd.name} — ${missing.length} fields: ${missing.join(", ")}`);
    }
  }
  console.log(`\n  Total SSOT→DB field gaps: ${totalSsotToDbGaps}`);

  console.log("\n  [DB → SSOT] Back-fill gaps per destination:");
  let totalDbToSsotGaps = 0;
  for (const sd of ssotDests) {
    const dd = dbDests.find((r) => String(r.id) === String(sd.db_id));
    if (!dd) continue;
    const missing = [];
    // slug fix
    if (isBlank(sd.slug) && !isBlank(dd.slug)) missing.push("slug");
    for (const f of DB_TO_SSOT_FIELDS) {
      if (!isBlank(dd[f]) && isBlank(sd[f])) missing.push(f);
    }
    totalDbToSsotGaps += missing.length;
    if (missing.length === 0) {
      console.log(`  ✅  ${sd.name}`);
    } else {
      console.log(`  ⚠️   ${sd.name} — ${missing.length} fields: ${missing.join(", ")}`);
    }
  }
  console.log(`\n  Total DB→SSOT field gaps: ${totalDbToSsotGaps}`);

  // Destination gears
  const gearRows = await c.query("SELECT destination_id, gear, type FROM destination_gears");
  const dbGears = gearRows.rows;
  console.log("\n  Destination gears in DB:", dbGears.length, "total rows");
  let gearGaps = 0;
  for (const sd of ssotDests) {
    const gearsRaw = sd.gear_provided_by_jvto || [];
    if (gearsRaw.length === 0) continue;
    const existing = dbGears.filter((g) => String(g.destination_id) === String(sd.db_id));
    const existingNames = new Set(existing.map((e) => e.gear));
    const missingNames = gearsRaw
      .map((g) => (typeof g === "object" ? g.gear : g))
      .filter((gName) => gName && !existingNames.has(gName));
    if (missingNames.length > 0) {
      gearGaps += missingNames.length;
      console.log(`    ⚠️  ${sd.name}: ${missingNames.length} gears missing — ${missingNames.join(", ")}`);
    }
  }
  if (gearGaps === 0) console.log("  ✅  Semua gear destinations sudah ada di DB");

  // ══════════════════════════════════════════════════════════════════════════
  // 3. ORGANIZATION
  // ══════════════════════════════════════════════════════════════════════════
  H2("3. ORGANIZATION");

  const ssotOrg = ssot.organization || {};
  const orgRow = await c.query("SELECT * FROM organization_profile LIMIT 1");
  const dbOrg = orgRow.rows[0];

  if (!dbOrg) {
    console.log("  ❌  organization_profile — NO ROWS IN DB");
  } else {
    console.log("  ✅  organization_profile row exists (id=" + dbOrg.id + ")");
    const ORG_FIELDS = [
      ["legal_name", "legal_name"],
      ["brand_name", "brand_name"],
      ["alternate_name", "alternate_name"],
      ["founding_date", "founding_date"],
      ["description", "description"],
      ["price_range", "price_range"],
      ["contact_phone", "contact_phone"],
      ["website_url", "website_url"],
      ["logo_url", "logo_url"],
      ["hero_image_url", "hero_image_url"],
    ];
    const orgMissing = [];
    for (const [sf, df] of ORG_FIELDS) {
      const sv = ssotOrg[sf];
      if (!isBlank(sv) && isBlank(dbOrg[df])) orgMissing.push(`${sf}→${df}`);
    }
    // contact_email
    const emailSrc = ssotOrg.contact_email || ssotOrg.contact_emails?.primary;
    if (!isBlank(emailSrc) && isBlank(dbOrg.contact_email)) orgMissing.push("contact_email");
    // available_languages
    if (Array.isArray(ssotOrg.available_languages) && (!dbOrg.available_languages || dbOrg.available_languages.length === 0)) orgMissing.push("available_languages");
    // address_json
    if (!isBlank(ssotOrg.address_json) && isBlank(dbOrg.address_json)) orgMissing.push("address_json");
    // same_as_urls
    if (Array.isArray(ssotOrg.same_as_urls) && (!dbOrg.same_as_urls || dbOrg.same_as_urls.length === 0)) orgMissing.push("same_as_urls");
    // schema_json
    if (!isBlank(ssotOrg.schema_json) && isBlank(dbOrg.schema_json)) orgMissing.push("schema_json");

    if (orgMissing.length === 0) {
      console.log("  ✅  organization_profile fully populated");
    } else {
      console.log(`  ⚠️   ${orgMissing.length} fields kosong di DB: ${orgMissing.join(", ")}`);
    }
  }

  // site_identity — full check
  const siteRow = await c.query("SELECT * FROM site_identity LIMIT 1");
  const dbSite = siteRow.rows[0];
  const ssotVerCreds = ssot.verification_credentials || [];
  const ssotOrg2 = ssot.organization || {};
  let siteIdentityGaps = 0;
  if (!dbSite) {
    console.log("  ❌  site_identity — NO ROWS IN DB");
    siteIdentityGaps = 99;
  } else {
    // Parse JSON fields helper
    function parseSiField(v) {
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") return v;
      if (typeof v === "string" && v !== "[]" && v !== "{}") { try { return JSON.parse(v); } catch (_) {} }
      return null;
    }
    function isEmptyJsonField(v) {
      const p = parseSiField(v);
      if (!p) return true;
      if (Array.isArray(p) && p.length === 0) return true;
      if (typeof p === "object" && !Array.isArray(p) && Object.keys(p).length === 0) return true;
      return false;
    }

    const siChecks = [
      ["registration_ids (14 creds)", !isEmptyJsonField(dbSite.registration_ids) && parseSiField(dbSite.registration_ids)?.length >= ssotVerCreds.length],
      ["official_emails", !isEmptyJsonField(dbSite.official_emails)],
      ["official_whatsapp_numbers", !isEmptyJsonField(dbSite.official_whatsapp_numbers)],
      ["maps_listings", !isEmptyJsonField(dbSite.maps_listings)],
      ["association_memberships", !isEmptyJsonField(dbSite.association_memberships)],
      ["office_address", !isEmptyJsonField(dbSite.office_address)],
      ["google_business_profile_url", !isBlank(dbSite.google_business_profile_url)],
      ["brand_positioning", !isEmptyJsonField(dbSite.brand_positioning)],
      ["founder", !isEmptyJsonField(dbSite.founder)],
      ["org_schema_json_ld", !isBlank(dbSite.org_schema_json_ld)],
      ["brand_name", !isBlank(dbSite.brand_name)],
      ["legal_entity_name", !isBlank(dbSite.legal_entity_name)],
      ["official_website_url", !isBlank(dbSite.official_website_url)],
    ];
    const siMissing = siChecks.filter(([, ok]) => !ok).map(([name]) => name);
    siteIdentityGaps = siMissing.length;
    if (siMissing.length === 0) {
      console.log("  ✅  site_identity — semua field populated");
    } else {
      console.log(`  ⚠️   site_identity — ${siMissing.length} fields kosong: ${siMissing.join(", ")}`);
    }

    // Registration IDs (credentials) sub-check
    const regIdsRaw = parseSiField(dbSite.registration_ids) || [];
    const existingIds = new Set(regIdsRaw.map((x) => x.id));
    const missingCreds = ssotVerCreds.filter((vc) => !existingIds.has(vc.id));
    if (missingCreds.length === 0) {
      console.log(`  ✅  site_identity.registration_ids: semua ${ssotVerCreds.length} credentials ada`);
    } else {
      console.log(`  ⚠️   site_identity.registration_ids: ${missingCreds.length}/${ssotVerCreds.length} missing`);
      for (const vc of missingCreds.slice(0, 5)) console.log(`    → ${vc.id}: ${vc.title}`);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. CONTENT PAGES
  // ══════════════════════════════════════════════════════════════════════════
  H2("4. CONTENT PAGES");

  // Collect all canonical routes from SSOT
  const ssotRoutes = new Set();
  const pageSourceMap = new Map();
  const pageSources = [
    { key: "pages", field: "route" },
    { key: "verify_pages", field: "route" },
    { key: "tour_pages", field: "route" },
    { key: "destination_pages", field: "route" },
    { key: "travel_pages", field: "route" },
    { key: "policy_pages", field: "route" },
    { key: "content_pages", field: "path" },
  ];
  for (const { key, field } of pageSources) {
    (ssot[key] || []).forEach((e) => {
      const r = e[field] || e.route || e.path;
      if (r) { ssotRoutes.add(r); pageSourceMap.set(r, key); }
    });
  }

  const dbCpRows = await c.query(
    "SELECT route, seo, content, is_active, status FROM content_pages WHERE lang='en' ORDER BY route"
  );
  const dbCpMap = new Map(dbCpRows.rows.map((r) => [r.route, r]));

  console.log(`  SSOT canonical routes : ${ssotRoutes.size}`);
  console.log(`  DB content_pages (en) : ${dbCpRows.rows.length}`);

  let cpMissing = 0, cpMinimal = 0, cpRich = 0;
  const missingRoutes = [];
  const minimalRoutes = [];

  for (const route of ssotRoutes) {
    const dbRow = dbCpMap.get(route);
    if (!dbRow) {
      cpMissing++;
      missingRoutes.push(`${route} (${pageSourceMap.get(route)})`);
    } else {
      // Check if content is rich
      let contentObj = dbRow.content;
      if (typeof contentObj === "string") { try { contentObj = JSON.parse(contentObj); } catch (_) {} }
      const hasRichContent = !!(
        contentObj?.sections?.length > 0 ||
        contentObj?.body_md ||
        contentObj?.intro_paragraphs?.length > 0
      );
      if (hasRichContent) {
        cpRich++;
      } else {
        cpMinimal++;
        minimalRoutes.push(`${route} (${pageSourceMap.get(route)})`);
      }
    }
  }

  // Routes in DB that are NOT in SSOT (extra routes)
  const extraRoutes = dbCpRows.rows.filter((r) => !ssotRoutes.has(r.route)).map((r) => r.route);

  console.log(`\n  Status content_pages:`);
  console.log(`  ✅  Rich content    : ${cpRich}`);
  console.log(`  ⚠️   Minimal content : ${cpMinimal} (ada di DB tapi belum punya sections/body_md)`);
  console.log(`  ❌  Missing         : ${cpMissing} (belum ada di DB)`);
  console.log(`  ─   Extra (DB only) : ${extraRoutes.length} routes tidak ada di SSOT`);

  if (missingRoutes.length > 0) {
    console.log(`\n  Routes missing dari DB:`);
    missingRoutes.forEach((r) => console.log(`    ❌  ${r}`));
  }
  if (minimalRoutes.length > 0) {
    console.log(`\n  Routes minimal (perlu enrichment):`);
    minimalRoutes.slice(0, 10).forEach((r) => console.log(`    ⚠️   ${r}`));
    if (minimalRoutes.length > 10) console.log(`    ... dan ${minimalRoutes.length - 10} lainnya`);
  }
  if (extraRoutes.length > 0) {
    console.log(`\n  Routes DB-only (tidak ada di SSOT):`);
    extraRoutes.forEach((r) => console.log(`    ─   ${r}`));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. ASSETS
  // ══════════════════════════════════════════════════════════════════════════
  H2("5. ASSETS");

  const ssotAssets = ssot.assets_inventory || [];
  const assetRows = await c.query("SELECT COUNT(*)::int as cnt FROM assets WHERE is_active=true");
  const dbAssetCount = assetRows.rows[0].cnt;

  console.log(`  SSOT assets_inventory : ${ssotAssets.length} entries`);
  console.log(`  DB   assets (active)  : ${dbAssetCount} rows`);

  const assetDbRows = await c.query("SELECT url, sha256 FROM assets WHERE is_active=true");
  const dbUrls = new Set(assetDbRows.rows.map((r) => r.url));
  const dbShas = new Set(assetDbRows.rows.filter((r) => r.sha256).map((r) => r.sha256));
  const missingAssets = ssotAssets.filter(
    (a) => !(a.sha256 && dbShas.has(a.sha256)) && !(a.url && dbUrls.has(a.url))
  );
  if (missingAssets.length === 0) {
    console.log("  ✅  Semua assets dari SSOT sudah ada di DB");
  } else {
    console.log(`  ⚠️   ${missingAssets.length} assets SSOT belum ada di DB:`);
    for (const a of missingAssets.slice(0, 10)) {
      console.log(`    → ${a.slug || a.filename} (${a.category})`);
    }
    if (missingAssets.length > 10) console.log(`    ... dan ${missingAssets.length - 10} lainnya`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  H2("SUMMARY");
  console.log(`  Crew gaps (SSOT→DB)       : ${crewWithGaps.length} crew perlu update`);
  console.log(`  Crew role missing         : ${crewWithoutRole.length} crew tanpa role`);
  console.log(`  Destination SSOT→DB gaps  : ${totalSsotToDbGaps} fields`);
  console.log(`  Destination DB→SSOT gaps  : ${totalDbToSsotGaps} fields`);
  console.log(`  Destination gear gaps     : ${gearGaps} items`);
  console.log(`  Organization fields missing: lihat section 3 di atas`);
  console.log(`  Site identity gaps        : ${siteIdentityGaps} fields kosong`);
  console.log(`  Content pages missing     : ${cpMissing} routes`);
  console.log(`  Content pages minimal     : ${cpMinimal} routes`);
  console.log(`  Content pages rich        : ${cpRich} routes`);
  console.log(`  Assets missing from DB    : ${missingAssets.length}`);

  console.log("\n  → Jalankan: node scripts/sync-ssot-to-db.js");
  console.log("  → Kemudian: node scripts/sync-db-to-ssot.js");
  console.log("  → Verifikasi: node scripts/audit-sync-status.js\n");

  HR("═");
  await c.end();
}

run().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
