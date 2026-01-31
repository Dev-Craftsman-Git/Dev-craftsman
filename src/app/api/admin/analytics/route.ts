
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get last 30 days of metrics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const metrics = await prisma.visitorMetric.findMany({
            where: {
                date: { gte: thirtyDaysAgo }
            },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(metrics);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
