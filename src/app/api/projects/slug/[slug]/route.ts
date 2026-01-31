
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    segmentData: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await segmentData.params;
        const project = await prisma.project.findUnique({
            where: { slug: params.slug },
        });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}
