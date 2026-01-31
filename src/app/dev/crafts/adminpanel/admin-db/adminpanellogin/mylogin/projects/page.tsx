'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, ExternalLink, FolderKanban } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Project {
    id: string;
    title: string;
    slug: string;
    industry: string; // Used as category
    status: string;
    description: string;
    thumbnail: string;
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
                    <p className="text-text-secondary">Manage your portfolio showcase items.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={async () => {
                        if (!confirm('This will DELETE all current projects and reset them to the default 15 data items. Are you sure?')) return;
                        try {
                            setLoading(true);
                            await axios.get('/api/seed-projects');
                            await fetchProjects();
                            alert('Data reset successfully!');
                        } catch (err) {
                            console.error(err);
                            alert('Failed to reset data');
                        } finally {
                            setLoading(false);
                        }
                    }}>
                        Reset / Seed Data
                    </Button>
                    <Button onClick={() => window.location.href = '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/projects/new'} className="flex items-center gap-2">
                        <Plus size={16} /> Add Project
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <FolderKanban className="w-12 h-12 mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-bold text-text-primary">No projects found</h3>
                    <p className="text-text-secondary mb-4">Get started by creating your first project.</p>
                    <Link href="/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/projects/new">
                        <Button variant="outline">Create Project</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 group hover:border-primary transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                                <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-text-primary truncate">{project.title}</h3>
                                <p className="text-sm text-text-secondary truncate">{project.description}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/portfolio/${project.slug}`} target="_blank">
                                    <Button size="sm" variant="ghost">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={`/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/projects/edit/${project.id}`}>
                                    <Button size="sm" variant="outline">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
