
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes } from './index';
import { Theme } from './types';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import axios from 'axios';

interface ThemeContextType {
    theme: Theme;
    currentThemeId: string;
    setThemeOverride: (id: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialThemeId }: { children: React.ReactNode, initialThemeId?: string }) {
    const dailyThemeId = useDailyTheme();
    const [themeOverride, setThemeOverride] = useState<string | null>(null);
    const [activeSystemTheme, setActiveSystemTheme] = useState<string | null>(initialThemeId || null);
    const [customThemes, setCustomThemes] = useState<Record<string, Theme>>({});
    const [mounted, setMounted] = useState(false);

    interface ThemeResponse {
        id: string;
        name: string;
        colors: string | { // It can be string (JSON) or object
            primary: string;
            secondary: string;
            accent: string;
            background: string;
            card: string;
            text: string;
            textSecondary: string;
            border: string;
        };
    }

    useEffect(() => {
        setMounted(true);
        // Fetch active system theme and custom themes to ensure client is up to date
        const fetchData = async () => {
            try {
                const [activeRes, customRes] = await Promise.all([
                    axios.get('/api/themes/active'),
                    axios.get('/api/themes')
                ]);

                if (activeRes.data.themeId && activeRes.data.themeId !== 'daily') {
                    setActiveSystemTheme(activeRes.data.themeId);
                } else if (activeRes.data.themeId === 'daily') {
                    // If server says daily, we should respect it
                    setActiveSystemTheme(null);
                }

                if (Array.isArray(customRes.data)) {
                    const loadedThemes: Record<string, Theme> = {};
                    customRes.data.forEach((t: ThemeResponse) => {
                        try {
                            const colors = typeof t.colors === 'string' ? JSON.parse(t.colors) : t.colors;
                            if (colors && colors.primary) {
                                loadedThemes[t.id] = {
                                    id: t.id,
                                    name: t.name,
                                    colors,
                                    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                    pattern: 'circles', // Default pattern
                                    particleColor: colors.primary, // Default particle color
                                    buttonStyle: {
                                        primary: 'bg-primary text-white hover:opacity-90',
                                        secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                                    }
                                };
                            }
                        } catch (e) {
                            console.error('Failed to parse custom theme:', t.id, e);
                        }
                    });
                    setCustomThemes(loadedThemes);
                }
            } catch (error) {
                console.error("Failed to fetch themes", error);
            }
        };
        fetchData();
    }, []);

    // Merge default themes with custom themes
    const allThemes = { ...themes, ...customThemes };

    // Priority: 1. Manual User Override (dev/demo), 2. System Active Theme (Admin set), 3. Daily Theme
    const currentThemeId = themeOverride || activeSystemTheme || dailyThemeId;
    const theme = allThemes[currentThemeId] || themes.captain;

    // We render children immediately to avoid flicker. 
    // The server provided the initial theme, so it should match (mostly).

    return (
        <ThemeContext.Provider value={{ theme, currentThemeId, setThemeOverride }}>
            <div
                style={
                    {
                        '--primary': theme.colors.primary,
                        '--secondary': theme.colors.secondary,
                        '--accent': theme.colors.accent,
                        '--background': theme.colors.background,
                        '--card-bg': theme.colors.card,
                        '--text-primary': theme.colors.text,
                        '--text-secondary': theme.colors.textSecondary,
                        '--border-color': theme.colors.border,
                        '--gradient-main': theme.gradient,
                    } as React.CSSProperties
                }
                className="min-h-screen transition-colors duration-500 bg-background text-text-primary font-sans"
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
