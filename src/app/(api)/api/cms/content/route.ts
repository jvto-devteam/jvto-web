import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function serializeBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = serializeBigInt(value);
      return acc;
    }, {} as any);
  }
  return obj;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      prisma.content_pages.findMany({
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
      }),
      prisma.content_pages.count(),
    ]);

    return NextResponse.json({
      data: content.map(serializeBigInt),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/cms/content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { route, lang, title, is_active, seo, content } = body;

    const newPage = await prisma.content_pages.create({
      data: {
        route,
        lang: lang || 'en',
        title,
        is_active: is_active || true,
        seo: seo || {},
        content: content || {},
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('POST /api/cms/content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, route, lang, title, is_active, seo, content } = body;

    const updated = await prisma.content_pages.update({
      where: { id },
      data: {
        route,
        lang,
        title,
        is_active,
        seo,
        content,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/cms/content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.content_pages.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cms/content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
