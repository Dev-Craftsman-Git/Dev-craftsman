'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@/themes/ThemeProvider';
import { Mail, Phone } from 'lucide-react';

interface FooterProps {
    showPricing?: boolean;
}

export default function Footer({ showPricing = true }: FooterProps) {
    const { theme } = useTheme();
    // ... (omitting unchanged lines for brevity in prompt context, but in tool use I must be precise or use replace)
    // Actually, I need to replace the function signature and the link rendering.
    // Since they are far apart, I should use multi_replace or two replace calls.
    // I'll use replace_file_content for the prop first.

    const [contactInfo, setContactInfo] = useState({
        email: 'hello@devcraftsman.com',
        phone: '+1 (555) 123-4567',
        instagram: '@devcraftsman'
    });

    useEffect(() => {
        axios.get('/api/contact-info')
            .then(res => {
                if (res.data) setContactInfo(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <footer className="border-t border-border bg-background pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-heading text-3xl font-bold tracking-wider text-text-primary">
                                DEV<span style={{ color: theme.colors.primary }}> CRAFTSMAN</span>
                            </span>
                        </Link>
                        <p className="text-sm text-text-secondary">
                            Unleash your project superpowers with our premium development services.
                            From AI agents to full-stack applications.
                        </p>

                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold text-text-primary font-heading tracking-wide">Services</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href="/services#ai" className="hover:text-primary">AI & Machine Learning</Link></li>
                            <li><Link href="/services#web" className="hover:text-primary">Web Development</Link></li>
                            <li><Link href="/services#mobile" className="hover:text-primary">App Development</Link></li>
                            <li><Link href="/services#iot" className="hover:text-primary">IoT Solutions</Link></li>
                            <li><Link href="/services#blockchain" className="hover:text-primary">Blockchain</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold text-text-primary font-heading tracking-wide">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/portfolio" className="hover:text-primary">Portfolio</Link></li>
                            {showPricing && <li><Link href="/pricing" className="hover:text-primary">Pricing Plans</Link></li>}
                            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold text-text-primary font-heading tracking-wide">Contact</h3>
                        <ul className="space-y-4 text-sm text-text-secondary">

                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary" />
                                <span>{contactInfo.phone}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary" />
                                <span>{contactInfo.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-text-secondary">
                    &copy; {new Date().getFullYear()} Dev Craftsman. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
