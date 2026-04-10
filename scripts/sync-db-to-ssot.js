/**
 * sync-db-to-ssot.js
 *
 * Back-fill JVTO_SSOT_v4_0_CLEAN.json dengan data yang ada di DB tapi belum ada di SSOT.
 * Prinsip: NO-OVERWRITE — hanya mengisi field yang kosong/null di SSOT.
 *
 * Yang di-sync:
 *   A. destinations — back-fill field konten dari DB (description, safety_notes, dll)
 *                   — fix destinations dengan slug null
 *   B. crew_registry — back-fill phone, year_of_joining, db_id dari DB
 *
 * Run: node scripts/sync-db-to-ssot.js
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

const HR = (char = "─", len = 72) => console.log(char.repeat(len));
const H1 = (t) => { HR("═"); console.log(`  ${t}`); HR("═"); };
const H2 = (t) => { console.log(`\n${t}`); HR("─"); };

const stats = { destFields: 0, destSlugFix: 0, crewFields: 0, crewDbId: 0 };

async function run() {
  // Baca SSOT
  const ssot = JSON.parse(fs.readFileSync(SSOT_PATH, "utf8"));

  const c = new Client({ connectionString: DB_URL, connectionTimeoutMillis: 15000 });
  await c.connect();
  console.log("Connected to DB.\n");

  H1("DB → SSOT BACK-FILL");

  // ══════════════════════════════════════════════════════════════════════════
  // A. DESTINATIONS
  // ══════════════════════════════════════════════════════════════════════════
  H2("A. Destinations back-fill");

  // DB fields yang ingin di-pull ke SSOT (jika SSOT belum punya)
  const DB_PULL_FIELDS = [
    "description",
    "weather_by_season",
    "trail_details",
    "main_attractions",
    "key_highlights",
    "facilities",
    "safety_notes",
    "risk_factors",
    "environmental_factors",
    "emergency_contacts",
    "physical_requirements",
    "cultural_context",
    "tips_for_visitors",
  ];

  const ssotDests = ssot.destinations || [];

  for (let i = 0; i < ssotDests.length; i++) {
    const sd = ssotDests[i];
    if (!sd.db_id) {
      console.log(`  ⚠ SKIP ${sd.name} — tidak ada db_id`);
      continue;
    }

    const destRes = await c.query(
      `SELECT id, slug, short_slug, ${DB_PULL_FIELDS.join(", ")}
       FROM destinations WHERE id = $1 AND deleted_at IS NULL`,
      [sd.db_id]
    );

    if (destRes.rows.length === 0) {
      console.log(`  ❌ SKIP ${sd.name} — db_id=${sd.db_id} tidak ditemukan`);
      continue;
    }

    const dd = destRes.rows[0];
    const added = [];

    // Fix slug jika null di SSOT tapi ada di DB
    if (isBlank(sd.slug) && !isBlank(dd.slug)) {
      ssotDests[i].slug = dd.slug;
      added.push("slug");
      stats.destSlugFix++;
    }
    if (isBlank(sd.short_slug) && !isBlank(dd.short_slug)) {
      ssotDests[i].short_slug = dd.short_slug;
      added.push("short_slug");
    }

    // Pull each DB field ke SSOT jika SSOT kosong
    for (const f of DB_PULL_FIELDS) {
      const dbVal = dd[f];
      // Skip jika DB kosong juga
      if (isBlank(dbVal)) continue;
      // Skip jika SSOT sudah punya
      if (!isBlank(sd[f])) continue;

      // Parse JSON fields dari DB (datang sebagai string atau object)
      let val = dbVal;
      if (typeof val === "string") {
        try { val = JSON.parse(val); } catch (_) { /* biarkan string */ }
      }

      ssotDests[i][f] = val;
      added.push(f);
      stats.destFields++;
    }

    if (added.length > 0) {
      console.log(`  ✅ ${sd.name} — added/fixed: ${added.join(", ")}`);
    } else {
      console.log(`  ─  ${sd.name} — tidak ada data baru dari DB`);
    }
  }

  // Update SSOT destinations
  ssot.destinations = ssotDests;
  console.log(`\n  → ${stats.destFields} fields back-filled, ${stats.destSlugFix} slugs fixed`);

  // ══════════════════════════════════════════════════════════════════════════
  // B. CREW BACK-FILL
  // ══════════════════════════════════════════════════════════════════════════
  H2("B. Crew back-fill (DB → SSOT crew_registry)");

  const ssotCrew = ssot.crew_registry || [];

  const dbCrewRes = await c.query(
    "SELECT id, code, name, full_name, phone, year_of_joining FROM crew_members WHERE deleted_at IS NULL"
  );
  const dbCrew = dbCrewRes.rows;

  for (let i = 0; i < ssotCrew.length; i++) {
    const sc = ssotCrew[i];
    const scNameLower = sc.name?.toLowerCase() || "";
    const scFirstWord = scNameLower.split(/[\s(]/)[0]; // "boy" from "Boy (Ahboy)", "pras" from "Pras"
    const dc = dbCrew.find(
      (r) =>
        (r.code && r.code === sc.id) ||
        r.name?.toLowerCase() === scNameLower ||
        r.full_name?.toLowerCase() === scNameLower ||
        (scFirstWord.length >= 3 && r.name?.toLowerCase() === scFirstWord) ||
        (scFirstWord.length >= 4 && r.name?.toLowerCase().startsWith(scFirstWord))
    );

    if (!dc) {
      console.log(`  ❌ SKIP ${sc.name} — tidak ditemukan di DB`);
      continue;
    }

    const added = [];

    // Tambahkan db_id jika belum ada
    if (!sc.db_id) {
      ssotCrew[i].db_id = Number(dc.id);
      added.push("db_id");
      stats.crewDbId++;
    }

    // Ensure internal_contact object ada
    if (!ssotCrew[i].internal_contact) ssotCrew[i].internal_contact = {};

    // phone
    if (!isBlank(dc.phone) && isBlank(sc.internal_contact?.phone)) {
      ssotCrew[i].internal_contact.phone = dc.phone;
      added.push("internal_contact.phone");
      stats.crewFields++;
    }

    // year_of_joining
    if (!isBlank(dc.year_of_joining) && isBlank(sc.internal_contact?.year_of_joining)) {
      ssotCrew[i].internal_contact.year_of_joining = dc.year_of_joining;
      added.push("internal_contact.year_of_joining");
      stats.crewFields++;
    }

    if (added.length > 0) {
      console.log(`  ✅ ${sc.name} — added: ${added.join(", ")}`);
    } else {
      console.log(`  ─  ${sc.name} — tidak ada data baru dari DB`);
    }
  }

  ssot.crew_registry = ssotCrew;
  console.log(`\n  → ${stats.crewDbId} db_id added, ${stats.crewFields} crew fields back-filled`);

  // ══════════════════════════════════════════════════════════════════════════
  // UPDATE SSOT METADATA
  // ══════════════════════════════════════════════════════════════════════════
  H2("Updating SSOT metadata");

  // Update ssot_meta dengan timestamp sync
  if (!ssot.ssot_meta) ssot.ssot_meta = {};
  ssot.ssot_meta.last_db_sync = new Date().toISOString();
  ssot.ssot_meta.sync_version = (ssot.ssot_meta.sync_version || 0) + 1;

  console.log(`  ssot_meta.last_db_sync = ${ssot.ssot_meta.last_db_sync}`);
  console.log(`  ssot_meta.sync_version = ${ssot.ssot_meta.sync_version}`);

  // ══════════════════════════════════════════════════════════════════════════
  // TULIS SSOT
  // ══════════════════════════════════════════════════════════════════════════
  H2("Menulis SSOT JSON");

  // Buat backup dulu
  const backupPath = SSOT_PATH.replace(".json", `_backup_${Date.now()}.json`);
  fs.copyFileSync(SSOT_PATH, backupPath);
  console.log(`  Backup: ${path.basename(backupPath)}`);

  // Tulis file baru
  fs.writeFileSync(SSOT_PATH, JSON.stringify(ssot, null, 2), "utf8");
  const newSize = fs.statSync(SSOT_PATH).size;
  console.log(`  ✅ SSOT ditulis ulang: ${(newSize / 1024).toFixed(1)} KB`);

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  H2("SUMMARY");
  console.log(`  Destination fields back-filled : ${stats.destFields}`);
  console.log(`  Destination slugs fixed        : ${stats.destSlugFix}`);
  console.log(`  Crew db_id added               : ${stats.crewDbId}`);
  console.log(`  Crew fields back-filled        : ${stats.crewFields}`);
  console.log("");
  console.log("  Verifikasi: node scripts/audit-sync-status.js");
  console.log("");

  await c.end();
}

run().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
