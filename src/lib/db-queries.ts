import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Revalidate time in seconds
export const revalidate = 3600;

import { projects as staticProjects } from '@/data/projects';

export async function getProjects(publishedOnly = true) {
    try {
        const where = publishedOnly
            ? { status: { in: ['PUBLISHED', 'Live', 'Beta', 'Pilot', 'Prototype', 'Research'] } }
            : {};

        const dbProjects = await prisma.project.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        // If DB has projects, use them. Otherwise, fallback to static projects in data/projects.ts
        const projects = dbProjects.length > 0 ? dbProjects : staticProjects;

        return projects.map(p => ({
            ...p,
            createdAt: (p as any).createdAt ? (p as any).createdAt.toISOString() : new Date().toISOString(),
            updatedAt: (p as any).updatedAt ? (p as any).updatedAt.toISOString() : new Date().toISOString(),
            publishedAt: (p as any).publishedAt ? (p as any).publishedAt.toISOString() : null,
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return staticProjects.map(p => ({
            ...p,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: null,
        }));
    }
}

export async function getContactInfo() {
    try {
        const section = await prisma.section.findFirst({
            where: {
                page: 'global',
                name: 'contact_info',
            },
        });

        if (!section) {
            // Static fallback for production if DB not seeded
            return {
                email: 'admin@devcraftsman.com',
                phone: '+1 (555) 000-0000',
                address: 'Digital Multiverse, Core 0',
                socials: {
                    github: '#',
                    twitter: '#',
                    linkedin: '#'
                }
            };
        }
        return JSON.parse(section.config);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return null;
    }
}

export async function getSectionVisibility(page: string, name: string) {
    try {
        const section = await prisma.section.findFirst({
            where: { page, name },
            select: { isVisible: true }
        });
        const result = section ? section.isVisible : true;

        // Debug Log
        try {
            fs.appendFileSync(path.join(process.cwd(), 'debug.log'), `${new Date().toISOString()} - Checking ${page}/${name}: ${result} (DB: ${JSON.stringify(section)})\n`);
        } catch { }

        return result;
    } catch (error) {
        console.error(`Failed to fetch section visibility for ${page}/${name}:`, error);
        return true;
    }
}

export async function getActiveTheme() {
    try {
        const block = await prisma.contentBlock.findUnique({
            where: { key: 'system_theme' }
        });
        return block?.value || 'daily';
    } catch (error) {
        console.error('Failed to fetch active theme:', error);
        return 'daily';
    }
}
