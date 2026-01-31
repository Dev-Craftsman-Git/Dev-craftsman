'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { Save, Instagram, MessageCircle, Mail, Phone, Loader2 } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

export default function ContactAdminPage() {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        instagram: '',
        whatsapp: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/contact-info');
            setFormData(res.data);
        } catch (error) {
            console.error('Failed to fetch contact info', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axios.post('/api/contact-info', formData);
            alert('Contact info saved successfully!');
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Contact Information</h1>
                    <p className="text-text-secondary">Manage your social links and contact details.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-6">Social & Messaging</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                                <span className="flex items-center"><Instagram className="mr-2 h-4 w-4" /> Instagram Link</span>
                                <button onClick={() => handleCopy(formData.instagram)} className="text-xs text-primary hover:underline">Copy</button>
                            </label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                placeholder="https://instagram.com/username"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                                <span className="flex items-center"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Group Link</span>
                                <button onClick={() => handleCopy(formData.whatsapp)} className="text-xs text-primary hover:underline">Copy</button>
                            </label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="https://chat.whatsapp.com/..."
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-6">Direct Contact</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                                <span className="flex items-center"><Mail className="mr-2 h-4 w-4" /> Email Address</span>
                                <button onClick={() => handleCopy(formData.email)} className="text-xs text-primary hover:underline">Copy</button>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                                <span className="flex items-center"><Phone className="mr-2 h-4 w-4" /> Phone Number (Indian Format)</span>
                                <button onClick={() => handleCopy(formData.phone)} className="text-xs text-primary hover:underline">Copy</button>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
