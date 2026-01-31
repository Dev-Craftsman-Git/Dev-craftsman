import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isVisible, config, name, order } = body;

    try {
        const section = await prisma.section.update({
            where: { id },
            data: {
                ...(typeof isVisible === 'boolean' ? { isVisible } : {}),
                ...(config ? { config: JSON.stringify(config) } : {}),
                ...(name ? { name } : {}),
                ...(typeof order === 'number' ? { order } : {}),
            },
        });

        return NextResponse.json(section);
    } catch (err) {
        console.error('Update section error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.section.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Delete section error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
