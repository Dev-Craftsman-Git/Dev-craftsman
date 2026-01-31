'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Web',
        description: '',
        content: '',
        tech: '', // Comma separated for simplicity in UI, parsing on submit
        image: '',
        link: '',
        demoUrl: '',
        showDemo: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData({ ...formData, title, slug });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await axios.post('/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.url) {
                setFormData(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Parse tech stack
            const techArray = formData.tech.split(',').map(t => t.trim()).filter(Boolean);

            await axios.post('/api/projects', {
                ...formData,
                tech: techArray
            });
            alert('Project created successfully!');
            router.push('/devadmin/dwarakadmin/mylogin/projects');
        } catch (error) {
            console.error(error);
            alert('Failed to create project');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href="/devadmin/dwarakadmin/mylogin/projects" className="text-text-secondary hover:text-primary flex items-center mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Link>
                <h1 className="text-3xl font-bold text-text-primary">Add New Project</h1>
            </div>

            <Card className="p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Project Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            >
                                <option value="Web">Web Development</option>
                                <option value="Mobile">Mobile App</option>
                                <option value="AI/ML">AI & Machine Learning</option>
                                <option value="IoT">IoT</option>
                                <option value="Blockchain">Blockchain</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Tech Stack (comma separated)</label>
                            <input
                                type="text"
                                name="tech"
                                value={formData.tech}
                                onChange={handleChange}
                                placeholder="React, Node.js, TypeScript"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Thumbnail URL</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Upload'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Project Link</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://mysite.com"
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Demo URL (for View Demo)</label>
                            <input
                                type="text"
                                name="demoUrl"
                                value={formData.demoUrl}
                                onChange={handleChange}
                                placeholder="https://demo.mysite.com"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="showDemo"
                                    checked={formData.showDemo}
                                    onChange={(e) => setFormData({ ...formData, showDemo: e.target.checked })}
                                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-text-secondary">Show "View Demo" Button Publicly</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Short Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Detailed Content (Markdown)</label>
                        <textarea
                            name="content"
                            rows={10}
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary font-mono text-sm"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
