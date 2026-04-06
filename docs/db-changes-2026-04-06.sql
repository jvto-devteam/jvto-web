-- =============================================================================
-- JVTO DB Mirror — Audit Log Perubahan Database
-- Tanggal  : 2026-04-06
-- Database : jvto_dev @ 31.97.223.43:5432
-- Author   : sam-workspace (Claude Code session)
-- =============================================================================
-- File ini berisi SELURUH query yang dijalankan ke database dalam sesi ini,
-- dalam urutan kronologis. Dibagi per fase untuk kemudahan audit.
-- =============================================================================


-- =============================================================================
-- FASE 1 — SCHEMA EXTENSION (ALTER TABLE)
-- Tujuan: Menambah kolom baru untuk fitur CMS workflow, CRM ringan,
--         Customer Portal, dan Ads/Marketing attribution.
-- Tidak ada kolom yang dihapus. Semua kolom baru nullable atau punya default.
-- =============================================================================

-- 1a. content_pages: tambah CMS workflow state
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_content_pages_status ON content_pages (status);

-- Backfill: tandai semua baris lama sebagai 'published'
UPDATE content_pages SET status = 'published' WHERE status IS NULL;

-- 1b. customers: tambah CRM segmentasi fields
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_tags TEXT[] NOT NULL DEFAULT '{}';

-- 1c. bookings: tambah portal magic link + CRM ownership + UTM attribution
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS portal_access_token TEXT UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS staff_owner_id BIGINT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS utm_campaign TEXT;


-- =============================================================================
-- FASE 2 — FOLDER STRUCTURE (INSERT INTO folders)
-- Tujuan: Membuat hirarki folder baru sesuai SSOT asset taxonomy.
-- Sebelumnya hanya ada 9 folder (id 1-30). Ditambah 11 folder baru (id 31-41).
-- Struktur:
--   Legal (31)
--     └─ BusinessID (33)
--     └─ License (36)
--     └─ Membership (37)
--     └─ PoliceDocs (39)
--   Brand (32)
--   Founder (34)
--   History (35)
--   OpsPhoto (38)
--   Press (40)
--   Screening (41)
-- =============================================================================

INSERT INTO folders (id, name, parent_id, created_at) VALUES (31, 'Legal',      NULL, '2026-04-06T08:27:51.302Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (32, 'Brand',      NULL, '2026-04-06T08:27:51.657Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (33, 'BusinessID', 31,   '2026-04-06T08:27:51.839Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (34, 'Founder',    NULL, '2026-04-06T08:27:52.602Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (35, 'History',    NULL, '2026-04-06T08:27:53.303Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (36, 'License',    31,   '2026-04-06T08:27:53.896Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (37, 'Membership', 31,   '2026-04-06T08:27:54.119Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (38, 'OpsPhoto',   NULL, '2026-04-06T08:27:54.608Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (39, 'PoliceDocs', 31,   '2026-04-06T08:27:56.433Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (40, 'Press',      NULL, '2026-04-06T08:27:57.128Z');
INSERT INTO folders (id, name, parent_id, created_at) VALUES (41, 'Screening',  NULL, '2026-04-06T08:27:57.613Z');


-- =============================================================================
-- FASE 3 — PERBAIKAN ASSET SALAH FOLDER (UPDATE assets)
-- Tujuan: Pindahkan asset yang sudah ada tapi masuk folder yang salah
--         sesuai SSOT category mapping.
-- =============================================================================

-- Asset #164: stefan-loose-guidebook-page-287
-- Sebelumnya: folder 29 (Logo) — salah diklasifikasikan
-- Sesudahnya: folder 35 (History) — sesuai SSOT category "Historical Validation"
UPDATE assets SET folder_id = 35, is_active = true WHERE id = 164;


-- =============================================================================
-- FASE 4 — INSERT ASET BARU DARI SSOT (INSERT INTO assets)
-- Tujuan: Sync 52 aset canonical dari SSOT assets_inventory yang belum ada di DB.
-- Match dilakukan berdasarkan sha256 + url. Yang sudah ada di-skip.
-- Rentang ID baru: 173–224 (52 baris)
-- =============================================================================

-- ── FOLDER 32: Brand ─────────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(173, 32, 'jvto-hero-image', 'Website Hero Image.', 'Visual Identity: High-resolution hero imagery representing the Bromo-Ijen corridor.', 'image', 'https://javavolcano-touroperator.com/assets/img/hero/home.webp', 'webp', NULL, NULL, '2dc90147fd9d35a1ac134865d5c2743c89a2cf13abf2917eda327c962d45cde0', '2025-12-01T17:00:00.000Z', true, '2026-04-06T08:27:51.716Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(174, 32, 'jvto-logo-main', 'JVTO Official Logo.', 'Brand Identity: Official logo of PT Java Volcano Rendezvous.', 'image', 'https://javavolcano-touroperator.com/assets/img/jvto-color.png', 'png', NULL, NULL, 'd4656af297a92e9f2a22a120e194b22106566d05da550226d1c52046b29caf0f', '2025-12-01T17:00:00.000Z', true, '2026-04-06T08:27:51.780Z');

-- ── FOLDER 33: Legal/BusinessID ──────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(175, 33, 'nib-1102230032918', 'Business Identification Number (NIB) 1102230032918 official registration.', 'Corporate Legality: Official NIB document registered under KBLI 79121, 79911, and 62019.', 'document', 'https://javavolcano-touroperator.com/legal/NIB-1102230032918.pdf', 'pdf', 775447, '0.7395', 'fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:52.424Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(176, 33, 'nib-1102230032918-preview-png', 'NIB 1102230032918 preview image.', 'Preview Asset: Quick-view version of the official NIB document.', 'image', 'https://javavolcano-touroperator.com/legal/NIB-1102230032918-preview.png', 'png', 175149, '0.1670', '95ed8526dc882aaff37496ba985a361e25d08685d372fcff39788f16f372f7a4', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:52.482Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(177, 33, 'nib-1102230032918-preview-webp', 'NIB 1102230032918 preview image (WebP).', 'Preview Asset: Web-optimized version of the NIB certificate.', 'image', 'https://javavolcano-touroperator.com/legal/NIB-1102230032918-preview.webp', 'webp', 51762, '0.0494', 'e0abc309a4f04ee9460ff7fb87a33659b79be2b8f3bc05d20db9afdcefb6cc25', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:52.543Z');

-- ── FOLDER 34: Founder ───────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(178, 34, 'mr-sam-tourist-police-portrait', 'Active Tourist Police leadership behind every JVTO trip.', 'Authority Signal: Founder portrait in official Tourist Police uniform (Ditpamobvit).', 'image', 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Agung_Sambuko.jpg', 'jpg', 11178098, '10.6603', '1b9e36780e4365224f21ab3ec7153a88be2343782a363534fa1cf76bc9251752', '2025-11-10T00:00:00.000Z', true, '2026-04-06T08:27:52.661Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(179, 34, 'mr-sam-tourist-police-portrait-png', 'Active Tourist Police leadership behind every JVTO trip.', 'Authority Signal: High-fidelity portrait of the founder in uniform.', 'image', 'https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png', 'png', 11178098, '10.6603', '1b9e36780e4365224f21ab3ec7153a88be2343782a363534fa1cf76bc9251752', '2025-11-10T00:00:00.000Z', true, '2026-04-06T08:27:52.718Z');

-- ── FOLDER 35: History ───────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(180, 35, 'booking-2015-plaque', 'Guesthouse era recognition (2015).', 'Proven Longevity: Booking.com Award (2015) verifying 10+ years of operation.', 'image', 'https://javavolcano-touroperator.com/history/booking-2015-plaque.jpg', 'jpg', 332183, '0.3168', '08ce8e519b936df53d8dc2b4b98df06604eca9d8d633a6f5e1b8709022a13c9b', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:53.361Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(181, 35, 'booking-2015-shipping-label', 'Award shipped to residential address used for the family-run guesthouse.', 'Address Verification: Historical shipping label confirming physical presence since 2015.', 'image', 'https://javavolcano-touroperator.com/history/booking-2015-shipping-label.jpg', 'jpg', 321695, '0.3217', '4eec3756b0f4afef8ea799ad08d1b2f098f75eba2eba45e8519ced3b64594549', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:53.419Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(182, 35, 'guest-visit-stefan-loose', 'Guests visiting Ijen Bondowoso Homestay after reading the Stefan Loose guide.', 'Editorial Validation: Guests verifying Stefan Loose guidebook recommendation on-site.', 'image', 'https://javavolcano-touroperator.com/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg', 'jpg', 218839, '0.2188', '41dcdcd2e08778b0212c1b7006455b5b1b2d66282defcde813f0a3ea96407fbc', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:53.735Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(183, 35, 'stefan-loose-crop-enh', 'Cropped/enhanced screenshot of the Stefan Loose travel guide page (for clearer reading).', 'Textual Evidence: Detailed mention in German guidebook confirming quality.', 'image', 'https://javavolcano-touroperator.com/history/stefan_loose_crop_enh.jpg', 'jpg', 617129, '0.5885', '410870f23842c49f6c27dd66931d1a22a4ecce247997fc382962fe93be3efc46', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:53.789Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(184, 35, 'stefan-loose-ijen-bondowoso-page', 'Early third-party mention in a European travel guide.', 'Independent Verification: 2018 Stefan Loose Guidebook entry (ISBN: 978-3-7701-7881-0).', 'image', 'https://javavolcano-touroperator.com/history/stefan-loose-ijen-bondowoso-page.png', 'png', 3354101, '3.1987', 'ecd5b591d3ba1b01341dcf75925a8e072dff53c1097111e99033bb1ac4f71e22', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:53.842Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(214, 35, 'founder-with-guests-stefan-loose', NULL, NULL, 'image', 'https://javavolcano-touroperator.com/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg', 'jpg', NULL, NULL, '41dcdcd2e08778b0212c1b7006455b5b1b2d66282defcde813f0a3ea96407fbc', '2025-11-06T17:00:00.000Z', true, '2026-04-06T08:27:58.021Z');

-- ── FOLDER 36: Legal/License ─────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(185, 36, 'tdup-1102230032918', 'Tourism Business Licence (TDUP) official registration document.', 'Operational License: TDUP License confirming authority for Tour Agency services.', 'document', 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918.pdf', 'pdf', 278637, '0.2657', '27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:53.953Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(186, 36, 'tdup-1102230032918-preview-png', 'TDUP licence preview image.', 'Preview Asset: Quick-view version of the Tourism License.', 'image', 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918-preview.png', 'png', 176238, '0.1681', 'da813266e1b7851d757852f8a9b575620060e9c2b094baad5cb687d5252e3d76', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:54.010Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(187, 36, 'tdup-1102230032918-preview-webp', 'TDUP licence preview image (WebP).', 'Preview Asset: Web-optimized version of the Tourism License.', 'image', 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918-preview.webp', 'webp', 96006, '0.0916', 'fa13b599a3cb5f1d31819b5acc3ac670eca5f22c5b5dee719d45289d593178e6', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:54.062Z');

-- ── FOLDER 37: Legal/Membership ──────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(188, 37, 'hpwki-approval', 'HPWKI membership approval letter (official PDF).', 'Standard Compliance: Official membership in Ijen Tourism Guide Association (HPWKI).', 'document', 'https://javavolcano-touroperator.com/legal/HPWKI-approval.pdf', 'pdf', 591265, '0.5639', 'ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:54.172Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(189, 37, 'hpwki-approval-preview-png', 'HPWKI approval letter preview image.', 'Visual Proof: Standard compliance and membership in HPWKI.', 'image', 'https://javavolcano-touroperator.com/legal/HPWKI-approval-preview.png', 'png', 1522424, '1.4519', '2bff4dde90a4113028898a4b3ce67783b49ceed272f4e842cd26aa37243cde36', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:54.231Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(190, 37, 'hpwki-approval-preview-webp', 'HPWKI approval letter preview image (WebP).', 'Preview Asset: Web-optimized version of HPWKI approval.', 'image', 'https://javavolcano-touroperator.com/legal/HPWKI-approval-preview.webp', 'webp', 124566, '0.1188', '9f2dc0c34370a39e1c964207b754a917f8c1e571a32bd042621ef5ca087301f1', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:54.289Z');

-- ── FOLDER 38: OpsPhoto ──────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(191, 38, 'baratha-hotel-departure-team', 'Pre-ascent lineup at Baratha Hotel with Tourist Police support.', 'Field Verification: Team departure lineup demonstrating uniformed standards and police support.', 'image', 'https://javavolcano-touroperator.com/ops/baratha-hotel-departure-team.jpg', 'jpg', 229640, '0.2189', 'e06195ba5d396adb1a66191f9f677b4f954b9bcfcbe5d114c27192852d0acd2e', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:55.447Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(192, 38, 'group-at-jvto-office', 'International group visiting JVTO Bondowoso operations office.', 'Social Proof: International guests visiting the physical Bondowoso headquarters.', 'image', 'https://javavolcano-touroperator.com/ops/group-at-jvto-office.jpg', 'jpg', 132498, '0.1263', 'e0cca429bda5e4f49b17878800c0328828c4bac74c039044bbe2c6d4a7a4d838', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:55.505Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(193, 38, 'guest-welcome-evening', 'Evening welcome with guests at JVTO office.', 'Service Standard: Pre-tour briefing and welcome protocol at HQ.', 'image', 'https://javavolcano-touroperator.com/ops/guest-welcome-evening.png', 'png', 1491416, '1.4222', '5b3e7eed6dc2e2334fbb9f0bc112bbf9b30b8e6c3ac41a13836881d82c829925', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:55.562Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(194, 38, 'ijen-geopark-briefing', 'Tourist Police briefing at Ijen Geopark Information Center with local miners present.', 'Institutional Leadership: Leading the briefing at Ijen Geopark Information Center.', 'image', 'https://javavolcano-touroperator.com/ops/ijen-geopark-briefing.png', 'png', 1807019, '1.7237', '72eb0d8f1629f2b97cbb8dc77535396ea15a260033df52cb93bd96e33e2e86c3', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:56.143Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(195, 38, 'office-photo', 'JVTO Bondowoso operations office.', 'Physical Verification: Brick-and-mortar headquarters in Bondowoso (Anti-Ghost Operator).', 'image', 'https://javavolcano-touroperator.com/legal/office-photo.jpg', 'jpg', 755370, '0.7204', '7850e39f80a5a42243982a33fc027e1d38f33bd28f7cda56fc2e243790340a0f', '2025-10-25T00:00:00.000Z', true, '2026-04-06T08:27:56.203Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(196, 38, 'police-escort-arrival-day', 'Traffic Police escorted arrival at the hotel in Bondowoso group photo with the patrol car.', 'Safety Capability: Documented Traffic Police (Patwal) escort for group arrival.', 'image', 'https://javavolcano-touroperator.com/ops/jvto-police-escort-arrival-hotel-bondowoso-day.jpg', 'jpg', 936766, '0.8934', '54cfc8c8d144ea7fd7ece5301a2e51b584bce237a6f4d5523cb5242c0c0cecf5', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:56.261Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(197, 38, 'police-escort-arrival-night', 'Arriving in Bondowoso with a Traffic Police escort group photo at the hotel after the journey.', '24/7 Safety: Nighttime police escort capability for secure transfers.', 'image', 'https://javavolcano-touroperator.com/ops/jvto-police-escort-arrival-hotel-bondowoso-night.jpg', 'jpg', 535850, '0.5359', '5068da0cc718b43880c54077819c72bf6bce1c8e024a7e4b34b89e6a287bfa89', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:56.318Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(198, 38, 'police-vehicle-support', 'Police support vehicle and group prior to departure.', 'Logistical Integration: Use of official Police vehicles for operational support.', 'image', 'https://javavolcano-touroperator.com/ops/police-vehicle-support.jpg', 'jpg', 641401, '0.6117', '475ddae5f4c646f8200491df7c67e17a6a14c28a67842f91e831512c98d62b30', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:56.375Z');

-- ── FOLDER 39: Legal/PoliceDocs ──────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(199, 39, 'sprin-polpar', 'Tourist Police assignment letter (SPRIN POLPAR) official PDF.', 'Institutional Integration: Official assignment letter proving Ditpamobvit status.', 'document', 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.pdf', 'pdf', 420247, '0.4008', '03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:56.491Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(200, 39, 'sprin-polpar-png', 'Tourist Police assignment letter (SPRIN POLPAR) image copy.', 'Visual Asset: High-fidelity image of the Tourist Police assignment letter.', 'image', 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.png', 'png', 143012, '0.1364', 'f6b689c226220d2d4f2e61ce60a7b35c5e064ec2ef08a9bc4c24a5a8e47ad24a', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:56.547Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(201, 39, 'sprin-polpar-webp', 'Tourist Police assignment letter (SPRIN POLPAR) preview image.', 'Preview Asset: Web-optimized version of the SPRIN document.', 'image', 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.webp', 'webp', 45002, '0.0429', '4484e4e191176a057d683f2a8c3e46491617c5059fe4596c085f7f854c1082fa', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:56.608Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(202, 39, 'sprin-wal-travel-2024-02-12', 'Police travel order (SPRIN WAL-TRAVEL), 12 Feb 2024 official PDF.', 'Operational Coordination: Documented police patrol order for high-security logistics.', 'document', 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf', 'pdf', 199164, '0.1899', '179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:56.665Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(203, 39, 'sprin-wal-travel-2024-02-12-png', 'Police travel order (SPRIN WAL-TRAVEL), 12 Feb 2024 image copy.', 'Visual Asset: High-fidelity image of the Police Travel Order.', 'image', 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.png', 'png', 134433, '0.1282', '48cd3d353b15075b2cf833cea17b1926f6c8b24686bfdeb6808d8261d72a42c5', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:56.724Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(204, 39, 'sprin-wal-travel-2024-02-12-webp', 'Police travel order (SPRIN WAL-TRAVEL), 12 Feb 2024 preview image.', 'Preview Asset: Web-optimized version of the Travel Order.', 'image', 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp', 'webp', 42908, '0.0409', '8b65a41b4897e011a8f8623ad11fd2fca8d7ec46dcb34c5944aab7d747a792c7', '2025-11-05T00:00:00.000Z', true, '2026-04-06T08:27:57.070Z');

-- ── FOLDER 40: Press ─────────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(205, 40, 'press-bbksda-ijen-guide-training', 'BBKSDA Jatim official training article: HPWKI members participate in Ijen guide safety training (SAR & emergency first aid).', 'Government Record: BBKSDA certification of HPWKI members in SAR and First Aid.', 'image', 'https://javavolcano-touroperator.com/press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen.png', 'png', 984370, '0.9388', 'b75668f98b78a54007b8bc0a8f4e0b3e46797dd6af47c158fb2b6a54bfb0b111', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.186Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(206, 40, 'press-detik-polisi-pariwisata-2021-03-14', 'Press mention screenshot (Detik.com) with founder name variant in Tourist Police context.', 'Media Validation: Detik.com article covering founder''s duty.', 'image', 'https://javavolcano-touroperator.com/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png', 'png', 853153, '0.8136', 'b257b75b3d2b9edebf07c9af89a6c6aa9a4e01d6a716ef3f7c4ca75deda64b77', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.244Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(207, 40, 'press-radarjember-polpar-ijen-geopark-2021-03-24', 'Press mention screenshot (Radar Jember) about Tourist Police formation for Ijen Geopark.', 'Media Validation: Radar Jember report on the formation of Bondowoso Tourist Police.', 'image', 'https://javavolcano-touroperator.com/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png', 'png', 404604, '0.3859', '2a60eb168274004283b2b9939ccbf5982c12a7db854fda014308a2494ee2abf4', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.558Z');

-- ── FOLDER 41: Screening ─────────────────────────────────────────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(208, 41, 'ijen-screening-hotel-01', 'Pre-ascent health screening at partner hotel.', 'Mandatory Protocol: Digital logging of blood pressure and SpO2 before ascent.', 'image', 'https://javavolcano-touroperator.com/screening/ijen-screening-hotel-01.jpeg', 'jpeg', 212986, '0.2031', 'c52194bb0db9c5ada6f22660a954acb03071925ea364b5e5b0c5e8eb919ebb77', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.672Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(209, 41, 'ijen-screening-hotel-02', 'Vitals taken and logged before night ascent.', 'Field Verification: Medical staff performing mandatory checks at hotel base.', 'image', 'https://javavolcano-touroperator.com/screening/ijen-screening-hotel-02.jpg', 'jpg', 139109, '0.1391', 'e86a1e7d9d3e797f1d2d2ea0b2732103c9d980356bfb474bf16584772580eeec', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.729Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(210, 41, 'jvto-office-screening-1', 'Digitally recorded, signed clearance issuance.', 'Protocol Enforcement: Signing of health clearance documents at JVTO HQ.', 'image', 'https://javavolcano-touroperator.com/screening/jvto-office-screening-1.JPG', 'jpg', 1070965, '1.0214', '70370b0d85e0b5d0d92e317fd0f4d6880da6acbdf4a04efb5c20c4e2eac05e18', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.786Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(211, 41, 'jvto-office-screening-2', 'Screening can be done at hotel or office.', 'Protocol Flexibility: Verified screening capability at both HQ and partner hotels.', 'image', 'https://javavolcano-touroperator.com/screening/jvto-office-screening-2.jpg', 'jpg', 534942, '0.5349', '5f298bd424b765e96a424be5f6aa016f59a82c2e675afacc547f2ec692d33bd9', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.843Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(212, 41, 'print-surat-sehat', 'Health clearance (surat sehat) printable PDF.', 'Documentation: Standardized Health Clearance Form (Surat Sehat) template.', 'document', 'https://javavolcano-touroperator.com/screening/print-surat-sehat.pdf', 'pdf', 32053, '0.0321', '185a35c324e981c8e0bd0365a8dc919d1cbb151ba24bd28910f737978011b985', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.904Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(213, 41, 'print-surat-sehat-preview', 'Sample printout of health clearance (surat sehat) preview image.', 'Documentation: Sample view of the JVTO standardized health clearance form.', 'image', 'https://javavolcano-touroperator.com/screening/print-surat-sehat-preview.png', 'png', 95621, '0.0912', '343c4ea846c1ec8c91e74054b90412d33ad26c4a8bf6366287e360cb0231bb59', '2025-11-07T00:00:00.000Z', true, '2026-04-06T08:27:57.962Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(215, 41, 'bbksda-surat-edaran-se-1658-ksa-9-2024', NULL, NULL, 'document', 'https://javavolcano-touroperator.com/screening/bbksda/05012024_Edaran_Pembukaan_TWA_Kawah_Ijen.pdf', 'pdf', NULL, NULL, '86f9c225cff91a9ae04332d469a17c70264c4be681572822601096c86ab4148a', NULL, true, '2026-04-06T08:27:58.398Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(216, 41, 'bbksda-ticket-terms-screenshot', NULL, NULL, 'image', 'https://javavolcano-touroperator.com/screening/bbksda/bbksda-ticket-terms-screenshot.jpeg', 'jpeg', NULL, NULL, 'c40c6e3cbe076d21991164e98207428a61f771d21459f831df6569a2dfe7485c', NULL, true, '2026-04-06T08:27:58.721Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(217, 41, 'sip-dr-ahmad-irwandanu-2026', NULL, NULL, 'document', 'https://javavolcano-touroperator.com/screening/SIP_DOKTER_AHMAD_IRWANDANU_2026.pdf', 'pdf', NULL, NULL, '82f2535b87066fef23cf3012ed3bc1cb18c124e03045ab544067e51d78ac80aa', NULL, true, '2026-04-06T08:27:58.777Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(218, 41, 'health-screening-form-sample-2026-02-17', NULL, NULL, 'document', 'https://javavolcano-touroperator.com/screening/Print_Surat_Sehat_2026.pdf', 'pdf', NULL, NULL, '048712c02e1975018036ada8e60a8a6e3e336dcc819e12842ecc48eff6d8826e', NULL, true, '2026-04-06T08:27:59.095Z');

-- ── FOLDER 29: Logo (ReviewPlatform + PartnerVerification) ───────────────────
INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(219, 29, 'trustpilot-live-profile', NULL, NULL, 'image', 'https://trustpilot.com/review/javavolcano-touroperator.com', 'com', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.153Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(220, 29, 'tripadvisor-live-profile', NULL, NULL, 'image', 'https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html', 'html', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.210Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(221, 29, 'google-maps-live-cid', NULL, NULL, 'image', 'https://www.google.com/maps?cid=1266403973589689021', 'com/maps', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.267Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(222, 29, 'getyourguide-live-supplier', NULL, NULL, 'image', 'https://www.getyourguide.com/java-volcano-tour-operator-s260697/', 'com/java-volcano-tour-operator-s260697/', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.328Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(223, 29, 'indecon-live-member', NULL, NULL, 'image', 'https://www.indecon.id/spotlight-networks/java-volcano-tour-operator', 'id/spotlight-networks/java-volcano-tour-operator', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.385Z');

INSERT INTO assets (id, folder_id, name, caption, description, type, url, file_ext, size_bytes, size_megabytes, sha256, last_verified, is_active, created_at) VALUES
(224, 29, 'isic-live-provider', NULL, NULL, 'image', 'https://www.isic.org/discounts/?providerId=259268', 'org/discounts/', NULL, NULL, NULL, '2026-03-12T00:00:00.000Z', true, '2026-04-06T08:27:59.705Z');


-- =============================================================================
-- FASE 5 — UPDATE METADATA KTA CREDENTIALS (UPDATE assets)
-- Tujuan: Sinkronisasi nama aset KTA di folder 30 (Crews/KTA Guide Ijen)
--         sesuai SSOT slug. Aset-aset ini sudah ada sebelumnya, hanya
--         nama dan caption yang diupdate.
-- =============================================================================

UPDATE assets SET name = 'kta-kiki'   WHERE id = 168;
UPDATE assets SET name = 'kta-anjas'  WHERE id = 169;
UPDATE assets SET name = 'kta-taufik' WHERE id = 170;
UPDATE assets SET name = 'kta-gufron' WHERE id = 171;
UPDATE assets SET name = 'kta-rendi'  WHERE id = 172;


-- =============================================================================
-- FASE 6 — INSERT TAGS BARU (INSERT INTO tags_assets)
-- Tujuan: Buat tag taxonomy untuk klasifikasi aset.
-- Sebelumnya ada 5 tag (id 1-5). Ditambah 28 tag baru (id 6-33).
-- =============================================================================

INSERT INTO tags_assets (id, name) VALUES
(6,  'brand'),
(7,  'identity'),
(8,  'legal'),
(9,  'business-id'),
(10, 'nib'),
(11, 'founder'),
(12, 'history'),
(13, 'trust'),
(14, 'license'),
(15, 'tdup'),
(16, 'membership'),
(17, 'hpwki'),
(18, 'operations'),
(19, 'photo'),
(20, 'police'),
(21, 'sprin'),
(22, 'press'),
(23, 'media'),
(24, 'health'),
(25, 'screening'),
(26, 'ijen'),
(27, 'crew'),
(28, 'credentials'),
(29, 'kta'),
(30, 'review'),
(31, 'platform'),
(32, 'partner'),
(33, 'verification');


-- =============================================================================
-- FASE 7 — INSERT ASSET-TAG LINKS (INSERT INTO asset_tags)
-- Tujuan: Hubungkan setiap aset ke tag yang relevan.
-- Total: 141 link (mencakup aset lama id 164, 168-172 + semua aset baru 173-224)
-- =============================================================================

INSERT INTO asset_tags (asset_id, tag_id) VALUES
-- Asset #164: stefan-loose-guidebook-page-287 (History folder, moved)
(164, 12), (164, 13),
-- Assets #168-172: KTA Credentials (crew guides)
(168, 27), (168, 28), (168, 29),
(169, 27), (169, 28), (169, 29),
(170, 27), (170, 28), (170, 29),
(171, 27), (171, 28), (171, 29),
(172, 27), (172, 28), (172, 29),
-- Assets #173-174: Brand
(173, 6), (173, 7),
(174, 6), (174, 7),
-- Assets #175-177: BusinessID / NIB
(175, 8), (175, 9), (175, 10),
(176, 8), (176, 9), (176, 10),
(177, 8), (177, 9), (177, 10),
-- Assets #178-179: Founder portraits
-- NOTE: asset#178 has no tag (Wikimedia source, external-only)
(179, 7), (179, 11),
-- Assets #180-184: History
(180, 12), (180, 13),
(181, 12), (181, 13),
-- NOTE: asset#182 has no tags (duplicate sha — skipped by sync)
(183, 12), (183, 13),
(184, 12), (184, 13),
-- Assets #185-187: License / TDUP
(185, 8), (185, 14), (185, 15),
(186, 8), (186, 14), (186, 15),
(187, 8), (187, 14), (187, 15),
-- Assets #188-190: Membership / HPWKI
(188, 8), (188, 16), (188, 17),
(189, 8), (189, 16), (189, 17),
(190, 8), (190, 16), (190, 17),
-- Assets #191-198: OpsPhoto
(191, 18), (191, 19),
(192, 18), (192, 19),
(193, 18), (193, 19),
(194, 18), (194, 19),
(195, 18), (195, 19),
(196, 18), (196, 19),
(197, 18), (197, 19),
(198, 18), (198, 19),
-- Assets #199-204: PoliceDocs / SPRIN
(199, 8), (199, 20), (199, 21),
(200, 8), (200, 20), (200, 21),
(201, 8), (201, 20), (201, 21),
(202, 8), (202, 20), (202, 21),
(203, 8), (203, 20), (203, 21),
(204, 8), (204, 20), (204, 21),
-- Assets #205-207: Press
(205, 13), (205, 22), (205, 23),
(206, 13), (206, 22), (206, 23),
(207, 13), (207, 22), (207, 23),
-- Assets #208-213: Screening (with rich metadata)
(208, 24), (208, 25), (208, 26),
(209, 24), (209, 25), (209, 26),
(210, 24), (210, 25), (210, 26),
(211, 24), (211, 25), (211, 26),
(212, 24), (212, 25), (212, 26),
(213, 24), (213, 25), (213, 26),
-- Asset #214: History (founder-with-guests duplicate slug, different context)
(214, 12), (214, 13),
-- Assets #215-218: Screening (BBKSDA + SIP + forms, no rich metadata)
(215, 24), (215, 25),
(216, 24), (216, 25),
(217, 24), (217, 25),
(218, 24), (218, 25),
-- Assets #219-222: ReviewPlatform (Trustpilot, TripAdvisor, Google, GetYourGuide)
(219, 30), (219, 31),
(220, 30), (220, 31),
(221, 30), (221, 31),
(222, 30), (222, 31),
-- Assets #223-224: PartnerVerification (INDECON, ISIC)
(223, 32), (223, 33),
(224, 32), (224, 33);


-- =============================================================================
-- RINGKASAN PERUBAHAN
-- =============================================================================
--
-- TABEL          | OPERASI  | JUMLAH | KETERANGAN
-- ─────────────────────────────────────────────────────────────────────────────
-- content_pages  | ALTER    | 2 col  | status (default='published'), published_at
-- customers      | ALTER    | 3 col  | lifecycle_stage, source, customer_tags
-- bookings       | ALTER    | 5 col  | portal_access_token, staff_owner_id, utm_*
-- folders        | INSERT   | 11     | id 31–41 (Legal hierarchy + Brand, History, etc.)
-- assets         | UPDATE   | 1      | id 164 dipindah ke folder History (id=35)
-- assets         | INSERT   | 52     | id 173–224 (SSOT canonical assets)
-- assets         | UPDATE   | 5      | id 168–172 KTA credential name sync
-- tags_assets    | INSERT   | 28     | id 6–33 (tag taxonomy baru)
-- asset_tags     | INSERT   | 141    | link aset ↔ tag
-- ─────────────────────────────────────────────────────────────────────────────
-- Total baris baru: 11 + 52 + 28 + 141 = 232 baris INSERT
-- Total kolom baru: 2 + 3 + 5 = 10 kolom ALTER TABLE
-- Tidak ada tabel dihapus. Tidak ada kolom dihapus. Tidak ada data dihapus.
--
-- =============================================================================
