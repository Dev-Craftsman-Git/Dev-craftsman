import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    // Secure all form field fetching
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where = type ? { formType: type } : {};
    const fields = await prisma.formField.findMany({
        where,
        orderBy: { order: 'asc' }
    });

    return NextResponse.json(fields);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { formType, label, name, type, placeholder, required, options, width, order } = body;

        const field = await prisma.formField.create({
            data: {
                formType,
                label,
                name,
                type,
                placeholder,
                required: required || false,
                options: options ? JSON.stringify(options) : null,
                width: width || 'full',
                order: order || 0
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error('Field Create Error:', error);
        return NextResponse.json({ error: 'Failed to create field' }, { status: 500 });
    }
}
