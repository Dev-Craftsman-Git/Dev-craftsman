
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || undefined;

    const where = page ? { page } : {};
    const sections = await prisma.section.findMany({
        where,
        orderBy: { order: 'asc' },
    });

    return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { page, name, isVisible = true, config = {} } = body;

    if (!page || !name) {
        return NextResponse.json({ message: 'page and name required' }, { status: 400 });
    }

    const maxOrder = await prisma.section.aggregate({
        where: { page },
        _max: { order: true },
    });

    const section = await prisma.section.create({
        data: {
            page,
            name,
            isVisible,
            config: JSON.stringify(config), // Store as string for SQLite
            order: (maxOrder._max.order || 0) + 1,
        },
    });

    return NextResponse.json(section, { status: 201 });
}
