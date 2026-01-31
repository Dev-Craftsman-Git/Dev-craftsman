
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        // Destructure fields to allow partial updates if needed, but for now assuming full payload or typical edit
        const { title, slug, description, content, client, tags, images, status, isFeatured, order } = body;

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                content,
                client,
                tags: typeof tags === 'object' ? JSON.stringify(tags) : tags,
                images: typeof images === 'object' ? JSON.stringify(images) : images,
                status,
                isFeatured,
                order
            },
        });
        return NextResponse.json(updatedProject);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.project.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
