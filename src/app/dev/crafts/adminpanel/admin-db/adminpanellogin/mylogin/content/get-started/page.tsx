'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Save, FileText, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function EditGetStartedContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default Content
    const [content, setContent] = useState({
        heading: 'Start Your Mission',
        subheading: 'Select your category to proceed with the secure communication channel.',
        studentTitle: 'For Students',
        studentDesc: 'Academic Projects, Final Year Submissions, and Learning Modules.',
        commercialTitle: 'For Commercial',
        commercialDesc: 'Business Solutions, MVP Development, and Enterprise Software.'
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await axios.get('/api/sections?page=get-started&name=selection');
            if (res.data && res.data.config) {
                setContent(prev => ({ ...prev, ...res.data.config }));
            }
        } catch (error) {
            console.error('Failed to load content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post('/api/sections', {
                page: 'get-started',
                name: 'selection',
                config: content
            });
            alert('Content updated successfully!');
        } catch (error) {
            alert('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Edit 'Get Started' Content</h1>
                <p className="text-text-secondary">Customize the text on the selection screen.</p>
            </div>

            <Card className="p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Main Header Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2 flex items-center">
                            <FileText className="mr-2 h-5 w-5" /> Main Header
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Main Heading</label>
                            <input
                                type="text"
                                name="heading"
                                value={content.heading}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Subheading</label>
                            <textarea
                                name="subheading"
                                rows={2}
                                value={content.subheading}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Student Card Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2">
                                Student Card
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Title</label>
                                <input
                                    type="text"
                                    name="studentTitle"
                                    value={content.studentTitle}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                                <textarea
                                    name="studentDesc"
                                    rows={3}
                                    value={content.studentDesc}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Commercial Card Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2">
                                Commercial Card
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Title</label>
                                <input
                                    type="text"
                                    name="commercialTitle"
                                    value={content.commercialTitle}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                                <textarea
                                    name="commercialDesc"
                                    rows={3}
                                    value={content.commercialDesc}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {saving ? 'Saving...' : 'Save Content'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
