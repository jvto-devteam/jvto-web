const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const SSOT_PATH = path.resolve(__dirname, "..", "JVTO_SSOT_v4_0_CLEAN.json");

const CATEGORY_TO_FOLDER = {
  Brand: { name: "Brand", parent: null },
  BusinessID: { name: "BusinessID", parent: "Legal" },
  License: { name: "License", parent: "Legal" },
  Membership: { name: "Membership", parent: "Legal" },
  PoliceDocs: { name: "PoliceDocs", parent: "Legal" },
  Credentials: { name: "KTA Guide Ijen", parent: "Crews" },
  OpsPhoto: { name: "OpsPhoto", parent: null },
  Screening: { name: "Screening", parent: null },
  History: { name: "History", parent: null },
  Press: { name: "Press", parent: null },
  Founder: { name: "Founder", parent: null },
  "Historical Validation": { name: "History", parent: null },
  Uncategorized: { name: "Screening", parent: null },
  ReviewPlatform: { name: "Logo", parent: null },
  PartnerVerification: { name: "Logo", parent: null },
};

function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL.replace(/^"|"$/g, "");
  }

  return "postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function arrayValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function jsonArrayValue(value) {
  return JSON.stringify(arrayValue(value));
}

function jsonObjectValue(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return JSON.stringify({});
}

function textValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(" ");
  }
  if (typeof value === "string") {
    return value.trim() || null;
  }
  return null;
}

function crewAboutValue(entry) {
  const merged = [...arrayValue(entry.knows_about), ...arrayValue(entry.knowsAbout)];
  return JSON.stringify([...new Set(merged)]);
}

function crewNameAliases(name) {
  const normalized = slugify(name);
  const aliases = new Set([normalized]);
  if (normalized === "pras") aliases.add("prasojo");
  if (normalized === "ahboy") aliases.add("boy");
  return aliases;
}

function inferAssetType(url, fallbackType = "document") {
  const lower = String(url || "").toLowerCase();
  if (/\.(png|jpe?g|webp|svg|gif)(\?|$)/.test(lower)) return "image";
  if (/\.(mp4|webm|mov)(\?|$)/.test(lower)) return "video";
  if (/\.(pdf)(\?|$)/.test(lower)) return "document";
  return fallbackType;
}

async function ensureCrewColumns(client) {
  await client.query(`
    ALTER TABLE public.crew_members
      ADD COLUMN IF NOT EXISTS ssot_id TEXT,
      ADD COLUMN IF NOT EXISTS ssot_numeric_id INTEGER,
      ADD COLUMN IF NOT EXISTS role_label TEXT,
      ADD COLUMN IF NOT EXISTS archetype TEXT,
      ADD COLUMN IF NOT EXISTS archetype_tags TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS knows_about JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS evidence_review_quotes JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS forensic_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS internal_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS profile_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS known_for JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS operating_style JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS self_quote TEXT,
      ADD COLUMN IF NOT EXISTS ssot_payload JSONB
  `);
}

async function getOrCreateFolder(client, cache, name, parentName = null) {
  if (cache.has(name)) return cache.get(name);

  let parentId = null;
  if (parentName) parentId = await getOrCreateFolder(client, cache, parentName, null);

  const existing = await client.query(
    "SELECT id FROM folders WHERE name = $1 AND ((parent_id IS NULL AND $2::bigint IS NULL) OR parent_id = $2::bigint) LIMIT 1",
    [name, parentId],
  );
  if (existing.rowCount > 0) {
    const id = Number(existing.rows[0].id);
    cache.set(name, id);
    return id;
  }

  const inserted = await client.query(
    "INSERT INTO folders (name, parent_id, created_at) VALUES ($1, $2, NOW()) RETURNING id",
    [name, parentId],
  );
  const id = Number(inserted.rows[0].id);
  cache.set(name, id);
  return id;
}

async function reconcileAssets(client, ssot) {
  const folderCache = new Map();
  const folderRows = await client.query("SELECT id, name FROM folders");
  for (const row of folderRows.rows) folderCache.set(row.name, Number(row.id));

  await getOrCreateFolder(client, folderCache, "Legal", null);
  await getOrCreateFolder(client, folderCache, "Press", null);
  await getOrCreateFolder(client, folderCache, "Membership", "Legal");

  const assetRows = await client.query(
    "SELECT id, name, url, sha256, folder_id FROM assets WHERE is_active = true",
  );
  const bySha = new Map();
  const byUrl = new Map();
  for (const row of assetRows.rows) {
    if (row.sha256) bySha.set(row.sha256, row);
    if (row.url) byUrl.set(row.url, row);
  }

  let inserted = 0;
  for (const item of ssot.assets_inventory || []) {
    const existing = (item.sha256 && bySha.get(item.sha256)) || (item.url && byUrl.get(item.url));
    const folderSpec = CATEGORY_TO_FOLDER[item.category] || { name: "OpsPhoto", parent: null };
    const folderId = await getOrCreateFolder(client, folderCache, folderSpec.name, folderSpec.parent);
    if (existing) {
      if (Number(existing.folder_id) !== folderId || existing.name !== item.slug) {
        await client.query(
          `UPDATE assets
             SET folder_id = $1,
                 name = $2,
                 caption = COALESCE($3, caption),
                 description = COALESCE($4, description)
           WHERE id = $5`,
          [folderId, item.slug, item.caption || null, item.geo_context || null, existing.id],
        );
      }
      continue;
    }

    await client.query(
      `INSERT INTO assets
        (folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW())`,
      [
        folderId,
        item.slug,
        item.caption || null,
        item.geo_context || null,
        inferAssetType(item.url, "image"),
        item.url,
        null,
        item.size_bytes || null,
        item.size_mb || null,
        item.sha256 || null,
        item.last_verified_iso ? new Date(item.last_verified_iso) : null,
      ],
    );
    inserted += 1;
  }

  const extraAssets = [];

  for (const pressItem of ssot.press_coverage || []) {
    if (pressItem?.evidence?.proof_asset_slug) continue;
    if (!pressItem.url) continue;
    extraAssets.push({
      name: `press-${slugify(pressItem.publisher)}-${slugify(pressItem.date || pressItem.title).slice(0, 40)}`,
      folderName: "Press",
      parent: null,
      caption: pressItem.title,
      description: pressItem.relevance || null,
      type: "document",
      url: pressItem.url,
    });
  }

  for (const partnerItem of ssot.partner_network || []) {
    if (partnerItem.proof_asset_slug && /^https?:\/\//.test(partnerItem.proof_asset_slug)) {
      extraAssets.push({
        name: `${partnerItem.id}-proof-screenshot`,
        folderName: "Membership",
        parent: "Legal",
        caption: `${partnerItem.name} proof screenshot`,
        description: partnerItem.geo_narrative || null,
        type: inferAssetType(partnerItem.proof_asset_slug, "image"),
        url: partnerItem.proof_asset_slug,
      });
    }

    if (partnerItem.verification_url) {
      extraAssets.push({
        name: `${partnerItem.id}-verification-link`,
        folderName: "Membership",
        parent: "Legal",
        caption: `${partnerItem.name} verification link`,
        description: partnerItem.geo_narrative || null,
        type: "document",
        url: partnerItem.verification_url,
      });
    }
  }

  let insertedExtra = 0;
  for (const item of extraAssets) {
    const existing = byUrl.get(item.url);
    const folderId = await getOrCreateFolder(client, folderCache, item.folderName, item.parent);
    if (existing) {
      await client.query(
        `UPDATE assets
           SET folder_id = $1,
               name = $2,
               caption = COALESCE($3, caption),
               description = COALESCE($4, description)
         WHERE id = $5`,
        [folderId, item.name, item.caption, item.description, existing.id],
      );
      continue;
    }
    await client.query(
      `INSERT INTO assets
        (folder_id, name, caption, description, type, url, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW())`,
      [folderId, item.name, item.caption, item.description, item.type, item.url],
    );
    insertedExtra += 1;
  }

  return { inserted, insertedExtra };
}

async function reconcileCrew(client, ssot) {
  await ensureCrewColumns(client);

  const crewRows = await client.query(
    "SELECT * FROM crew_members ORDER BY id",
  );
  const byId = new Map();
  const byName = new Map();
  for (const row of crewRows.rows) {
    byId.set(Number(row.id), row);
    byName.set(slugify(row.name), row);
  }

  let updated = 0;
  let inserted = 0;

  for (const entry of ssot.crew_registry || []) {
    const candidates = crewNameAliases(entry.id).size ? [...crewNameAliases(entry.id)] : [];
    const numericId = Number(entry.numeric_id);
    let row = Number.isFinite(numericId) ? byId.get(numericId) : null;
    if (!row) {
      for (const alias of crewNameAliases(entry.name)) {
        if (byName.has(alias)) {
          row = byName.get(alias);
          break;
        }
      }
    }
    if (!row) {
      for (const alias of candidates) {
        if (byName.has(alias)) {
          row = byName.get(alias);
          break;
        }
      }
    }

    const payload = {
      ssot_id: entry.id || null,
      ssot_numeric_id: Number.isFinite(numericId) ? numericId : null,
      role_label: entry.role || null,
      archetype: entry.archetype || null,
      archetype_tags: arrayValue(entry.archetype_tags),
      knows_about: crewAboutValue(entry),
      evidence_review_quotes: jsonArrayValue(entry.evidence_review_quotes),
      forensic_evidence: jsonArrayValue(entry.forensic_evidence),
      social_links: jsonObjectValue(entry.social_links),
      internal_contact: jsonObjectValue(entry.internal_contact),
      profile_snapshot: jsonObjectValue(entry.profile_snapshot),
      known_for: jsonArrayValue(entry.known_for),
      operating_style: jsonArrayValue(entry.operating_style),
      self_quote: textValue(entry.self_quote),
      ssot_payload: JSON.stringify(entry),
      phone: entry?.internal_contact?.phone || entry?.internal_contact?.whatsapp || null,
      facebook_url: entry?.social_links?.facebook || null,
      instagram_url: entry?.social_links?.instagram || null,
      photo_url: entry?.profile_snapshot?.image_url || null,
      about_me: entry?.profile_snapshot?.bio || null,
      type: entry.role || null,
    };

    if (row) {
      await client.query(
        `UPDATE crew_members
           SET ssot_id = $2,
               ssot_numeric_id = $3,
               role_label = $4,
               archetype = $5,
               archetype_tags = $6::text[],
               knows_about = $7::jsonb,
               evidence_review_quotes = $8::jsonb,
               forensic_evidence = $9::jsonb,
               social_links = $10::jsonb,
               internal_contact = $11::jsonb,
               profile_snapshot = $12::jsonb,
               known_for = $13::jsonb,
               operating_style = $14::jsonb,
               self_quote = $15,
               ssot_payload = $16::jsonb,
               phone = COALESCE(phone, $17),
               facebook_url = COALESCE(facebook_url, $18),
               instagram_url = COALESCE(instagram_url, $19),
               photo_url = COALESCE(photo_url, $20),
               about_me = COALESCE(about_me, $21),
               type = COALESCE(type, $22),
               updated_at = NOW()
         WHERE id = $1`,
        [
          row.id,
          payload.ssot_id,
          payload.ssot_numeric_id,
          payload.role_label,
          payload.archetype,
          payload.archetype_tags,
          payload.knows_about,
          payload.evidence_review_quotes,
          payload.forensic_evidence,
          payload.social_links,
          payload.internal_contact,
          payload.profile_snapshot,
          payload.known_for,
          payload.operating_style,
          payload.self_quote,
          payload.ssot_payload,
          payload.phone,
          payload.facebook_url,
          payload.instagram_url,
          payload.photo_url,
          payload.about_me,
          payload.type,
        ],
      );
      updated += 1;
    } else {
      const insertedRow = await client.query(
        `INSERT INTO crew_members
          (name, phone, type, tags, photo_url, created_at, email, full_name, facebook_url, instagram_url, about_me,
           ssot_id, ssot_numeric_id, role_label, archetype, archetype_tags, knows_about, evidence_review_quotes,
           forensic_evidence, social_links, internal_contact, profile_snapshot, known_for, operating_style,
           self_quote, ssot_payload)
         VALUES
          ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10,
           $11, $12, $13, $14, $15::text[], $16::jsonb, $17::jsonb,
           $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22::jsonb, $23::jsonb,
           $24, $25::jsonb)
         RETURNING *`,
        [
          entry.name,
          payload.phone,
          payload.type,
          "JVTO,INTERNAL_ONLY",
          payload.photo_url,
          null,
          entry.name,
          payload.facebook_url,
          payload.instagram_url,
          payload.about_me,
          payload.ssot_id,
          payload.ssot_numeric_id,
          payload.role_label,
          payload.archetype,
          payload.archetype_tags,
          payload.knows_about,
          payload.evidence_review_quotes,
          payload.forensic_evidence,
          payload.social_links,
          payload.internal_contact,
          payload.profile_snapshot,
          payload.known_for,
          payload.operating_style,
          payload.self_quote,
          payload.ssot_payload,
        ],
      );
      const newRow = insertedRow.rows[0];
      byId.set(Number(newRow.id), newRow);
      byName.set(slugify(newRow.name), newRow);
      inserted += 1;
    }
  }

  return { updated, inserted };
}

async function reconcileDestinations(client, ssot) {
  let updated = 0;
  let gearInserted = 0;

  for (const entry of ssot.destinations || []) {
    const numericId = Number(entry.db_id);
    const target = await client.query(
      "SELECT id FROM destinations WHERE id = $1 OR slug = $2 OR short_slug = $3 OR name = $4 ORDER BY id LIMIT 1",
      [Number.isFinite(numericId) ? numericId : null, entry.slug || null, entry.short_slug || null, entry.name],
    );
    if (target.rowCount === 0) continue;

    const destinationId = target.rows[0].id;
    await client.query(
      `UPDATE destinations
         SET category = $2,
             region = $3,
             province = $4,
             latitude = $5,
             longitude = $6,
             altitude = $7,
             area_hectares = $8,
             terrain = $9,
             best_time_to_visit = $10,
             difficulty_level = $11,
             duration = $12,
             physical_demand = $13,
             cultural_depth = $14,
             photo_potential = $15,
             temperature_range = $16,
             summary = $17,
             highlight = $18,
             permit_required = $19,
             permit_details = $20,
             guide_required = $21,
             seo_title = $22,
             seo_description = $23,
             tags = $24::varchar[],
             types = $25::jsonb,
             published = $26,
             featured = $27,
             local_tribes = $28::varchar[],
             rituals_festivals = $29::jsonb,
             slug = $30,
             short_slug = $31,
             updated_at = NOW()
       WHERE id = $1`,
      [
        destinationId,
        entry.category || null,
        entry.region || null,
        entry.province || null,
        entry.latitude ?? null,
        entry.longitude ?? null,
        entry.altitude_masl ?? null,
        entry.area_hectares ?? null,
        entry.terrain || null,
        entry.best_time_to_visit || null,
        entry.difficulty_level || null,
        entry.duration || null,
        entry.physical_demand ?? null,
        entry.cultural_depth ?? null,
        entry.photo_potential ?? null,
        entry.temperature_range || null,
        entry.summary || null,
        entry.highlight || null,
        entry.permit_required ?? null,
        entry.permit_details || null,
        entry.guide_required ?? null,
        entry.seo_title || null,
        entry.seo_description || null,
        arrayValue(entry.tags),
        JSON.stringify(arrayValue(entry.types)),
        entry.published ?? null,
        entry.featured ?? null,
        arrayValue(entry.local_tribes),
        JSON.stringify(arrayValue(entry.rituals)),
        entry.slug || null,
        entry.short_slug || null,
      ],
    );
    updated += 1;

    for (const gear of entry.gear_provided_by_jvto || []) {
      const gearName = gear.gear;
      if (!gearName) continue;
      const existing = await client.query(
        "SELECT id FROM destination_gears WHERE destination_id = $1 AND lower(gear) = lower($2) LIMIT 1",
        [destinationId, gearName],
      );
      if (existing.rowCount > 0) continue;
      await client.query(
        "INSERT INTO destination_gears (destination_id, gear, type, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
        [destinationId, gearName, gear.type || "provided"],
      );
      gearInserted += 1;
    }
  }

  return { updated, gearInserted };
}

async function auditStatus(client, ssot) {
  const assetRows = (await client.query("SELECT id,name,url,sha256 FROM assets WHERE is_active = true")).rows;
  const bySha = new Map(assetRows.filter((row) => row.sha256).map((row) => [row.sha256, row]));
  const byUrl = new Map(assetRows.filter((row) => row.url).map((row) => [row.url, row]));
  const matchedAssets = (ssot.assets_inventory || []).filter(
    (item) => (item.sha256 && bySha.has(item.sha256)) || (item.url && byUrl.has(item.url)),
  );

  const crewAudit = await client.query(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE ssot_id IS NOT NULL)::int AS with_ssot_id,
            count(*) FILTER (WHERE archetype IS NOT NULL)::int AS with_archetype,
            count(*) FILTER (WHERE knows_about <> '[]'::jsonb)::int AS with_knows_about
       FROM crew_members
      WHERE deleted_at IS NULL`,
  );

  const destinationAudit = await client.query(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE published = TRUE)::int AS published_count,
            count(*) FILTER (WHERE seo_title IS NOT NULL AND length(trim(seo_title)) > 0)::int AS with_seo_title,
            count(*) FILTER (WHERE summary IS NOT NULL AND length(trim(summary)) > 0)::int AS with_summary
       FROM destinations
      WHERE id = ANY($1::bigint[])`,
    [[1, 2, 3, 4, 5, 6, 7, 9, 38]],
  );

  const partnerRoutes = await client.query(
    "SELECT route FROM content_pages WHERE route LIKE '/why-jvto/partners-verification%' ORDER BY route",
  );
  const pressRoute = await client.query(
    "SELECT route FROM content_pages WHERE route = '/verify-jvto/press-recognition'",
  );

  return {
    assets: {
      totalSSOT: (ssot.assets_inventory || []).length,
      matched: matchedAssets.length,
    },
    crew: crewAudit.rows[0],
    destinations: destinationAudit.rows[0],
    partnerRoutes: partnerRoutes.rows.map((row) => row.route),
    pressRoutePresent: pressRoute.rowCount > 0,
  };
}

async function main() {
  const client = new Client({
    connectionString: getConnectionString(),
    connectionTimeoutMillis: 12000,
  });
  const ssot = JSON.parse(fs.readFileSync(SSOT_PATH, "utf8"));

  await client.connect();
  try {
    await client.query("BEGIN");
    const assetResult = await reconcileAssets(client, ssot);
    const crewResult = await reconcileCrew(client, ssot);
    const destinationResult = await reconcileDestinations(client, ssot);
    await client.query("COMMIT");

    const audit = await auditStatus(client, ssot);

    console.log(
      JSON.stringify(
        {
          assetResult,
          crewResult,
          destinationResult,
          audit,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
