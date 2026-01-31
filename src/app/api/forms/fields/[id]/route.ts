
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { options, ...otherData } = body;

        const updateData: any = { ...otherData };
        if (options !== undefined) {
            updateData.options = typeof options === 'string' ? options : JSON.stringify(options);
        }

        const field = await prisma.formField.update({
            where: { id: params.id },
            data: updateData
        });

        return NextResponse.json(field);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update field' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.formField.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Field deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
    }
}
