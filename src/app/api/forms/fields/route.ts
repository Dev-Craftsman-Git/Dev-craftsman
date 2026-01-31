
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const formType = searchParams.get('formType');

    if (!formType) {
        return NextResponse.json({ error: 'formType is required' }, { status: 400 });
    }

    try {
        const fields = await prisma.formField.findMany({
            where: {
                formType,
                isActive: true
            },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(fields);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fields' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Auto-generate order if not provided (append to end)
        if (body.order === undefined) {
            const lastField = await prisma.formField.findFirst({
                where: { formType: body.formType },
                orderBy: { order: 'desc' }
            });
            body.order = (lastField?.order ?? 0) + 1;
        }

        const field = await prisma.formField.create({
            data: {
                formType: body.formType,
                label: body.label,
                name: body.name || body.label.toLowerCase().replace(/[^a-z0-9]/g, '_'), // basic slugify
                type: body.type,
                placeholder: body.placeholder,
                required: body.required,
                options: body.options ? JSON.stringify(body.options) : undefined,
                width: body.width,
                order: body.order
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("Error creating field:", error);
        return NextResponse.json({ error: 'Failed to create field' }, { status: 500 });
    }
}
