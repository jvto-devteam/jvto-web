/**
 * sync-ssot-to-db.js
 *
 * Push data dari JVTO_SSOT_v4_0_CLEAN.json ke database jvto_dev.
 * Prinsip: NO-OVERWRITE — hanya isi field yang kosong/null di DB.
 *
 * Entitas yang di-sync:
 *   A. crew_registry       → crew_members + crew_member_roles
 *   B. destinations        → destinations + destination_gears
 *   C. organization        → organization_profile
 *   D. verification_creds  → site_identity.registration_ids
 *   E. all 51 canonical routes → content_pages
 *   F. organization        → site_identity (full enrichment)
 *
 * Run: node scripts/sync-ssot-to-db.js
 */

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev";

const SSOT_PATH = path.resolve(__dirname, "../JVTO_SSOT_v4_0_CLEAN.json");

function isBlank(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

// Hanya set field jika nilai baru tidak blank AND nilai lama blank
function shouldSet(newVal, oldVal) {
  return !isBlank(newVal) && isBlank(oldVal);
}

const HR = (char = "─", len = 72) => console.log(char.repeat(len));
const H1 = (t) => { HR("═"); console.log(`  ${t}`); HR("═"); };
const H2 = (t) => { console.log(`\n${t}`); HR("─"); };

// ─── STATS ────────────────────────────────────────────────────────────────────
const stats = {
  crew: 0, crewRoles: 0, destinations: 0, destGears: 0,
  org: 0, siteCreds: 0,
  contentPagesInserted: 0, contentPagesUpdated: 0, contentPagesSkipped: 0,
  siteIdentityUpdated: 0,
};

// Check apakah content JSON sudah "kaya" (punya sections/body_md/intro_paragraphs)
function isRichContent(contentJson) {
  if (!contentJson) return false;
  let obj = contentJson;
  if (typeof obj === "string") { try { obj = JSON.parse(obj); } catch (_) { return false; } }
  return !!(obj.sections || obj.body_md || obj.intro_paragraphs);
}

// Bangun SEO JSON dari entry SSOT
function buildSeo(entry) {
  return {
    title: entry.title_tag || entry.h1 || null,
    description: entry.meta_description || null,
  };
}

// Bangun content JSON dari entry SSOT (structured vs body_md)
function buildContent(entry) {
  if (entry.body_md) {
    return { h1: entry.h1 || null, body_md: entry.body_md };
  }
  return {
    h1: entry.h1 || null,
    intro_paragraphs: entry.intro_paragraphs || [],
    sections: entry.sections || [],
    cross_links: entry.cross_links || {},
  };
}

// Kumpulkan semua canonical routes dari 7 SSOT arrays
function collectAllRoutes(ssot) {
  const map = new Map(); // route → {seo, content, source}
  const sources = [
    { key: "pages", routeField: "route" },
    { key: "verify_pages", routeField: "route" },
    { key: "tour_pages", routeField: "route" },
    { key: "destination_pages", routeField: "route" },
    { key: "travel_pages", routeField: "route" },
    { key: "policy_pages", routeField: "route" },
    { key: "content_pages", routeField: "path" },
  ];
  for (const { key, routeField } of sources) {
    const arr = ssot[key] || [];
    for (const entry of arr) {
      const route = entry[routeField] || entry.route || entry.path;
      if (!route) continue;
      // Prioritas: entry dengan body_md atau sections lebih kaya
      const existing = map.get(route);
      const hasRich = !!(entry.body_md || (Array.isArray(entry.sections) && entry.sections.length > 0) || (Array.isArray(entry.intro_paragraphs) && entry.intro_paragraphs.length > 0));
      if (!existing || hasRich) {
        map.set(route, { seo: buildSeo(entry), content: buildContent(entry), source: key });
      }
    }
  }
  return map;
}

async function run() {
  const ssot = JSON.parse(fs.readFileSync(SSOT_PATH, "utf8"));
  const c = new Client({ connectionString: DB_URL, connectionTimeoutMillis: 15000 });
  await c.connect();
  console.log("Connected to DB.\n");

  H1("SSOT → DB SYNC");

  // ══════════════════════════════════════════════════════════════════════════
  // A. CREW
  // ══════════════════════════════════════════════════════════════════════════
  H2("A. Crew (crew_registry → crew_members)");

  const ssotCrew = ssot.crew_registry || [];

  // Load semua crew dari DB
  const dbCrewRes = await c.query(
    "SELECT id, code, name, full_name, facebook_url, instagram_url, photo_url, about_me, phone, tags FROM crew_members WHERE deleted_at IS NULL"
  );
  const dbCrew = dbCrewRes.rows;

  // Load crew_roles
  const rolesRes = await c.query("SELECT id, name FROM crew_roles WHERE deleted_at IS NULL");
  // Fuzzy role mapping: SSOT "Guide" → first DB role containing "guide" (not "driver cum guide")
  // SSOT "Driver" → first DB role matching "driver only" or "driver outsources"
  const allRoles = rolesRes.rows;
  function findRoleId(ssotRole) {
    const lower = ssotRole.toLowerCase();
    if (lower === "guide") {
      // Prefer "Escort Guide (Sr)" or "Escort Guide" exact matches
      const sr = allRoles.find((r) => r.name.toLowerCase() === "escort guide (sr)");
      if (sr) return sr.id;
      const eg = allRoles.find((r) => r.name.toLowerCase() === "escort guide");
      if (eg) return eg.id;
      return allRoles.find((r) => r.name.toLowerCase().includes("guide") && !r.name.toLowerCase().includes("driver"))?.id || null;
    }
    if (lower === "driver") {
      const only = allRoles.find((r) => r.name.toLowerCase() === "driver only");
      if (only) return only.id;
      return allRoles.find((r) => r.name.toLowerCase().includes("driver"))?.id || null;
    }
    // Fallback: exact match
    return allRoles.find((r) => r.name.toLowerCase() === lower)?.id || null;
  }

  // Load existing crew_member_roles
  const cmrRes = await c.query(
    "SELECT crew_member_id, crew_role_id FROM crew_member_roles WHERE deleted_at IS NULL"
  );
  const assignedSet = new Set(cmrRes.rows.map((r) => `${r.crew_member_id}|${r.crew_role_id}`));

  for (const sc of ssotCrew) {
    // Match: code, exact name, full_name, atau partial (first word of sc.name in DB name)
    const scNameLower = sc.name?.toLowerCase() || "";
    const scFirstWord = scNameLower.split(/[\s(]/)[0]; // e.g. "boy" from "Boy (Ahboy)"
    const dc = dbCrew.find(
      (r) =>
        (r.code && r.code === sc.id) ||
        r.name?.toLowerCase() === scNameLower ||
        r.full_name?.toLowerCase() === scNameLower ||
        // Partial match: "boy (ahboy)" → DB "boy"
        (scFirstWord.length >= 3 && r.name?.toLowerCase() === scFirstWord) ||
        // Partial match: "pras" → DB "prasojo"
        (scFirstWord.length >= 4 && r.name?.toLowerCase().startsWith(scFirstWord))
    );

    if (!dc) {
      console.log(`  ❌ SKIP ${sc.name} — tidak ditemukan di DB`);
      continue;
    }

    // Build UPDATE set
    const setClauses = [];
    const vals = [];
    let p = 1;

    const fb = sc.social_links?.facebook || null;
    const ig = sc.social_links?.instagram || null;
    const img = sc.profile_snapshot?.image_url || null;
    const phone = sc.internal_contact?.phone || null;
    const selfQuote = Array.isArray(sc.self_quote) ? sc.self_quote[0] : (sc.self_quote || null);
    const archTags = Array.isArray(sc.archetype_tags) ? sc.archetype_tags.join(", ") : null;

    if (shouldSet(fb, dc.facebook_url)) {
      setClauses.push(`facebook_url = $${p++}`); vals.push(fb);
    }
    if (shouldSet(ig, dc.instagram_url)) {
      setClauses.push(`instagram_url = $${p++}`); vals.push(ig);
    }
    if (shouldSet(img, dc.photo_url)) {
      setClauses.push(`photo_url = $${p++}`); vals.push(img);
    }
    if (shouldSet(phone, dc.phone)) {
      setClauses.push(`phone = $${p++}`); vals.push(phone);
    }
    if (shouldSet(selfQuote, dc.about_me)) {
      setClauses.push(`about_me = $${p++}`); vals.push(selfQuote);
    }
    if (shouldSet(archTags, dc.tags)) {
      setClauses.push(`tags = $${p++}`); vals.push(archTags);
    }

    if (setClauses.length > 0) {
      setClauses.push(`updated_at = now()`);
      vals.push(dc.id);
      await c.query(
        `UPDATE crew_members SET ${setClauses.join(", ")} WHERE id = $${p}`,
        vals
      );
      stats.crew++;
      console.log(`  ✅ ${dc.name} — updated: ${setClauses.slice(0, -1).map((s) => s.split("=")[0].trim()).join(", ")}`);
    } else {
      console.log(`  ─  ${dc.name} — tidak ada field baru dari SSOT`);
    }

    // Role assignment
    const ssotRole = sc.role; // "Guide" atau "Driver"
    if (ssotRole) {
      const roleId = findRoleId(ssotRole);
      if (roleId) {
        const key = `${dc.id}|${roleId}`;
        if (!assignedSet.has(key)) {
          await c.query(
            "INSERT INTO crew_member_roles (crew_member_id, crew_role_id, created_at) VALUES ($1, $2, now())",
            [dc.id, roleId]
          );
          assignedSet.add(key);
          stats.crewRoles++;
          console.log(`    + role assigned: ${ssotRole} (role_id=${roleId})`);
        }
      } else {
        console.log(`    ⚠ role "${ssotRole}" tidak ditemukan di crew_roles`);
      }
    }
  }

  console.log(`\n  → ${stats.crew} crew updated, ${stats.crewRoles} role assignments added`);

  // ══════════════════════════════════════════════════════════════════════════
  // B. DESTINATIONS
  // ══════════════════════════════════════════════════════════════════════════
  H2("B. Destinations (destinations → destinations + destination_gears)");

  const ssotDests = ssot.destinations || [];

  for (const sd of ssotDests) {
    if (!sd.db_id) {
      console.log(`  ⚠ SKIP ${sd.name} — tidak ada db_id di SSOT`);
      continue;
    }

    // Load row dari DB
    const destRes = await c.query(
      `SELECT id, altitude, area_hectares, terrain, best_time_to_visit, difficulty_level,
       duration, physical_demand, cultural_depth, photo_potential, temperature_range,
       summary, highlight, permit_required, permit_details, guide_required,
       seo_title, seo_description, tags, "types", featured, published,
       local_tribes, rituals_festivals
       FROM destinations WHERE id = $1 AND deleted_at IS NULL`,
      [sd.db_id]
    );

    if (destRes.rows.length === 0) {
      console.log(`  ❌ SKIP ${sd.name} — db_id=${sd.db_id} tidak ditemukan di DB`);
      continue;
    }

    const dd = destRes.rows[0];
    const setClauses = [];
    const vals = [];
    let p = 1;

    // Simple string/number fields
    const FIELD_MAP = [
      [sd.altitude_masl, "altitude", dd.altitude],
      [sd.area_hectares, "area_hectares", dd.area_hectares],
      [sd.terrain, "terrain", dd.terrain],
      [sd.best_time_to_visit, "best_time_to_visit", dd.best_time_to_visit],
      [sd.difficulty_level, "difficulty_level", dd.difficulty_level],
      [sd.duration, "duration", dd.duration],
      [sd.physical_demand, "physical_demand", dd.physical_demand],
      [sd.cultural_depth, "cultural_depth", dd.cultural_depth],
      [sd.photo_potential, "photo_potential", dd.photo_potential],
      [sd.temperature_range, "temperature_range", dd.temperature_range],
      [sd.summary, "summary", dd.summary],
      [sd.highlight, "highlight", dd.highlight],
      [sd.permit_details, "permit_details", dd.permit_details],
      [sd.seo_title, "seo_title", dd.seo_title],
      [sd.seo_description, "seo_description", dd.seo_description],
    ];

    for (const [sv, col, dv] of FIELD_MAP) {
      if (shouldSet(sv, dv)) {
        setClauses.push(`${col} = $${p++}`);
        vals.push(sv);
      }
    }

    // Boolean fields (null check only)
    if (sd.permit_required !== null && sd.permit_required !== undefined && dd.permit_required === null) {
      setClauses.push(`permit_required = $${p++}`); vals.push(sd.permit_required);
    }
    if (sd.guide_required !== null && sd.guide_required !== undefined && dd.guide_required === null) {
      setClauses.push(`guide_required = $${p++}`); vals.push(sd.guide_required);
    }
    if (sd.featured !== null && sd.featured !== undefined && dd.featured === null) {
      setClauses.push(`featured = $${p++}`); vals.push(sd.featured);
    }
    if (sd.published !== null && sd.published !== undefined && dd.published === null) {
      setClauses.push(`published = $${p++}`); vals.push(sd.published);
    }

    // Array fields: tags (merge/union)
    if (Array.isArray(sd.tags) && sd.tags.length > 0) {
      const existing = Array.isArray(dd.tags) ? dd.tags : [];
      const merged = [...new Set([...existing, ...sd.tags])];
      if (merged.length > existing.length) {
        setClauses.push(`tags = $${p++}`); vals.push(merged);
      }
    }

    // types (JSON)
    if (Array.isArray(sd.types) && sd.types.length > 0 && isBlank(dd.types)) {
      setClauses.push(`"types" = $${p++}`); vals.push(JSON.stringify(sd.types));
    }

    // local_tribes (array)
    if (Array.isArray(sd.local_tribes) && sd.local_tribes.length > 0) {
      const existingLt = Array.isArray(dd.local_tribes) ? dd.local_tribes : [];
      if (existingLt.length === 0) {
        setClauses.push(`local_tribes = $${p++}`); vals.push(sd.local_tribes);
      }
    }

    // rituals_festivals (JSON from rituals array)
    if (Array.isArray(sd.rituals) && sd.rituals.length > 0 && isBlank(dd.rituals_festivals)) {
      setClauses.push(`rituals_festivals = $${p++}`); vals.push(JSON.stringify(sd.rituals));
    }

    if (setClauses.length > 0) {
      setClauses.push(`updated_at = now()`);
      vals.push(dd.id);
      await c.query(
        `UPDATE destinations SET ${setClauses.join(", ")} WHERE id = $${p}`,
        vals
      );
      stats.destinations++;
      const updatedCols = setClauses.slice(0, -1).map((s) => s.split("=")[0].trim());
      console.log(`  ✅ ${sd.name} — updated ${updatedCols.length} fields: ${updatedCols.join(", ")}`);
    } else {
      console.log(`  ─  ${sd.name} — tidak ada field baru dari SSOT`);
    }

    // Destination gears
    // gear_provided_by_jvto is array of objects: {gear, type, source} OR plain strings
    const ssotGearsRaw = sd.gear_provided_by_jvto || [];
    if (ssotGearsRaw.length > 0) {
      const existGearRes = await c.query(
        "SELECT gear FROM destination_gears WHERE destination_id = $1",
        [dd.id]
      );
      const existingGears = new Set(existGearRes.rows.map((r) => r.gear));
      for (const gearItem of ssotGearsRaw) {
        // Support both object {gear, type} and plain string
        const gearName = typeof gearItem === "object" ? gearItem.gear : gearItem;
        const gearType = typeof gearItem === "object" ? (gearItem.type || "provided") : "provided";
        if (!gearName) continue;
        if (!existingGears.has(gearName)) {
          await c.query(
            "INSERT INTO destination_gears (destination_id, gear, type, created_at, updated_at) VALUES ($1, $2, $3, now(), now())",
            [dd.id, gearName, gearType]
          );
          existingGears.add(gearName);
          stats.destGears++;
          console.log(`    + gear: "${gearName}" (${gearType})`);
        }
      }
    }
  }

  console.log(`\n  → ${stats.destinations} destinations updated, ${stats.destGears} gears inserted`);

  // ══════════════════════════════════════════════════════════════════════════
  // C. ORGANIZATION
  // ══════════════════════════════════════════════════════════════════════════
  H2("C. Organization (organization → organization_profile)");

  const ssotOrg = ssot.organization || {};
  const orgRes = await c.query("SELECT * FROM organization_profile LIMIT 1");
  const dbOrg = orgRes.rows[0];

  const contactEmail = ssotOrg.contact_email || ssotOrg.contact_emails?.primary || null;

  if (!dbOrg) {
    // INSERT new row
    await c.query(
      `INSERT INTO organization_profile
       (legal_name, brand_name, alternate_name, founding_date, description,
        price_range, contact_email, contact_phone, available_languages,
        address_json, same_as_urls, website_url, logo_url, hero_image_url,
        schema_json, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,now())`,
      [
        ssotOrg.legal_name || null,
        ssotOrg.brand_name || null,
        ssotOrg.alternate_name || null,
        ssotOrg.founding_date ? new Date(ssotOrg.founding_date) : null,
        ssotOrg.description || null,
        ssotOrg.price_range || null,
        contactEmail,
        ssotOrg.contact_phone || null,
        ssotOrg.available_languages || null,
        ssotOrg.address_json ? JSON.stringify(ssotOrg.address_json) : null,
        ssotOrg.same_as_urls || null,
        ssotOrg.website_url || null,
        ssotOrg.logo_url || null,
        ssotOrg.hero_image_url || null,
        ssotOrg.schema_json ? JSON.stringify(ssotOrg.schema_json) : null,
      ]
    );
    stats.org++;
    console.log("  ✅ organization_profile — row baru di-INSERT");
  } else {
    // UPDATE field-by-field (no-overwrite)
    const setClauses = [];
    const vals = [];
    let p = 1;

    const ORG_MAP = [
      [ssotOrg.legal_name, "legal_name", dbOrg.legal_name],
      [ssotOrg.brand_name, "brand_name", dbOrg.brand_name],
      [ssotOrg.alternate_name, "alternate_name", dbOrg.alternate_name],
      [ssotOrg.description, "description", dbOrg.description],
      [ssotOrg.price_range, "price_range", dbOrg.price_range],
      [contactEmail, "contact_email", dbOrg.contact_email],
      [ssotOrg.contact_phone, "contact_phone", dbOrg.contact_phone],
      [ssotOrg.website_url, "website_url", dbOrg.website_url],
      [ssotOrg.logo_url, "logo_url", dbOrg.logo_url],
      [ssotOrg.hero_image_url, "hero_image_url", dbOrg.hero_image_url],
    ];

    for (const [sv, col, dv] of ORG_MAP) {
      if (shouldSet(sv, dv)) {
        setClauses.push(`${col} = $${p++}`); vals.push(sv);
      }
    }

    // founding_date
    if (!isBlank(ssotOrg.founding_date) && isBlank(dbOrg.founding_date)) {
      setClauses.push(`founding_date = $${p++}`); vals.push(new Date(ssotOrg.founding_date));
    }

    // available_languages
    if (Array.isArray(ssotOrg.available_languages) && (!dbOrg.available_languages || dbOrg.available_languages.length === 0)) {
      setClauses.push(`available_languages = $${p++}`); vals.push(ssotOrg.available_languages);
    }

    // address_json
    if (!isBlank(ssotOrg.address_json) && isBlank(dbOrg.address_json)) {
      setClauses.push(`address_json = $${p++}`); vals.push(JSON.stringify(ssotOrg.address_json));
    }

    // same_as_urls
    if (Array.isArray(ssotOrg.same_as_urls) && (!dbOrg.same_as_urls || dbOrg.same_as_urls.length === 0)) {
      setClauses.push(`same_as_urls = $${p++}`); vals.push(ssotOrg.same_as_urls);
    }

    // schema_json
    if (!isBlank(ssotOrg.schema_json) && isBlank(dbOrg.schema_json)) {
      setClauses.push(`schema_json = $${p++}`); vals.push(JSON.stringify(ssotOrg.schema_json));
    }

    if (setClauses.length > 0) {
      setClauses.push(`updated_at = now()`);
      vals.push(dbOrg.id);
      await c.query(
        `UPDATE organization_profile SET ${setClauses.join(", ")} WHERE id = $${p}`,
        vals
      );
      stats.org++;
      const updatedCols = setClauses.slice(0, -1).map((s) => s.split("=")[0].trim());
      console.log(`  ✅ organization_profile (id=${dbOrg.id}) — updated: ${updatedCols.join(", ")}`);
    } else {
      console.log(`  ─  organization_profile — sudah lengkap, tidak ada update`);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // D. VERIFICATION CREDENTIALS → site_identity.registration_ids
  // ══════════════════════════════════════════════════════════════════════════
  H2("D. Verification Credentials → site_identity.registration_ids");

  const ssotVerCreds = ssot.verification_credentials || [];
  const siteRes = await c.query("SELECT id, registration_ids FROM site_identity LIMIT 1");

  if (siteRes.rows.length === 0) {
    console.log("  ❌ site_identity — tidak ada row, skip");
  } else {
    const dbSite = siteRes.rows[0];
    let regIds = [];
    try {
      const raw = dbSite.registration_ids;
      if (Array.isArray(raw)) regIds = raw;
      else if (typeof raw === "string") regIds = JSON.parse(raw);
      else if (raw && typeof raw === "object") regIds = raw;
    } catch (_) { regIds = []; }

    const existingIds = new Set(regIds.map((x) => x.id));
    const toAdd = [];

    for (const vc of ssotVerCreds) {
      if (!existingIds.has(vc.id)) {
        toAdd.push({
          id: vc.id,
          category: vc.category,
          title: vc.title,
          narrative: vc.narrative || null,
          identifiers: vc.identifiers || {},
          evidence_status: vc.evidence_status || {},
          proof_page_url: vc.proof_page_url || null,
          evidence_asset_slugs: vc.evidence_asset_slugs || [],
          primary_asset_slug: vc.primary_asset_slug || null,
        });
        console.log(`  + ${vc.id} (${vc.category}): ${vc.title}`);
      } else {
        console.log(`  ─  ${vc.id} — sudah ada`);
      }
    }

    if (toAdd.length > 0) {
      const merged = [...regIds, ...toAdd];
      await c.query(
        "UPDATE site_identity SET registration_ids = $1 WHERE id = $2",
        [JSON.stringify(merged), dbSite.id]
      );
      stats.siteCreds += toAdd.length;
      console.log(`\n  ✅ ${toAdd.length} credentials ditambahkan ke site_identity.registration_ids`);
    } else {
      console.log("\n  ─  Semua credentials sudah ada di site_identity");
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // E. CONTENT PAGES (51 canonical routes → content_pages table)
  // ══════════════════════════════════════════════════════════════════════════
  H2("E. Content Pages (SSOT → content_pages DB)");

  const routeMap = collectAllRoutes(ssot);
  console.log(`  Total canonical routes dari SSOT: ${routeMap.size}`);

  // Load existing content_pages from DB
  const cpRes = await c.query(
    "SELECT id, route, lang, seo, content FROM content_pages WHERE lang = 'en' AND is_active = true"
  );
  const dbRouteMap = new Map();
  cpRes.rows.forEach((r) => dbRouteMap.set(r.route, r));

  for (const [route, { seo, content, source }] of routeMap) {
    const existing = dbRouteMap.get(route);

    if (!existing) {
      // INSERT baru
      await c.query(
        `INSERT INTO content_pages (route, lang, schema_version, seo, content, is_active, status, published_at, created_at, updated_at)
         VALUES ($1, 'en', 1, $2, $3, true, 'published', now(), now(), now())`,
        [route, JSON.stringify(seo), JSON.stringify(content)]
      );
      stats.contentPagesInserted++;
      console.log(`  ✅ [INSERT] ${route}  (${source})`);
    } else {
      // UPDATE hanya jika content di DB masih minimal (belum punya sections/body_md)
      const dbContentIsMinimal = !isRichContent(existing.content);
      const newContentIsRicher = isRichContent(content);

      if (dbContentIsMinimal && newContentIsRicher) {
        // Parse existing seo untuk merge (no-overwrite title/description)
        let existingSeo = {};
        try {
          const raw = existing.seo;
          existingSeo = (typeof raw === "string" ? JSON.parse(raw) : raw) || {};
        } catch (_) {}
        const mergedSeo = {
          ...seo,
          ...Object.fromEntries(Object.entries(existingSeo).filter(([, v]) => !isBlank(v))),
        };

        await c.query(
          `UPDATE content_pages SET seo = $1, content = $2, updated_at = now() WHERE id = $3`,
          [JSON.stringify(mergedSeo), JSON.stringify(content), existing.id]
        );
        stats.contentPagesUpdated++;
        console.log(`  ✅ [UPDATE] ${route}  (${source}) — enriched from minimal`);
      } else if (dbContentIsMinimal) {
        // Minimal tapi SSOT juga tidak kaya — update SEO saja jika kosong
        let existingSeo = {};
        try {
          const raw = existing.seo;
          existingSeo = (typeof raw === "string" ? JSON.parse(raw) : raw) || {};
        } catch (_) {}
        const needsSeoUpdate = isBlank(existingSeo.title) || isBlank(existingSeo.description);
        if (needsSeoUpdate) {
          const mergedSeo = { ...seo, ...Object.fromEntries(Object.entries(existingSeo).filter(([, v]) => !isBlank(v))) };
          await c.query(
            `UPDATE content_pages SET seo = $1, updated_at = now() WHERE id = $2`,
            [JSON.stringify(mergedSeo), existing.id]
          );
          stats.contentPagesUpdated++;
          console.log(`  ─  [SEO-UPDATE] ${route}  (${source})`);
        } else {
          stats.contentPagesSkipped++;
          console.log(`  ─  [SKIP] ${route} — sudah ada, content minimal tapi SEO ok`);
        }
      } else {
        stats.contentPagesSkipped++;
        console.log(`  ─  [SKIP] ${route} — sudah ada dan content sudah kaya`);
      }
    }
  }

  console.log(`\n  → ${stats.contentPagesInserted} inserted, ${stats.contentPagesUpdated} updated, ${stats.contentPagesSkipped} skipped`);

  // ══════════════════════════════════════════════════════════════════════════
  // F. SITE IDENTITY — enrich semua JSON fields dari SSOT organization
  // ══════════════════════════════════════════════════════════════════════════
  H2("F. Site Identity — full enrichment dari SSOT");

  const siteFullRes = await c.query("SELECT * FROM site_identity LIMIT 1");

  if (siteFullRes.rows.length === 0) {
    console.log("  ❌ site_identity — tidak ada row, skip");
  } else {
    const si = siteFullRes.rows[0];
    const org = ssot.organization || {};

    // Helper: parse JSON field dari DB (could be string, array, or object)
    function parseJsonField(v) {
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") return v;
      if (typeof v === "string" && v !== "[]" && v !== "{}") {
        try { return JSON.parse(v); } catch (_) {}
      }
      return null;
    }

    const setClauses = [];
    const vals = [];
    let p = 1;

    // brand_name
    if (!isBlank(org.brand_name) && isBlank(si.brand_name)) {
      setClauses.push(`brand_name = $${p++}`); vals.push(org.brand_name);
    }
    // legal_entity_name
    if (!isBlank(org.legal_name) && isBlank(si.legal_entity_name)) {
      setClauses.push(`legal_entity_name = $${p++}`); vals.push(org.legal_name);
    }
    // official_website_url
    if (!isBlank(org.website_url) && isBlank(si.official_website_url)) {
      setClauses.push(`official_website_url = $${p++}`); vals.push(org.website_url);
    }

    // official_emails: build dari contact_emails + contact_email
    const existEmails = parseJsonField(si.official_emails);
    if (!existEmails || (Array.isArray(existEmails) && existEmails.length === 0)) {
      const emails = [];
      if (org.contact_emails?.primary) emails.push(org.contact_emails.primary);
      if (org.contact_emails?.secondary && org.contact_emails.secondary !== org.contact_emails.primary) {
        emails.push(org.contact_emails.secondary);
      }
      if (org.contact_email && !emails.includes(org.contact_email)) emails.push(org.contact_email);
      if (emails.length > 0) {
        setClauses.push(`official_emails = $${p++}`); vals.push(JSON.stringify(emails));
        console.log(`  + official_emails: ${emails.join(", ")}`);
      }
    }

    // official_whatsapp_numbers: dari contact_phone
    const existWa = parseJsonField(si.official_whatsapp_numbers);
    if (!existWa || (Array.isArray(existWa) && existWa.length === 0)) {
      if (!isBlank(org.contact_phone)) {
        setClauses.push(`official_whatsapp_numbers = $${p++}`);
        vals.push(JSON.stringify([org.contact_phone]));
        console.log(`  + official_whatsapp_numbers: ${org.contact_phone}`);
      }
    }

    // maps_listings: dari map_url + Google Maps entries di same_as_urls
    const existMaps = parseJsonField(si.maps_listings);
    if (!existMaps || (Array.isArray(existMaps) && existMaps.length === 0)) {
      const maps = [];
      if (!isBlank(org.map_url)) maps.push(org.map_url);
      if (Array.isArray(org.same_as_urls)) {
        org.same_as_urls.filter((u) => u.includes("google.com/maps") || u.includes("goo.gl")).forEach((u) => {
          if (!maps.includes(u)) maps.push(u);
        });
      }
      if (maps.length > 0) {
        setClauses.push(`maps_listings = $${p++}`); vals.push(JSON.stringify(maps));
        console.log(`  + maps_listings: ${maps.length} entries`);
      }
    }

    // association_memberships: dari verification_credentials category Leadership/Credentials
    const existAssoc = parseJsonField(si.association_memberships);
    if (!existAssoc || (Array.isArray(existAssoc) && existAssoc.length === 0)) {
      const assocCreds = (ssot.verification_credentials || []).filter(
        (vc) => ["Leadership", "Credentials"].includes(vc.category)
      );
      if (assocCreds.length > 0) {
        const memberships = assocCreds.map((vc) => ({
          name: vc.title,
          id: vc.id,
          category: vc.category,
          narrative: vc.narrative || null,
          identifiers: vc.identifiers || {},
        }));
        setClauses.push(`association_memberships = $${p++}`); vals.push(JSON.stringify(memberships));
        console.log(`  + association_memberships: ${memberships.map((m) => m.name).join(", ")}`);
      }
    }

    // office_address: dari org.address_json
    const existAddr = parseJsonField(si.office_address);
    const isEmptyAddr = !existAddr || (typeof existAddr === "object" && Object.keys(existAddr).length === 0);
    if (isEmptyAddr && !isBlank(org.address_json)) {
      setClauses.push(`office_address = $${p++}`); vals.push(JSON.stringify(org.address_json));
      console.log(`  + office_address dari SSOT`);
    }

    // google_business_profile_url: dari same_as_urls filter Google Business
    if (isBlank(si.google_business_profile_url)) {
      const gbpUrl = Array.isArray(org.same_as_urls)
        ? org.same_as_urls.find((u) => u.includes("google.com/maps") && u.includes("cid="))
        : null;
      const fallback = !isBlank(org.map_url) && org.map_url.includes("cid=") ? org.map_url : null;
      const gbp = gbpUrl || fallback;
      if (gbp) {
        setClauses.push(`google_business_profile_url = $${p++}`); vals.push(gbp);
        console.log(`  + google_business_profile_url`);
      }
    }

    // brand_positioning: dari core_thesis + narrative_pillars
    const existBp = parseJsonField(si.brand_positioning);
    const isEmptyBp = !existBp || (typeof existBp === "object" && Object.keys(existBp).length === 0);
    if (isEmptyBp) {
      const pillars = (ssot.narrative_pillars || []).map((p) => ({
        id: p.id, pillar: p.pillar, core_claim: p.core_claim,
      }));
      const bp = {
        founding_mission: ssot.core_thesis || org.description || null,
        value_propositions: pillars.reduce((acc, p) => { acc[p.id] = p.core_claim; return acc; }, {}),
        differentiators: pillars.map((p) => p.pillar),
      };
      setClauses.push(`brand_positioning = $${p++}`); vals.push(JSON.stringify(bp));
      console.log(`  + brand_positioning: core_thesis + ${pillars.length} pillars`);
    }

    // founder: dari org.founder_name + founder_title
    const existFounder = parseJsonField(si.founder);
    const isEmptyFounder = !existFounder || (typeof existFounder === "object" && Object.keys(existFounder).length === 0);
    if (isEmptyFounder && (!isBlank(org.founder_name) || !isBlank(org.founder_title))) {
      const founder = {
        name: org.founder_name || null,
        title: org.founder_title || null,
      };
      setClauses.push(`founder = $${p++}`); vals.push(JSON.stringify(founder));
      console.log(`  + founder: ${founder.name} (${founder.title})`);
    }

    // org_schema_json_ld: dari org.schema_json
    if (isBlank(si.org_schema_json_ld) && !isBlank(org.schema_json)) {
      setClauses.push(`org_schema_json_ld = $${p++}`);
      vals.push(typeof org.schema_json === "string" ? org.schema_json : JSON.stringify(org.schema_json));
      console.log(`  + org_schema_json_ld dari SSOT`);
    }

    if (setClauses.length > 0) {
      setClauses.push(`updated_at = now()`);
      vals.push(si.id);
      await c.query(
        `UPDATE site_identity SET ${setClauses.join(", ")} WHERE id = $${p}`,
        vals
      );
      stats.siteIdentityUpdated += setClauses.length - 1;
      console.log(`\n  ✅ site_identity updated: ${setClauses.length - 1} fields`);
    } else {
      console.log("  ─  site_identity — sudah lengkap, tidak ada update");
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  H2("SUMMARY");
  console.log(`  Crew updated         : ${stats.crew}`);
  console.log(`  Crew roles assigned  : ${stats.crewRoles}`);
  console.log(`  Destinations updated : ${stats.destinations}`);
  console.log(`  Destination gears    : ${stats.destGears} inserted`);
  console.log(`  Organization updated : ${stats.org}`);
  console.log(`  Credentials added    : ${stats.siteCreds}`);
  console.log(`  Content pages        : ${stats.contentPagesInserted} inserted, ${stats.contentPagesUpdated} updated, ${stats.contentPagesSkipped} skipped`);
  console.log(`  Site identity fields : ${stats.siteIdentityUpdated} updated`);
  console.log("");
  console.log("  Next: node scripts/sync-db-to-ssot.js");
  console.log("");

  await c.end();
}

run().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
