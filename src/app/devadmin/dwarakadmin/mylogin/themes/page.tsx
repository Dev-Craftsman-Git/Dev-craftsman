'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Check, Clock, Plus, Trash2, X, Save } from 'lucide-react';
import { themes as defaultThemes, Theme, ThemeColors } from '@/themes';
import { Button } from '../../../../../components/ui/Button';

type CustomTheme = {
    id: string;
    name: string;
    colors: ThemeColors;
    gradient: string;
    isCustom: boolean;
};

const safeParseColors = (json: string): ThemeColors | null => {
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
};

export default function AdminThemesPage() {
    const [activeThemeId, setActiveThemeId] = useState<string>('daily');
    const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTheme, setNewTheme] = useState<{ name: string, colors: ThemeColors }>({
        name: '',
        colors: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#f43f5e',
            background: '#0f172a',
            card: '#1e293b',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            border: '#334155'
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [activeRes, customRes] = await Promise.all([
                axios.get('/api/themes/active'),
                axios.get('/api/themes')
            ]);

            setActiveThemeId(activeRes.data.themeId);

            const formattedCustomThemes = customRes.data.map((t: any) => {
                const colors = safeParseColors(t.colors);
                if (!colors) return null;
                return {
                    id: t.id,
                    name: t.name,
                    colors: colors,
                    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    isCustom: true
                };
            }).filter(Boolean) as CustomTheme[];

            setCustomThemes(formattedCustomThemes);

        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetTheme = async (themeId: string) => {
        setSavingId(themeId);
        try {
            await axios.post('/api/themes/active', { themeId });
            setActiveThemeId(themeId);
        } catch (error) {
            alert('Failed to set theme');
        } finally {
            setSavingId(null);
        }
    };

    const handleDeleteTheme = async (e: React.MouseEvent, themeId: string) => {
        e.stopPropagation();
        if (!confirm('Delete this custom theme?')) return;

        try {
            await axios.delete(`/api/themes/${themeId}`);
            setCustomThemes(prev => prev.filter(t => t.id !== themeId));
            if (activeThemeId === themeId) {
                handleSetTheme('daily');
            }
        } catch (error) {
            alert('Failed to delete theme');
        }
    };

    const handleSaveNewTheme = async () => {
        if (!newTheme.name) return alert('Theme name is required');

        try {
            const res = await axios.post('/api/themes', {
                name: newTheme.name,
                colors: newTheme.colors
            });

            const colors = safeParseColors(res.data.colors);
            if (colors) {
                const created: CustomTheme = {
                    id: res.data.id,
                    name: res.data.name,
                    colors: colors,
                    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    isCustom: true
                };
                setCustomThemes(prev => [...prev, created]);
            }

            setIsModalOpen(false);
            setNewTheme({ ...newTheme, name: '' });
        } catch (error) {
            alert('Failed to create theme');
        }
    };

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Theme Manager</h1>
                    <p className="text-text-secondary">Control the visual appearance of the website.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Theme
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Daily Rotation Card */}
                    <div
                        onClick={() => handleSetTheme('daily')}
                        className={`relative cursor-pointer group rounded-xl border-2 transition-all overflow-hidden ${activeThemeId === 'daily'
                            ? 'border-primary shadow-lg shadow-primary/20'
                            : 'border-border hover:border-text-secondary'
                            }`}
                    >
                        <div className="p-6 h-full bg-card flex flex-col items-center text-center justify-center min-h-[200px]">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Daily Rotation</h3>
                            <p className="text-sm text-text-secondary">
                                Automatic
                            </p>
                            {activeThemeId === 'daily' && (
                                <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            {savingId === 'daily' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Standard Themes */}
                    {Object.entries(defaultThemes).map(([key, theme]) => (
                        <ThemeCard
                            key={key}
                            id={key}
                            name={key}
                            colors={theme.colors}
                            gradient={theme.gradient}
                            isActive={activeThemeId === key}
                            isSaving={savingId === key}
                            onSelect={() => handleSetTheme(key)}
                        />
                    ))}

                    {/* Custom Themes */}
                    {customThemes.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            id={theme.id}
                            name={theme.name}
                            colors={theme.colors}
                            gradient={theme.gradient}
                            isActive={activeThemeId === theme.id}
                            isSaving={savingId === theme.id}
                            onSelect={() => handleSetTheme(theme.id)}
                            onDelete={(e) => handleDeleteTheme(e, theme.id)}
                            isCustom
                        />
                    ))}
                </div>
            )}

            {/* Create Theme Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-text-primary">Create Custom Theme</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-text-secondary" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Theme Name</label>
                                <input
                                    type="text"
                                    value={newTheme.name}
                                    onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg p-2 text-text-primary"
                                    placeholder="My Cool Theme"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(newTheme.colors).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-text-secondary mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => setNewTheme({
                                                    ...newTheme,
                                                    colors: { ...newTheme.colors, [key as keyof ThemeColors]: e.target.value }
                                                })}
                                                className="h-10 w-16 cursor-pointer bg-transparent border-none p-0"
                                            />
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => setNewTheme({
                                                    ...newTheme,
                                                    colors: { ...newTheme.colors, [key as keyof ThemeColors]: e.target.value }
                                                })}
                                                className="flex-1 bg-background border border-border rounded-lg px-2 text-sm text-text-primary font-mono"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview */}
                            <div className="mt-4 p-4 rounded-lg border border-border" style={{ backgroundColor: newTheme.colors.background }}>
                                <div className="h-20 rounded-md mb-2 flex items-center justify-center text-xl font-bold uppercase tracking-widest text-white"
                                    style={{ background: `linear-gradient(135deg, ${newTheme.colors.primary}, ${newTheme.colors.secondary})` }}>
                                    Preview
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full" style={{ background: newTheme.colors.primary }} />
                                    <div className="h-8 w-8 rounded-full" style={{ background: newTheme.colors.secondary }} />
                                    <div className="h-8 w-8 rounded-full" style={{ background: newTheme.colors.accent }} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveNewTheme}><Save className="w-4 h-4 mr-2" /> Save Theme</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface ThemeCardProps {
    id: string;
    name: string;
    colors: ThemeColors;
    gradient: string;
    isActive: boolean;
    isSaving: boolean;
    onSelect: () => void;
    onDelete?: (e: React.MouseEvent) => void;
    isCustom?: boolean;
}

function ThemeCard({ id, name, colors, gradient, isActive, isSaving, onSelect, onDelete, isCustom }: ThemeCardProps) {
    return (
        <div
            onClick={onSelect}
            className={`relative cursor-pointer group rounded-xl border-2 transition-all overflow-hidden ${isActive
                ? 'border-primary shadow-lg scale-[1.02]'
                : 'border-border hover:border-text-secondary'
                }`}
        >
            <div className="h-32 w-full relative" style={{ background: gradient }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest drop-shadow-lg truncate px-2">
                        {name}
                    </h3>
                </div>
                {isCustom && onDelete && (
                    <button
                        onClick={onDelete}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                        title="Delete Theme"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="p-4 bg-card">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex -space-x-2">
                        {[colors.primary, colors.secondary, colors.accent].map((color: string, i: number) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-card"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    {isActive && (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                        </span>
                    )}
                </div>
            </div>

            {isSaving && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
            )}
        </div>
    );
}
