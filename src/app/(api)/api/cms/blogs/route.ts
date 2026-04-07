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

    const [blogs, total] = await Promise.all([
      prisma.blogs.findMany({
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.blogs.count(),
    ]);

    return NextResponse.json({
      data: blogs.map(serializeBigInt),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/cms/blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, cover_image, category_id, status } = body;

    const newBlog = await prisma.blogs.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        content: content || '',
        cover_image: cover_image || null,
        category_id: category_id ? BigInt(category_id) : BigInt(1),
        status: status || 'draft',
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(serializeBigInt(newBlog), { status: 201 });
  } catch (error) {
    console.error('POST /api/cms/blogs:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, content, cover_image, category_id, status } = body;

    const updated = await prisma.blogs.update({
      where: { id: BigInt(id) },
      data: {
        title,
        slug,
        content,
        cover_image,
        category_id: category_id ? BigInt(category_id) : undefined,
        status,
        update_at: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error('PUT /api/cms/blogs:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
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

    await prisma.blogs.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cms/blogs:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
