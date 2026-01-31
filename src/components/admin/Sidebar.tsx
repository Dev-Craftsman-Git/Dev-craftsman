
'use client';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, DollarSign, MessageSquare, Inbox, FileText, ClipboardList, Palette, LogOut, ShieldCheck } from 'lucide-react';

import { useTheme } from '@/themes/ThemeProvider';
import { themes } from '@/themes';

export function AdminSidebar() {
    const pathname = usePathname();
    const { currentThemeId, setThemeOverride } = useTheme();

    const links = [
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/sections', label: 'Sections', icon: FolderKanban },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/projects', label: 'Projects', icon: FolderKanban },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/pricing', label: 'Pricing', icon: DollarSign },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/submissions', label: 'Inquiries', icon: Inbox },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/forms', label: 'Form Builder', icon: ClipboardList },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/themes', label: 'Themes', icon: Palette },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/content/get-started', label: 'Page Content', icon: FileText },
        { href: '/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/contact', label: 'Contact Info', icon: MessageSquare },
    ];

    return (
        <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 overflow-y-auto z-50 flex flex-col backdrop-blur-md">
            <div className="p-6 border-b border-border">
                <h1 className="text-xl font-bold tracking-tighter text-white">
                    <span className="text-primary">Dev</span>Craftsman
                </h1>
                <div className="text-xs text-gray-500 mt-1">ADMIN CONSOLE</div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary text-white font-medium shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                        >
                            <Icon size={18} />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="mb-4">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Theme</p>
                    <div className="px-4 flex flex-wrap gap-2">
                        {Object.keys(themes).map((themeKey) => (
                            <button
                                key={themeKey}
                                onClick={() => setThemeOverride(themeKey)}
                                title={themeKey}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${currentThemeId === themeKey
                                    ? 'border-white scale-110 shadow-md'
                                    : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                    }`}
                                style={{ backgroundColor: themes[themeKey].colors.primary }}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/dev/crafts/adminpanel/admin-db/adminpanellogin/login' })}
                    className="flex w-full items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors mb-2"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>

                <div className="flex items-center space-x-3 text-text-secondary text-sm px-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>System Operational</span>
                </div>
            </div>
        </aside>
    );
}
