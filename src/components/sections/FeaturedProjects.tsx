'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';


const categories = ['All', 'Web', 'Mobile', 'AI/ML', 'IoT', 'Blockchain'];



interface Project {
    id: string;
    title: string;
    slug: string;
    industry: string; // mapped from category
    description: string;
    thumbnail: string;
    tags: string; // JSON string
    websiteUrl?: string;
    demoUrl?: string;
    showDemo?: boolean;
}

interface FeaturedProjectsProps {
    initialProjects?: Project[];
}

export default function FeaturedProjects({ initialProjects = [] }: FeaturedProjectsProps) {
    // const { theme } = useTheme();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(initialProjects.length === 0);

    useEffect(() => {
        if (initialProjects.length > 0) {
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const res = await axios.get('/api/projects?published=true');
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setProjects(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
                // Keep static projects on error
            } finally {
                setLoading(false);
            }
        };


        fetchProjects();
    }, [initialProjects]);

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.industry === activeCategory);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            PROJECT SHOWCASE
                        </h2>
                        <div className="h-1 w-24 mx-auto rounded-full bg-accent mb-6 shadow-[0_0_10px_var(--accent)]" />
                        <p className="text-text-secondary text-lg">
                            Explore our multiverse of successful deployments.
                        </p>
                    </motion.div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${activeCategory === cat
                                    ? 'bg-primary text-white border-primary shadow-[0_0_15px_var(--primary)]'
                                    : 'bg-transparent text-text-secondary border-transparent hover:border-border hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="h-full group hover:-translate-y-2 transition-transform duration-300">
                                <div className="h-48 mb-4 rounded overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    {project.thumbnail && (
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                    <div className="absolute bottom-3 left-3 z-20">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-primary text-black uppercase tracking-wider">
                                            {project.industry}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold font-heading mb-2 text-text-primary group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(() => {
                                        try {
                                            return JSON.parse(project.tags || '[]').map((t: string) => (
                                                <span key={t} className="text-xs px-2 py-1 rounded border border-border text-gray-400">
                                                    {t}
                                                </span>
                                            ));
                                        } catch (e) {
                                            console.error('Failed to parse tags for project:', project.id, e);
                                            return null;
                                        }
                                    })()}
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {/* Fallback to websiteUrl if demoUrl is missing (legacy DB compatibility) */}
                                            {project.showDemo && project.demoUrl && project.demoUrl !== '#' && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-bold text-text-secondary hover:text-primary transition-colors flex items-center"
                                                >
                                                    <ExternalLink size={16} className="mr-1" /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <Link href={`project/${project.id}`} className="flex items-center text-sm font-bold text-accent hover:underline">
                                        View Details <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/portfolio">
                        <Button variant="outline" size="lg">
                            View Mission Archive
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
