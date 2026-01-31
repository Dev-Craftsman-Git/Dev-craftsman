import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type } = body;

        const submission = await prisma.submission.create({
            data: {
                formType: type || 'general',
                data: JSON.stringify(body),
                status: 'NEW',
                priority: 'NORMAL'
            }
        });

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error) {
        console.error('Inquiry Error:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const submissions = await prisma.submission.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(submissions);
}
