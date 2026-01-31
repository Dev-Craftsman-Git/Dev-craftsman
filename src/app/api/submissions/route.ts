
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { formType, status, priority, source, ...formData } = body;

        if (!formType || !['student', 'commercial'].includes(formType)) {
            return NextResponse.json({ message: 'Invalid form type' }, { status: 400 });
        }

        const submission = await prisma.submission.create({
            data: {
                formType,
                data: JSON.stringify(formData),
                status: status || 'NEW',
                priority: priority || 'NORMAL',
                source: source || 'web'
            }
        });

        return NextResponse.json({ message: 'Submission received', id: submission.id });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const submissions = await prisma.submission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
