import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const params = await props.params;
        const body = await req.json();
        const { id } = params;
        const { label, name, type, placeholder, required, options, width, order, isActive } = body;

        const field = await prisma.formField.update({
            where: { id },
            data: {
                label,
                name,
                type,
                placeholder,
                required,
                options: options ? JSON.stringify(options) : undefined, // Check if explicit null handling needed
                width,
                order,
                isActive
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error('Field Update Error:', error);
        return NextResponse.json({ error: 'Failed to update field' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const params = await props.params;
        await prisma.formField.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Field Delete Error:', error);
        return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
    }
}
