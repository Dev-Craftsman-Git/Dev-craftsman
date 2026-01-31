'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type Section = {
    id: string;
    page: string;
    name: string;
    isVisible: boolean;
};

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    // Initial sections list - we can fetch from API but for now we also hardcode the known ones to ensure they appear even if not in DB yet
    const knownSections = [
        { page: 'home', name: 'pricing', label: 'Pricing Section' },
        // Add more removable sections here as needed
    ];

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const results = await Promise.all(
                    knownSections.map(async (sec) => {
                        try {
                            const res = await axios.get(`/api/sections?page=${sec.page}&name=${sec.name}`);
                            if (res.data) {
                                return { ...sec, ...res.data };
                            }
                        } catch (e) {
                            // If not found or error, it might not exist in configured sections yet
                        }
                        return { ...sec, isVisible: true, id: `${sec.page}-${sec.name}` }; // Default true
                    })
                );
                setSections(results);
            } catch (error) {
                console.error('Failed to fetch sections', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const toggleVisibility = async (section: Section) => {
        setSaving(section.name);
        const newValue = !section.isVisible;

        try {
            // Update UI optimistically
            setSections(prev => prev.map(s =>
                (s.page === section.page && s.name === section.name) ? { ...s, isVisible: newValue } : s
            ));

            await axios.post('/api/sections', {
                page: section.page,
                name: section.name,
                isVisible: newValue
            });

        } catch (error) {
            console.error('Failed to save section', error);
            // Revert on error
            setSections(prev => prev.map(s =>
                (s.page === section.page && s.name === section.name) ? { ...s, isVisible: !newValue } : s
            ));
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Page Sections</h1>
                <p className="text-text-secondary">Manage visibility of website sections.</p>
            </div>

            <div className="grid gap-6">
                {sections.map((section: any) => (
                    <Card key={`${section.page}-${section.name}`} className="p-6 flex items-center justify-between border-border">
                        <div>
                            <h3 className="text-xl font-bold text-text-primary capitalize">{section.label || section.name}</h3>
                            <p className="text-sm text-text-secondary">
                                {section.isVisible ? 'Visible to public' : 'Hidden from public'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleVisibility(section)}
                                disabled={saving === section.name}
                                className={`transition-colors text-4xl ${section.isVisible ? 'text-green-500 hover:text-green-400' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                {saving === section.name ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    section.isVisible ? <ToggleRight size={48} /> : <ToggleLeft size={48} />
                                )}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
