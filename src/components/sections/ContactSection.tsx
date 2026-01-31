'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@/themes/ThemeProvider';
import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContactSection() {
    const { theme } = useTheme();
    const [contactInfo, setContactInfo] = useState({
        instagram: '@devcraftsman',
        whatsapp: 'Join Our Community',
        email: 'contact@devcraftsman.com',
        phone: '+91 98765 43210'
    });

    useEffect(() => {
        axios.get('/api/contact-info')
            .then(res => {
                if (res.data) setContactInfo(prev => ({ ...prev, ...res.data }));
            })
            .catch(err => console.error(err));
    }, []);

    const contactMethods = [
        {
            icon: Instagram,
            label: 'Instagram',
            value: contactInfo.instagram,
            href: contactInfo.instagram.startsWith('http') ? contactInfo.instagram : `https://instagram.com/${contactInfo.instagram.replace('@', '')}`,
            color: '#E1306C'
        },
        {
            icon: MessageCircle,
            label: 'Community',
            value: 'Join Our Community',
            href: contactInfo.whatsapp,
            color: '#25D366'
        },
        {
            icon: Mail,
            label: 'Email',
            value: contactInfo.email,
            href: `mailto:${contactInfo.email}`,
            color: theme.colors.primary
        },
        {
            icon: Phone,
            label: 'Phone',
            value: contactInfo.phone,
            href: `tel:${contactInfo.phone}`,
            color: theme.colors.secondary
        }
    ];

    return (
        <section className="py-20 bg-background border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-6xl font-heading font-bold mb-4 uppercase text-text-primary">
                        Contact <span style={{ color: theme.colors.primary }}>Us</span>
                    </h2>
                    <p className="text-text-secondary text-xl max-w-2xl mx-auto">
                        Ready to start your project? Reach out through our direct channels.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <motion.div
                                key={method.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={method.href} target="_blank" rel="noopener noreferrer">
                                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white/5 p-8 transition-all hover:bg-white/10 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:scale-110"
                                                style={{ color: method.color }}>
                                                <Icon size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                    {method.label}
                                                </h3>
                                                <p className="text-text-secondary font-mono text-sm mt-1 max-w-[200px] truncate mx-auto">
                                                    {method.value}
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
