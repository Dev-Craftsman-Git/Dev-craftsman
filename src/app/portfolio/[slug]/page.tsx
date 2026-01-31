'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowLeft, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Footer from '@/components/sections/Footer';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    industry: string;
    tags: string;
    thumbnail: string;
    images: string;
    challenges: string;
    solutions: string;
    websiteUrl: string;
    repoUrl: string;
    createdAt: string;
    client: string;
    status: string;
    demoUrl?: string;
    showDemo?: boolean;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.slug) {
            fetch(`/api/projects/slug/${params.slug}`)
                .then(res => {
                    if (!res.ok) throw new Error('Project not found');
                    return res.json();
                })
                .then(data => {
                    console.log('Project data:', data);
                    setProject(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.slug]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background text-white">
                <h1 className="mb-4 text-4xl font-bold">Project Not Found</h1>
                <Link href="/portfolio">
                    <Button>Back to Portfolio</Button>
                </Link>
            </div>
        );
    }

    const tags = JSON.parse(project.tags || '[]');

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                {project.thumbnail ? (
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover opacity-40 blur-sm"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-black opacity-20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 pt-32 pb-20">
                    <div className="mx-auto max-w-5xl">
                        <Link href="/portfolio" className="mb-6 inline-flex items-center text-sm font-medium text-text-secondary hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
                        </Link>
                        <div className="mb-4 flex items-center space-x-3">
                            <span className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                                {project.industry || 'Project'}
                            </span>

                        </div>
                        <h1 className="mb-6 text-4xl font-extrabold sm:text-6xl text-white font-heading leading-tight">
                            {project.title}
                        </h1>
                        <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
                            {project.description}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            {project.showDemo && project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="shadow-lg shadow-primary/20">
                                        <ExternalLink className="mr-2 h-5 w-5" /> View Demo
                                    </Button>
                                </a>
                            )}
                            {project.websiteUrl && (
                                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="lg">
                                        <ExternalLink className="mr-2 h-5 w-5" /> Visit Site
                                    </Button>
                                </a>
                            )}
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="lg">
                                        <Github className="mr-2 h-5 w-5" /> View Code
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mx-auto max-w-5xl px-8 py-16">
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="prose prose-invert max-w-none prose-lg prose-headings:font-heading prose-a:text-primary">
                            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
                            <ReactMarkdown>{project.content || 'No detailed content provided.'}</ReactMarkdown>
                        </div>

                        {project.challenges && (
                            <div className="prose prose-invert max-w-none prose-lg prose-headings:font-heading prose-a:text-primary">
                                <h2 className="text-3xl font-bold text-white mb-6">The Challenge</h2>
                                <ReactMarkdown>{project.challenges}</ReactMarkdown>
                            </div>
                        )}

                        {project.solutions && (
                            <div className="prose prose-invert max-w-none prose-lg prose-headings:font-heading prose-a:text-primary">
                                <h2 className="text-3xl font-bold text-white mb-6">Our Solution</h2>
                                <ReactMarkdown>{project.solutions}</ReactMarkdown>
                            </div>
                        )}

                        {project.images && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white font-heading">Gallery</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {JSON.parse(project.images).map((img: string, idx: number) => (
                                        <div key={idx} className="relative h-48 overflow-hidden rounded-lg">
                                            <Image
                                                src={img}
                                                alt={`Gallery image ${idx + 1}`}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <Card className="p-6 border-l-4 border-l-primary">
                            <h3 className="mb-4 text-lg font-bold text-white">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="flex items-center rounded-md bg-card border border-border px-3 py-2 text-sm font-medium text-text-primary">
                                        <CheckCircle2 className="mr-2 h-3 w-3 text-primary" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="mb-4 text-lg font-bold text-white">Project Info</h3>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Client</span>
                                    <span className="text-white font-medium">{project.client || 'Internal Project'}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Category</span>
                                    <span className="text-white font-medium">{project.industry}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Status</span>
                                    <span className="text-green-500 font-medium">{project.status || 'Completed'}</span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
