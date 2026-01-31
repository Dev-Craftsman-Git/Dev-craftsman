
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const plan = await prisma.pricingPlan.findUnique({
        where: { id },
        include: { features: { orderBy: { order: 'asc' } } },
    });
    if (!plan) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
        name,
        price,
        originalPrice,
        currency,
        isPopular,
        isVisible,
        features,
        type,
    } = body;

    try {
        const plan = await prisma.pricingPlan.update({
            where: { id },
            data: {
                name,
                price,
                originalPrice,
                currency,
                isPopular,
                isVisible,
                type,
            },
        });

        if (Array.isArray(features)) {
            // simple strategy: delete and recreate features
            await prisma.feature.deleteMany({
                where: { planId: id },
            });

            await prisma.feature.createMany({
                data: features.map((f: any, index: number) => ({
                    text: f.text,
                    isEnabled: f.isEnabled ?? true,
                    order: index,
                    planId: id,
                })),
            });
        }

        const updated = await prisma.pricingPlan.findUnique({
            where: { id },
            include: { features: { orderBy: { order: 'asc' } } },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error('Update pricing error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.pricingPlan.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Delete pricing error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
