import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Pastikan route ini berjalan di Node.js runtime (bukan Edge)
export const runtime = 'nodejs';
// Karena ini data internal dan sering berubah saat edit konten
export const dynamic = 'force-dynamic';

type EavValueRow = {
  value_string: string | null;
  value_text: string | null;
  value_url: string | null;
  value_json: unknown | null;
  value_boolean: boolean | null;
  value_date: Date | null;
  attribute: { attribute_key: string };
};

function coalesceValue(v: EavValueRow) {
  if (v.value_json !== null && v.value_json !== undefined) return v.value_json;
  if (v.value_string !== null && v.value_string !== undefined) return v.value_string;
  if (v.value_text !== null && v.value_text !== undefined) return v.value_text;
  if (v.value_url !== null && v.value_url !== undefined) return v.value_url;
  if (v.value_boolean !== null && v.value_boolean !== undefined) return v.value_boolean;
  if (v.value_date !== null && v.value_date !== undefined) return v.value_date; // Date object
  return null;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  const lang = url.searchParams.get('lang') || 'en';

  if (!key) {
    return NextResponse.json(
      { error: 'Missing required query param: key' },
      { status: 400 }
    );
  }

  // Optional hardening: batasi hanya entity_key yang diawali page:
  // kalau kamu mau, uncomment ini.
  // if (!key.startsWith('page:')) {
  //   return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  // }

  // 1) Ambil page entity
  const page = await prisma.eav_entity.findUnique({
    where: { entity_key: key },
    select: { entity_id: true, entity_key: true, entity_type: true },
  });

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  // Optional: pastikan itu webpage
  // if (page.entity_type !== 'webpage') {
  //   return NextResponse.json({ error: 'Entity is not a webpage' }, { status: 400 });
  // }

  // 2) Ambil semua fields milik page (values + attribute_key)
  const pageValues = await prisma.eav_value.findMany({
    where: { entity_id: page.entity_id, lang },
    select: {
      value_string: true,
      value_text: true,
      value_url: true,
      value_json: true,
      value_boolean: true,
      value_date: true,
      attribute: { select: { attribute_key: true } },
    },
  });

  const page_fields: Record<string, unknown> = {};
  for (const v of pageValues as unknown as EavValueRow[]) {
    page_fields[v.attribute.attribute_key] = coalesceValue(v);
  }

  // 3) Ambil relasi sections terurut
  const sectionRels = await prisma.eav_relation.findMany({
    where: { from_entity_id: page.entity_id, rel_type: 'HAS_SECTION' },
    orderBy: [{ ord: 'asc' }],
    select: {
      ord: true,
      to_entity_id: true,
      to_entity: { select: { entity_key: true } },
    },
  });

  const sectionIds = sectionRels.map((r) => r.to_entity_id);

  // 4) Ambil semua values untuk semua section (batch)
  const sectionValues = sectionIds.length
    ? await prisma.eav_value.findMany({
        where: { entity_id: { in: sectionIds }, lang },
        select: {
          entity_id: true,
          value_string: true,
          value_text: true,
          value_url: true,
          value_json: true,
          value_boolean: true,
          value_date: true,
          attribute: { select: { attribute_key: true } },
        },
      })
    : [];

  // 5) Group values by section entity_id → fields object
  const fieldsByEntity: Record<string, Record<string, unknown>> = {};
  for (const v of sectionValues as any[]) {
    const eid = v.entity_id as string;
    if (!fieldsByEntity[eid]) fieldsByEntity[eid] = {};
    fieldsByEntity[eid][v.attribute.attribute_key] = coalesceValue(v);
  }

  // 6) Build response payload
  const sections = sectionRels.map((r) => ({
    ord: r.ord ?? null,
    section_key: r.to_entity.entity_key,
    fields: fieldsByEntity[r.to_entity_id] || {},
  }));

  return NextResponse.json({
    page_key: page.entity_key,
    page_fields,
    sections,
  });
}
