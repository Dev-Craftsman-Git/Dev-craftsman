
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const plan = await prisma.pricingPlan.findUnique({
            where: { id: params.id },
            include: {
                features: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!plan) {
            return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
        }

        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();

        // Transaction to update plan and replace features
        const plan = await prisma.$transaction(async (tx) => {
            // Update plan details
            const updatedPlan = await tx.pricingPlan.update({
                where: { id: params.id },
                data: {
                    name: body.name,
                    type: body.type,
                    price: parseInt(body.price),
                    originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
                    currency: body.currency,
                    isPopular: body.isPopular,
                }
            });

            // Delete existing features
            await tx.feature.deleteMany({
                where: { planId: params.id }
            });

            // Create new features
            if (body.features && body.features.length > 0) {
                await tx.feature.createMany({
                    data: body.features.map((f: string, index: number) => ({
                        text: f,
                        planId: params.id,
                        order: index
                    }))
                });
            }

            return updatedPlan;
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.pricingPlan.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Plan deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
