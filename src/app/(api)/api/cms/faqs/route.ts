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
    const category_id = searchParams.get('category_id');

    const where = category_id ? { category_id: BigInt(category_id) } : {};

    const [faqs, total] = await Promise.all([
      prisma.faqs.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { sort_order: 'asc' },
      }),
      prisma.faqs.count({ where }),
    ]);

    return NextResponse.json({
      data: faqs.map(serializeBigInt),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/cms/faqs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category_id, sort_order, is_published } = body;

    const newFaq = await prisma.faqs.create({
      data: {
        question,
        answer,
        category_id: category_id ? BigInt(category_id) : null,
        sort_order: sort_order || 0,
        is_published: is_published || true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(serializeBigInt(newFaq), { status: 201 });
  } catch (error) {
    console.error('POST /api/cms/faqs:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, question, answer, category_id, sort_order, is_published } = body;

    const updated = await prisma.faqs.update({
      where: { id: BigInt(id) },
      data: {
        question,
        answer,
        category_id: category_id ? BigInt(category_id) : undefined,
        sort_order,
        is_published,
        updated_at: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error('PUT /api/cms/faqs:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
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

    await prisma.faqs.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cms/faqs:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
