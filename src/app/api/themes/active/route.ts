
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const block = await prisma.contentBlock.findUnique({
            where: { key: 'system_theme' }
        });

        // Default to 'daily' if not set
        return NextResponse.json({ themeId: block?.value || 'daily' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { themeId } = body;

        if (!themeId) {
            return NextResponse.json({ error: 'themeId is required' }, { status: 400 });
        }

        const block = await prisma.contentBlock.upsert({
            where: { key: 'system_theme' },
            update: {
                value: themeId,
                type: 'text',
                section: 'system',
                label: 'Active System Theme'
            },
            create: {
                key: 'system_theme',
                value: themeId,
                type: 'text',
                section: 'system',
                label: 'Active System Theme'
            }
        });

        return NextResponse.json({ success: true, themeId: block.value });
    } catch (error) {
        console.error("Error setting theme:", error);
        return NextResponse.json({ error: 'Failed to set theme' }, { status: 500 });
    }
}
