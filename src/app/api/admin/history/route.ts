
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const logs = await prisma.activityLog.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
        return NextResponse.json(logs);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
