
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Section } from '@prisma/client';

type Params = { params: Promise<{ page: string }> };

export async function GET(_req: Request, { params }: Params) {
    const { page } = await params;
    const sections = await prisma.section.findMany({
        where: { page, isVisible: true },
        orderBy: { order: 'asc' },
    });

    // Parse config back to JSON
    const sectionsWithConfig = sections.map((s: Section) => ({
        ...s,
        config: s.config ? JSON.parse(s.config) : {},
    }));

    return NextResponse.json(sectionsWithConfig);
}
