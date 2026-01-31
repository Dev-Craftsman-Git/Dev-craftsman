
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Cache for 1 hour
export const revalidate = 3600;

const PAGE = 'global';
const SECTION_NAME = 'contact_info';

export async function GET() {
    try {
        const section = await prisma.section.findFirst({
            where: {
                page: PAGE,
                name: SECTION_NAME,
            },
        });

        // Default values if not found using placeholder data
        const defaultData = {
            instagram: '@devcraftsman',
            whatsapp: 'Join Our Community',
            email: 'contact@devcraftsman.com',
            phone: '+1 (555) 123-4567',
        };

        if (!section) {
            return NextResponse.json(defaultData);
        }

        return NextResponse.json(JSON.parse(section.config));
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.email || !body.phone) {
            return NextResponse.json({ message: 'Email and Phone are required' }, { status: 400 });
        }

        // Upsert logic
        const existingSection = await prisma.section.findFirst({
            where: {
                page: PAGE,
                name: SECTION_NAME,
            },
        });

        const configString = JSON.stringify(body);

        let section;
        if (existingSection) {
            section = await prisma.section.update({
                where: { id: existingSection.id },
                data: { config: configString },
            });
        } else {
            section = await prisma.section.create({
                data: {
                    page: PAGE,
                    name: SECTION_NAME,
                    config: configString,
                    isVisible: true,
                    order: 0,
                },
            });
        }

        return NextResponse.json(JSON.parse(section.config));
    } catch (error) {
        console.error('Error saving contact info:', error);
        return NextResponse.json({ error: 'Failed to save contact info' }, { status: 500 });
    }
}
