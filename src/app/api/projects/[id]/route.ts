
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();

        try {
            const project = await prisma.project.update({
                where: { id: params.id },
                data: {
                    title: body.title,
                    slug: body.slug,
                    description: body.description,
                    content: body.content,
                    industry: body.category,
                    tags: JSON.stringify(body.tech || []),
                    thumbnail: body.image,
                    websiteUrl: body.link,
                    demoUrl: body.demoUrl,
                    showDemo: body.showDemo,
                },
            });
            return NextResponse.json(project);
        } catch (innerError) {
            console.warn('Failed with new schema fields, retrying with legacy schema...', innerError);
            const project = await prisma.project.update({
                where: { id: params.id },
                data: {
                    title: body.title,
                    slug: body.slug,
                    description: body.description,
                    content: body.content,
                    industry: body.category,
                    tags: JSON.stringify(body.tech || []),
                    thumbnail: body.image,
                    websiteUrl: body.link,
                    demoUrl: body.demoUrl,
                    showDemo: body.showDemo,
                },
            });
            return NextResponse.json(project);
        }
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.project.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Project deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
