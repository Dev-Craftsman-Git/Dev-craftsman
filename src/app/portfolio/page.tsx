'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Footer from '@/components/sections/Footer';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    slug: string;
    industry?: string;
    thumbnail?: string;
    tags?: string; // JSON string
}

import { projects as staticProjects } from '@/data/projects';

export default function PortfolioPage() {
    const { theme } = useTheme();
    const [filter, setFilter] = useState('All');
    const [projects, setProjects] = useState<Project[]>(staticProjects);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch projects from API
        fetch('/api/projects?published=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    // Extract unique categories dynamically or use preset
    const categories = ['All', 'Web', 'Mobile', 'AI/ML', 'IoT', 'Blockchain'];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter((p) => (p.industry || 'Web') === filter);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-12 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-4 uppercase text-white">
                            Project <span style={{ color: 'white', textShadow: `0 0 20px ${theme.colors.primary}` }}>Showcase</span>
                        </h1>
                        <p className="text-text-secondary">Explore our multiverse of successful deployments.</p>
                    </div>

                    <div className="mb-10 flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                size="sm"
                                variant={filter === cat ? 'primary' : 'ghost'}
                                onClick={() => setFilter(cat)}
                                className="min-w-[80px]"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        layout
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="h-full overflow-hidden p-0 group cursor-pointer flex flex-col">
                                            <div className="relative h-48 w-full bg-gray-800 overflow-hidden">
                                                {project.thumbnail ? (
                                                    <Image
                                                        src={project.thumbnail}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-700">
                                                        <span className="font-heading text-4xl opacity-20">{project.industry}</span>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Link href={`/portfolio/${project.slug}`}>
                                                        <Button size="sm">View Details</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.primary }}>
                                                        {project.industry || 'Project'}
                                                    </span>
                                                </div>
                                                <h3 className="mb-3 text-xl font-bold text-white">{project.title}</h3>
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {project.tags && JSON.parse(project.tags).map((t: string) => (
                                                        <span key={t} className="rounded-full bg-background px-2 py-1 text-xs text-text-secondary border border-border">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </div >
    );
}

