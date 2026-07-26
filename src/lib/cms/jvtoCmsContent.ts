// src/lib/cms/jvtoCmsContent.ts
// Adapter: presents jvto_cms (pages + page_sections) through the content_pages-shaped
// contract the existing CMS editors already speak — {route, lang, seo, content} where
// `content` = {h1, body_md|sections, faq, _draft, _history}. Lets the console read/write
// jvto_cms (the edit master) with zero editor-shape churn.
//
// jvto_cms mapping for a route:
//   pages(route, seo, h1, status, editable)  ← seo + is_active
//   the page_sections row with section_type='page_content'.content  ← content
// Writes set editable=true on both so an upstream refresh (load.sql) never clobbers them.
import { jvtoCmsPool } from "@/lib/cms/jvtoCmsClient";

// Shaped to stay assignment-compatible with the legacy prisma content_pages row so
// getContentPage's union type keeps working for every existing reader.
export interface CmsContentPageRow {
  id: string; // pages.id (uuid) — string, NOT the bigint content_pages id
  route: string;
  lang: string;
  seo: unknown;
  content: Record<string, unknown>;
  is_active: boolean;
  schema_version: number;
  created_at: Date | null;
  updated_at: Date | null;
}

const PAGE_CONTENT = "page_content";

/** Read a route as a content_pages-shaped row from jvto_cms (null if the page is absent). */
export async function getCmsContentPage(
  route: string,
  lang = "en",
): Promise<CmsContentPageRow | null> {
  const rows = await jvtoCmsPool().query(
    `SELECT p.id::text AS id, p.route, p.seo, p.h1, p.status,
            ps.content AS section_content
       FROM pages p
       LEFT JOIN page_sections ps
         ON ps.page_id = p.id AND ps.section_type = $2
      WHERE p.route = $1
      LIMIT 1`,
    [route, PAGE_CONTENT],
  );
  const r = rows.rows[0];
  if (!r) return null;
  const content =
    r.section_content && typeof r.section_content === "object"
      ? (r.section_content as Record<string, unknown>)
      : r.h1
        ? { h1: r.h1 }
        : {};
  return {
    id: r.id,
    route: r.route,
    lang,
    seo: r.seo ?? {},
    content,
    is_active: r.status === "published",
    schema_version: 1,
    created_at: null,
    updated_at: null,
  };
}

/** Read a route as a content_pages-shaped row addressed by the jvto_cms pages.id (uuid). */
export async function getCmsContentPageById(id: string): Promise<CmsContentPageRow | null> {
  const res = await jvtoCmsPool().query(`SELECT route FROM pages WHERE id = $1::uuid LIMIT 1`, [id]);
  const route = res.rows[0]?.route;
  if (!route) return null;
  return getCmsContentPage(route, "en");
}

/** List all editable-surface routes as content_pages-shaped rows (for the collections list). */
export async function listCmsContentPages(): Promise<CmsContentPageRow[]> {
  const rows = await jvtoCmsPool().query(
    `SELECT p.id::text AS id, p.route, p.seo, p.h1, p.status, p.editable,
            ps.content AS section_content
       FROM pages p
       LEFT JOIN page_sections ps
         ON ps.page_id = p.id AND ps.section_type = $1
      ORDER BY p.route ASC`,
    [PAGE_CONTENT],
  );
  return rows.rows.map((r) => ({
    id: r.id,
    route: r.route,
    lang: "en",
    seo: r.seo ?? {},
    content:
      r.section_content && typeof r.section_content === "object"
        ? (r.section_content as Record<string, unknown>)
        : r.h1
          ? { h1: r.h1 }
          : {},
    is_active: r.status === "published",
    schema_version: 1,
    created_at: null,
    updated_at: null,
  }));
}

/**
 * Upsert a route's editable content into jvto_cms (marks it editable=true so an
 * upstream refresh preserves it). Atomic: pages + its page_content section together.
 */
export async function upsertCmsContentPage(input: {
  route: string;
  lang?: string;
  seo?: unknown;
  content?: Record<string, unknown>;
  is_active?: boolean;
}): Promise<CmsContentPageRow> {
  const route = input.route.trim();
  const lang = input.lang?.trim() || "en";
  const seo = input.seo ?? {};
  const content = input.content ?? {};
  const h1 = typeof content.h1 === "string" ? content.h1 : null;
  const status = input.is_active === false ? "draft" : "published";

  const pool = jvtoCmsPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) pages — update the existing (seeded) route, or insert a brand-new one.
    const pageRes = await client.query(
      `INSERT INTO pages (route, file_group, sort_order, cluster, page_type, visual_mode, title, h1, seo, status, editable)
         VALUES ($1, '000', 999, 'hybrid', 'narrative', 'hybrid', $2, $2, $3::jsonb, $4, true)
       ON CONFLICT (route) DO UPDATE SET
         seo = EXCLUDED.seo,
         h1 = COALESCE(EXCLUDED.h1, pages.h1),
         status = EXCLUDED.status,
         editable = true
       RETURNING id::text AS id`,
      [route, h1, JSON.stringify(seo), status],
    );
    const pageId: string = pageRes.rows[0].id;

    // 2) page_content section — update in place, or append if the route had none.
    const secRes = await client.query(
      `UPDATE page_sections
          SET content = $2::jsonb, editable = true
        WHERE page_id = $1 AND section_type = $3
        RETURNING id`,
      [pageId, JSON.stringify(content), PAGE_CONTENT],
    );
    if (secRes.rowCount === 0) {
      await client.query(
        `INSERT INTO page_sections (page_id, sort_order, section_type, variant, content, editable)
           VALUES ($1, COALESCE((SELECT max(sort_order) + 1 FROM page_sections WHERE page_id = $1), 1),
                   $2, 'cms', $3::jsonb, true)`,
        [pageId, PAGE_CONTENT, JSON.stringify(content)],
      );
    }

    await client.query("COMMIT");
    return {
      id: pageId,
      route,
      lang,
      seo,
      content,
      is_active: status === "published",
      schema_version: 1,
      created_at: null,
      updated_at: null,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * "Reset" a route's override: clear the editable flag on its page + page_content
 * section so the next upstream refresh (load.sql) restores the synced baseline.
 * (jvto_cms is the master, so a route always exists — we never delete the page.)
 */
export async function resetCmsContentPageByRoute(route: string): Promise<boolean> {
  const pool = jvtoCmsPool();
  const res = await pool.query(
    `UPDATE pages SET editable = false WHERE route = $1`,
    [route],
  );
  await pool.query(
    `UPDATE page_sections ps SET editable = false
       FROM pages p WHERE ps.page_id = p.id AND p.route = $1 AND ps.section_type = $2`,
    [route, PAGE_CONTENT],
  );
  return (res.rowCount ?? 0) > 0;
}

/** Same reset, addressed by the jvto_cms pages.id (uuid). */
export async function resetCmsContentPageById(id: string): Promise<boolean> {
  const pool = jvtoCmsPool();
  const res = await pool.query(`UPDATE pages SET editable = false WHERE id = $1::uuid RETURNING route`, [id]);
  const route = res.rows[0]?.route;
  if (!route) return false;
  await pool.query(
    `UPDATE page_sections ps SET editable = false
       FROM pages p WHERE ps.page_id = p.id AND p.route = $1 AND ps.section_type = $2`,
    [route, PAGE_CONTENT],
  );
  return true;
}
