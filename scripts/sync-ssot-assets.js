/**
 * sync-ssot-assets.js
 *
 * Sync SSOT assets_inventory into DB assets/folders using SSOT taxonomy.
 * Run: node scripts/sync-ssot-assets.js
 *
 * Safe: only INSERTs and UPDATEs — never deletes.
 */

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev";

const SSOT_PATH = path.resolve(
  __dirname,
  "../../JVTO_SSOT_v4_0_CLEAN.json"
);

// ──────────────────────────────────────────────────────────────────────────
// SSOT category → DB folder name mapping
// ──────────────────────────────────────────────────────────────────────────
const CATEGORY_TO_FOLDER = {
  Brand: { name: "Brand", parent: null },
  BusinessID: { name: "BusinessID", parent: "Legal" },
  License: { name: "License", parent: "Legal" },
  Membership: { name: "Membership", parent: "Legal" },
  PoliceDocs: { name: "PoliceDocs", parent: "Legal" },
  Credentials: { name: "KTA Guide Ijen", parent: "Crews" }, // already exists
  OpsPhoto: { name: "OpsPhoto", parent: null },
  Screening: { name: "Screening", parent: null },
  History: { name: "History", parent: null },
  Press: { name: "Press", parent: null },
  Founder: { name: "Founder", parent: null },
  "Historical Validation": { name: "History", parent: null }, // merge into History
  Uncategorized: { name: "Screening", parent: null }, // BBKSDA/SIP docs belong here
  // External-URL-only categories — store in Logo folder (already exists, id=29)
  ReviewPlatform: { name: "Logo", parent: null },
  PartnerVerification: { name: "Logo", parent: null },
};

// Assets in Logo folder (id=29) that are misplaced and need to move
const MISPLACED_BY_SHA = {
  // Stefan Loose images → History
  d53aaf7d8496: "History", // stefan-loose-guidebook-page-287 (crop)
  // Press screenshots → Press
  "4ac4be4431fa": "Press", // detik news screenshot
  c598b81fedb1: "Press", // radarjember screenshot
};

function assetType(url) {
  const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext)) return "document";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  return "image"; // png, jpg, webp, svg, or external URL
}

function assetExt(url) {
  const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
  return ext || null;
}

async function run() {
  const ssot = JSON.parse(fs.readFileSync(SSOT_PATH, "utf8"));
  const ssotAssets = ssot.assets_inventory;

  const c = new Client({ connectionString: DB_URL, connectionTimeoutMillis: 15000 });
  await c.connect();
  console.log("Connected to DB.\n");

  // ── 1. Build folder id map from DB ──────────────────────────────────────
  const foldersRes = await c.query(
    "SELECT id, name, parent_id FROM folders ORDER BY id"
  );
  const folderByName = {}; // name → { id, parent_id }
  foldersRes.rows.forEach((f) => {
    folderByName[f.name] = { id: Number(f.id), parent_id: f.parent_id };
  });

  // Helper: get or create folder
  async function getOrCreateFolder(name, parentName) {
    if (folderByName[name]) return folderByName[name].id;

    let parentId = null;
    if (parentName) {
      parentId = await getOrCreateFolder(parentName, null);
    }

    const ins = await c.query(
      "INSERT INTO folders (name, parent_id, created_at) VALUES ($1, $2, now()) RETURNING id",
      [name, parentId]
    );
    const newId = Number(ins.rows[0].id);
    folderByName[name] = { id: newId, parent_id: parentId };
    console.log(`  [folder] Created "${name}" (id=${newId}, parent=${parentName || "root"})`);
    return newId;
  }

  // ── 2. Pre-create Legal parent folder ───────────────────────────────────
  await getOrCreateFolder("Legal", null);

  // ── 3. Get all DB assets by sha256 and url ───────────────────────────────
  const dbRes = await c.query(
    "SELECT id, folder_id, name, url, sha256 FROM assets WHERE is_active = true"
  );
  const dbBySha = {};
  const dbByUrl = {};
  dbRes.rows.forEach((a) => {
    if (a.sha256) dbBySha[a.sha256] = { id: Number(a.id), folder_id: Number(a.folder_id) };
    if (a.url) dbByUrl[a.url] = { id: Number(a.id), folder_id: Number(a.folder_id) };
  });

  // ── 4. Fix misplaced assets ──────────────────────────────────────────────
  console.log("=== Phase 1: Fix misplaced assets ===");
  for (const [sha, targetFolderName] of Object.entries(MISPLACED_BY_SHA)) {
    const existing = dbBySha[sha];
    if (!existing) continue;
    const targetId = await getOrCreateFolder(targetFolderName, null);
    if (existing.folder_id !== targetId) {
      await c.query("UPDATE assets SET folder_id=$1, is_active=true WHERE id=$2", [
        targetId,
        existing.id,
      ]);
      console.log(`  [move] asset#${existing.id} → folder "${targetFolderName}" (id=${targetId})`);
    }
  }

  // ── 5. Insert missing SSOT assets ───────────────────────────────────────
  console.log("\n=== Phase 2: Insert missing SSOT assets ===");
  let inserted = 0;
  let skipped = 0;
  let updated = 0;

  for (const sa of ssotAssets) {
    // Match by sha256 first, then by URL
    const existingBySha = sa.sha256 ? dbBySha[sa.sha256] : null;
    const existingByUrl = sa.url ? dbByUrl[sa.url] : null;
    const existing = existingBySha || existingByUrl;

    const cat = sa.category || "Uncategorized";
    const folderSpec = CATEGORY_TO_FOLDER[cat] || { name: "OpsPhoto", parent: null };
    const folderId = await getOrCreateFolder(folderSpec.name, folderSpec.parent);

    if (existing) {
      // Update metadata if name or folder is wrong
      const needsMove = existing.folder_id !== folderId;
      if (needsMove) {
        await c.query(
          "UPDATE assets SET folder_id=$1, name=$2, caption=$3, description=$4, sha256=COALESCE($5, sha256) WHERE id=$6",
          [
            folderId,
            sa.slug || sa.filename,
            sa.caption || null,
            sa.geo_context || null,
            sa.sha256 || null,
            existing.id,
          ]
        );
        updated++;
        console.log(`  [update+move] asset#${existing.id} "${sa.slug}" → folder ${folderSpec.name}`);
      }
      skipped++;
      continue;
    }

    // Insert new asset
    const type = assetType(sa.url);
    const ext = assetExt(sa.url);
    await c.query(
      `INSERT INTO assets
         (folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, now())`,
      [
        folderId,
        sa.slug || sa.filename,
        sa.caption || null,
        sa.geo_context || null,
        type,
        sa.url,
        ext,
        sa.size_bytes || null,
        sa.size_mb ? String(sa.size_mb) : null,
        sa.sha256 || null,
        sa.last_verified_iso ? new Date(sa.last_verified_iso) : null,
      ]
    );
    inserted++;
    console.log(`  [insert] "${sa.slug}" → folder "${folderSpec.name}" (${cat})`);
  }

  // ── 6. Update existing KTA credentials metadata ──────────────────────────
  console.log("\n=== Phase 3: Update existing Credentials metadata ===");
  const ktaAssets = ssotAssets.filter((a) => a.category === "Credentials");
  for (const sa of ktaAssets) {
    const ex = sa.sha256 ? dbBySha[sa.sha256] : null;
    if (!ex) continue;
    await c.query(
      "UPDATE assets SET name=$1, caption=$2, description=$3 WHERE id=$4",
      [sa.slug, sa.caption || null, sa.geo_context || null, ex.id]
    );
    console.log(`  [meta] Credentials asset#${ex.id} → name="${sa.slug}"`);
  }

  // ── 7. Summary ────────────────────────────────────────────────────────────
  console.log(`\n=== Done ===`);
  console.log(`  Inserted : ${inserted}`);
  console.log(`  Updated  : ${updated}`);
  console.log(`  Skipped  : ${skipped}`);

  // Final folder state
  const finalFolders = await c.query(
    "SELECT f.id, f.name, f.parent_id, count(a.id)::int c FROM folders f LEFT JOIN assets a ON a.folder_id=f.id GROUP BY f.id, f.name, f.parent_id ORDER BY f.parent_id NULLS FIRST, f.id"
  );
  console.log("\n=== Final folder structure ===");
  finalFolders.rows.forEach((f) => {
    const indent = f.parent_id ? "  └─ " : "";
    console.log(`${indent}[${f.id}] ${f.name} (${f.c} assets)`);
  });

  await c.end();
}

run().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
