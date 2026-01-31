'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';



const navLinks = [
    { name: 'Services', href: '/#mission', alwaysVisible: true },
    { name: 'Pricing', href: '/#pricing', requiresPricing: true },
    { name: 'Portfolio', href: '/#portfolio', alwaysVisible: true },
    { name: 'About', href: '/#about', alwaysVisible: true },
    { name: 'Contact', href: '/#contact-us', alwaysVisible: true },
];

interface NavbarProps {
    showPricing?: boolean;
}

export default function Navbar({ showPricing = true }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { theme } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Scroll Spy Logic
            const visibleLinks = navLinks.filter(link => !link.requiresPricing || showPricing);
            const sections = visibleLinks.map(link => link.href.replace('/#', ''));
            let current = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // navLinks is constant, suppressing or moving definition is fine. Given it's inside component, better to disable exhaustive-deps or move logic. 
    // Actually, simpler: just suppress for this line as navLinks is effectively static config.

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const id = href.replace('/#', '');
            const element = document.getElementById(id);
            if (element) {
                const offset = 80; // Navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                setIsOpen(false);
            } else if (window.location.pathname !== '/') {
                // Navigate to home if not on home page
                window.location.assign(href);
            }
        }
    };

    // Don't show navbar on admin pages
    if (pathname?.startsWith('/devadmin')) {
        return null;
    }

    return (
        <nav
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300',
                scrolled
                    ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-border'
                    : 'bg-transparent'
            )}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="font-heading text-3xl font-bold tracking-wider text-text-primary">
                            DEV<span style={{ color: theme.colors.primary }}> CRAFTSMAN</span>
                        </span>
                    </motion.div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <div className="flex items-center space-x-8">
                        {navLinks.filter(link => !link.requiresPricing || showPricing).map((link) => {
                            const isActive = activeSection === link.href.replace('/#', '');
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className={cn(
                                        "text-sm font-medium transition-colors relative",
                                        isActive ? "text-primary" : "text-text-secondary hover:text-primary"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                        <Link href="/get-started">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-0 top-20 bg-background/95 backdrop-blur-xl z-40 overflow-y-auto"
                    >
                        <div className="flex flex-col items-center justify-center space-y-8 min-h-[calc(100vh-5rem)]">
                            {navLinks.filter(link => !link.requiresPricing || showPricing).map((link) => {
                                const isActive = activeSection === link.href.replace('/#', '');
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        className={cn(
                                            "text-2xl font-bold transition-colors",
                                            isActive
                                                ? "text-primary"
                                                : "text-text-secondary hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link href="/get-started" onClick={() => setIsOpen(false)}>
                                <Button size="lg" className="w-full text-xl px-8 py-6">Get Started</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
