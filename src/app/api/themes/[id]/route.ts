
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.themePreset.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Theme deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
    }
}
