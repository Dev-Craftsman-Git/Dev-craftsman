
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projects } from '@/data/projects';

export async function GET() {
    try {
        console.log('Seeding projects via API...');

        // Clear existing projects
        await prisma.project.deleteMany({});

        for (const p of projects) {
            try {
                await prisma.project.create({
                    data: {
                        title: p.title,
                        slug: p.slug,
                        description: p.description,
                        industry: p.industry,
                        content: p.content || '',
                        tags: p.tags, // Already a JSON string
                        thumbnail: p.thumbnail,
                        websiteUrl: p.websiteUrl,
                        repoUrl: p.repoUrl, // Was githubUrl
                        demoUrl: p.demoUrl,
                        showDemo: p.showDemo ?? false,
                        status: p.status || 'PUBLISHED',
                        order: parseInt(p.id),
                        challenges: p.challenges,
                        solutions: p.solutions,
                    }
                });
            } catch (innerError) {
                console.error(`Failed to seed project ${p.title}:`, innerError);
            }
        }

        return NextResponse.json({ message: 'Seed completed successfully' });
    } catch (error) {
        console.error('Seed failed:', error);
        return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
    }
}
