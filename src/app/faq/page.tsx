'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Footer from '@/components/sections/Footer';
import Card from '@/components/ui/Card';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const faqs = [
    {
        category: 'General',
        items: [
            { q: 'What is Dev Craftsman?', a: 'Dev Craftsman is a premium development service for students and businesses, offering custom tech solutions from AI to Web Apps.' },
            { q: 'How does the process work?', a: 'Choose your category (Student/Commercial), fill out the form, get a quote/consultation, and we start building.' },
        ]
    },
    {
        category: 'Students',
        items: [
            { q: 'Do you provide source code?', a: 'Yes, all student packages include full source code and documentation as per the plan selected.' },
            { q: 'Can you help with final year projects?', a: 'Absolutely. We specialize in Major and Minor projects for B.Tech, MCA, and M.Tech students.' },
        ]
    },
    {
        category: 'Commercial',
        items: [
            { q: 'What tech stack do you use?', a: 'We use modern stacks like MERN, Next.js, Python/Django, Flutter, and sophisticated AI frameworks.' },
            { q: 'Do you offer post-launch support?', a: 'Yes, our business packages come with 30-60 days of support, and we offer maintenance contracts.' },
        ]
    }
];

export default function FAQPage() {
    const { theme } = useTheme();
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-12 pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-4 uppercase text-white">
                            F<span style={{ color: 'white', textShadow: `0 0 20px ${theme.colors.primary}` }}>AQ</span>
                        </h1>
                        <p className="text-[var(--text-secondary)]">Common questions about our services and protocols.</p>
                    </div>

                    <div className="space-y-8">
                        {faqs.map((section) => (
                            <div key={section.category}>
                                <h2 className="text-2xl font-bold font-heading mb-4 text-[var(--primary)]">{section.category}</h2>
                                <div className="space-y-4">
                                    {section.items.map((item, idx) => {
                                        const id = `${section.category}-${idx}`;
                                        const isOpen = openIndex === id;
                                        return (
                                            <Card
                                                key={id}
                                                className="p-0 overflow-hidden cursor-pointer"
                                                hoverEffect={false}
                                                onClick={() => toggle(id)}
                                            >
                                                <div className="flex items-center justify-between p-6">
                                                    <h3 className="text-lg font-medium text-white">{item.q}</h3>
                                                    <button className="text-[var(--primary)]">
                                                        {isOpen ? <Minus /> : <Plus />}
                                                    </button>
                                                </div>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="px-6 pb-6 text-[var(--text-secondary)]"
                                                        >
                                                            {item.a}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
}
