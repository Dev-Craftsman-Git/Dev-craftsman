import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const plans = await prisma.pricingPlan.findMany({
        orderBy: { order: 'asc' },
        include: { features: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const {
        type,
        name,
        price,
        originalPrice,
        currency,
        isPopular,
        isVisible,
        features,
    } = body;

    try {
        const maxOrder = await prisma.pricingPlan.aggregate({
            _max: { order: true },
        });

        const plan = await prisma.pricingPlan.create({
            data: {
                type,
                name,
                price,
                originalPrice,
                currency: currency || 'INR',
                isPopular: !!isPopular,
                isVisible: isVisible !== false,
                order: (maxOrder._max.order || 0) + 1,
                features: {
                    create: (features || []).map((f: any, index: number) => ({
                        text: f.text,
                        isEnabled: f.isEnabled ?? true,
                        order: index,
                    })),
                },
            },
            include: { features: true },
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (err) {
        console.error('Create pricing error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
