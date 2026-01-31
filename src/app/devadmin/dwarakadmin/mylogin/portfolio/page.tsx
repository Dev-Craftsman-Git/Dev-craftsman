
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Edit, Trash } from 'lucide-react';

export default function PortfolioPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        client: '',
        status: 'DRAFT',
        tags: [] as string[]
    });
    const [tagInput, setTagInput] = useState('');


    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/admin/projects');
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: any) => {
        setCurrentProject(project);
        setFormData({
            title: project.title,
            slug: project.slug,
            description: project.description,
            client: project.client || '',
            status: project.status,
            tags: typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags || []
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete project?')) return;
        try {
            await axios.delete(`/api/admin/projects/${id}`);
            fetchProjects();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentProject) {
                await axios.put(`/api/admin/projects/${currentProject.id}`, formData);
            } else {
                await axios.post('/api/admin/projects', formData);
            }
            setIsEditing(false);
            setCurrentProject(null);
            fetchProjects();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Portfolio Projects</h1>
                <Button onClick={() => { setIsEditing(true); setCurrentProject(null); setFormData({ title: '', slug: '', description: '', client: '', status: 'DRAFT', tags: [] }); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </div>

            {isEditing && (
                <Card className="mb-8 p-6 bg-gray-900/50 border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Title</label>
                                <input className="w-full bg-black border border-gray-700 rounded p-2 text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Slug</label>
                                <input className="w-full bg-black border border-gray-700 rounded p-2 text-white" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea className="w-full bg-black border border-gray-700 rounded p-2 text-white" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Client</label>
                                <input className="w-full bg-black border border-gray-700 rounded p-2 text-white" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Status</label>
                                <select className="w-full bg-black border border-gray-700 rounded p-2 text-white" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <Button type="submit">{currentProject ? 'Update' : 'Create'}</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {projects.map((project) => (
                    <Card key={project.id} className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <div className="text-sm text-gray-400">{project.description}</div>
                            <div className="mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded ${project.status === 'PUBLISHED' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="secondary" onClick={() => handleEdit(project)}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(project.id)}><Trash className="h-4 w-4" /></Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
