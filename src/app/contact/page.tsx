'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@/themes/ThemeProvider';
import Footer from '@/components/sections/Footer';
import { motion } from 'framer-motion';
import { Instagram, Phone, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const { theme } = useTheme();

    const [contactInfo, setContactInfo] = useState({
        instagram: '@devcraftsman',
        whatsapp: 'Join Our Community',
        email: 'contact@devcraftsman.com',
        phone: '+1 (555) 123-4567'
    });

    useEffect(() => {
        axios.get('/api/contact-info')
            .then(res => {
                if (res.data) setContactInfo(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const contactMethods = [
        {
            icon: Instagram,
            label: 'Instagram',
            value: 'Follow us on Instagram',
            href: contactInfo.instagram,
            color: '#E1306C'
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: 'Chat with us',
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
            href: `tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`,
            color: theme.colors.secondary
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 flex items-center justify-center py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-4 uppercase text-white">
                            Contact <span style={{ color: 'white', textShadow: `0 0 20px ${theme.colors.primary}` }}>Us</span>
                        </h1>
                        <p className="text-[var(--text-secondary)] text-xl">
                            Reach out through our secure channels.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {contactMethods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <motion.div
                                    key={method.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={method.href} target="_blank" rel="noopener noreferrer">
                                        <div className="group relative overflow-hidden rounded-2xl border bg-white/5 p-8 transition-all hover:bg-white/10"
                                            style={{ borderColor: theme.colors.primary }}>
                                            <div className="flex items-center space-x-6">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:scale-110"
                                                    style={{ color: method.color }}>
                                                    <Icon size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                                                        {method.label}
                                                    </h3>
                                                    <p className="text-[var(--text-secondary)] font-mono">
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
            </div>
            <Footer />
        </div>
    );
}
