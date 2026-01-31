
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const submission = await prisma.submission.findUnique({
            where: { id: params.id }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        return NextResponse.json(submission);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { status, priority, notes, ...data } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;

        // If specific data fields are being updated
        if (body.data) {
            updateData.data = typeof body.data === 'string' ? body.data : JSON.stringify(body.data);
        }

        const submission = await prisma.submission.update({
            where: { id: params.id },
            data: updateData
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Error updating submission:", error);
        return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.submission.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }
}
