
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { title, description, icon, features, isActive, order } = body;

        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                title,
                description,
                icon,
                features: features ? JSON.stringify(features) : undefined,
                isActive,
                order
            },
        });
        return NextResponse.json(updatedService);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.service.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
