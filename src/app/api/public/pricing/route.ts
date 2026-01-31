
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const plans = await prisma.pricingPlan.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' },
        include: { features: { where: { isEnabled: true }, orderBy: { order: 'asc' } } },
    });

    const studentPlans = plans.filter(p => p.type === 'STUDENT');
    const commercialPlans = plans.filter(p => p.type === 'COMMERCIAL');

    return NextResponse.json({
        studentPlans,
        commercialPlans,
    });
}
