
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const themes = await prisma.themePreset.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, colors } = body;

        if (!name || !colors) {
            return NextResponse.json({ error: 'Name and colors are required' }, { status: 400 });
        }

        const theme = await prisma.themePreset.create({
            data: {
                name,
                colors: JSON.stringify(colors),
                isDefault: false
            }
        });

        return NextResponse.json(theme);
    } catch (error) {
        console.error("Error creating theme:", error);
        return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
    }
}
