
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
        const [
            totalProjects,
            totalPricingPlans,
            totalSubmissions,
            recentSubmissions
        ] = await Promise.all([
            prisma.project.count(),
            prisma.pricingPlan.count(),
            prisma.submission.count(),
            prisma.submission.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    formType: true,
                    data: true,
                    createdAt: true,
                    status: true
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                totalProjects,
                totalPricingPlans,
                totalSubmissions
            },
            recentSubmissions
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
