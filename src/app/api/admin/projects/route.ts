
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all projects
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(projects);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST: Create a new project
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { title, slug, description, content, client, tags, images } = body;

        const newProject = await prisma.project.create({
            data: {
                title,
                slug,
                description,
                content,
                client,
                tags: tags ? JSON.stringify(tags) : '[]',
                images: images ? JSON.stringify(images) : '[]',
                status: 'DRAFT'
            },
        });
        return NextResponse.json(newProject);
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
