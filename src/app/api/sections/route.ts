
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const name = searchParams.get('name');

        if (!page || !name) {
            return NextResponse.json({ message: 'Page and Name required' }, { status: 400 });
        }

        const section = await prisma.section.findFirst({
            where: { page, name }
        });

        if (!section) {
            return NextResponse.json(null); // Return null if not configured yet
        }

        return NextResponse.json({
            ...section,
            config: section.config ? JSON.parse(section.config) : {}
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { page, name, config } = body;

        if (!page || !name) {
            return NextResponse.json({ message: 'Page and Name required' }, { status: 400 });
        }

        // Check if section exists
        const existing = await prisma.section.findFirst({
            where: { page, name }
        });

        let result;
        if (existing) {
            result = await prisma.section.update({
                where: { id: existing.id },
                data: {
                    config: config ? JSON.stringify(config) : undefined,
                    isVisible: body.isVisible !== undefined ? body.isVisible : undefined,
                    updatedAt: new Date()
                }
            });
        } else {
            result = await prisma.section.create({
                data: {
                    page,
                    name,
                    config: JSON.stringify(config || {}),
                    isVisible: body.isVisible !== undefined ? body.isVisible : true
                }
            });
        }

        revalidatePath('/');
        if (page === 'home' && name === 'pricing') {
            revalidatePath('/pricing');
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Section update error:', error);
        return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
    }
}
