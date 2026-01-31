
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const submission = await prisma.submission.findUnique({
        where: { id },
        include: { notes: true }
    });

    if (!submission) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(submission);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    try {
        const updateData: any = {};
        if (status) updateData.status = status;

        const submission = await prisma.submission.update({
            where: { id },
            data: updateData
        });

        if (notes) {
            await prisma.submissionNote.create({
                data: {
                    content: notes,
                    submissionId: id,
                    userId: session.user.id
                }
            })
        }

        return NextResponse.json(submission);
    } catch (e) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
