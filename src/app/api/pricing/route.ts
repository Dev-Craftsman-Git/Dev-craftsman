
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // Optional filter: STUDENT, COMMERCIAL

        const where = type
            ? {
                type: {
                    in: [type.toLowerCase(), type.toUpperCase()]
                }
            }
            : {};

        const plans = await prisma.pricingPlan.findMany({
            where: {
                ...where,
                isVisible: true
            },
            include: {
                features: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.price || !body.type) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const plan = await prisma.pricingPlan.create({
            data: {
                name: body.name,
                type: body.type, // STUDENT, COMMERCIAL
                price: parseInt(body.price),
                originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
                currency: body.currency || 'INR',
                isPopular: body.isPopular || false,
                features: {
                    create: body.features.map((f: string, index: number) => ({
                        text: f,
                        order: index
                    }))
                }
            },
            include: {
                features: true
            }
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error creating pricing plan:', error);
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}
