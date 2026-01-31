
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all services
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const services = await prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(services);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST: Create a new service
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, icon, features } = body;

        const newService = await prisma.service.create({
            data: {
                title,
                description,
                icon,
                features: features ? JSON.stringify(features) : undefined,
                isActive: true,
            },
        });
        return NextResponse.json(newService);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
