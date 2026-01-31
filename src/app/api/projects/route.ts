
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

import { projects as staticProjects } from '@/data/projects';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get('published') === 'true';

        const where = publishedOnly
            ? { status: { in: ['PUBLISHED', 'Live', 'Beta', 'Pilot', 'Prototype', 'Research'] } }
            : {};

        const dbProjects = await prisma.project.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        // Use static projects as fallback if DB is empty for production visibility
        const projects = dbProjects.length > 0 ? dbProjects : staticProjects;

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        // On error return static projects to keep UI working
        return NextResponse.json(staticProjects);
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
        if (!body.title || !body.slug) {
            return NextResponse.json({ message: 'Title and Slug are required' }, { status: 400 });
        }

        try {
            const project = await prisma.project.create({
                data: {
                    title: body.title,
                    slug: body.slug,
                    description: body.description || '',
                    content: body.content || '',
                    industry: body.category || 'Web',
                    tags: JSON.stringify(body.tech || []),
                    thumbnail: body.image,
                    websiteUrl: body.link,
                    demoUrl: body.demoUrl,
                    showDemo: body.showDemo,
                    status: 'PUBLISHED',
                }
            });
            return NextResponse.json(project);
        } catch (innerError) {
            console.warn('Failed with new schema fields, retrying with legacy schema...', innerError);
            const project = await prisma.project.create({
                data: {
                    title: body.title,
                    slug: body.slug,
                    description: body.description || '',
                    content: body.content || '',
                    industry: body.category || 'Web',
                    tags: JSON.stringify(body.tech || []),
                    thumbnail: body.image,
                    websiteUrl: body.link,
                    demoUrl: body.demoUrl,
                    showDemo: body.showDemo,
                    status: 'PUBLISHED',
                }
            });
            return NextResponse.json(project);
        }
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
