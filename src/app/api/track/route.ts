
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        // Upsert metric for today
        await prisma.visitorMetric.upsert({
            where: { date: today },
            update: {
                totalVisits: { increment: 1 },
                // simplified unique visit logic (would need cookies/IP for real unique)
                uniqueVisits: { increment: 1 }
            },
            create: {
                date: today,
                totalVisits: 1,
                uniqueVisits: 1
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Tracking error' }, { status: 500 });
    }
}
