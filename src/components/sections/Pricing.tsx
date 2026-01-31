'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Check } from 'lucide-react';
import ScrollReveal from '../effects/ScrollReveal';

type Feature = {
    id: string;
    text: string;
    isEnabled: boolean;
};



export default function Pricing() {
    const { theme } = useTheme();
    const [type, setType] = useState<'student' | 'commercial'>('student');
    const [plans, setPlans] = useState<{
        id: string;
        name: string;
        price: number;
        features: Feature[];
        isPopular?: boolean;
        currency?: string;
        originalPrice?: number;
        recommended?: boolean;
    }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch plans based on type
        // Add timestamp to prevent caching
        fetch(`/api/pricing?type=${type}&t=${new Date().getTime()}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                console.log('Fetched pricing plans:', data);
                if (Array.isArray(data)) {
                    setPlans(data);
                } else {
                    console.error('Data is not an array:', data);
                    setPlans([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch pricing plans:', err);
                setPlans([]);
                setLoading(false);
            });
    }, [type]);

    return (
        <section className="py-20">
            <ScrollReveal>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold mb-6 text-text-primary uppercase">
                            Choose Your <span style={{ color: theme.colors.primary }}>Plan</span>
                        </h2>

                        <div className="inline-flex rounded-lg p-1 border backdrop-blur-md relative z-10"
                            style={{ borderColor: theme.colors.border, background: 'rgba(255,255,255,0.05)' }}>
                            <button
                                onClick={() => {
                                    setType('student');
                                    setLoading(true);
                                }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'student' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'
                                    }`}
                            >
                                For Students
                            </button>
                            <button
                                onClick={() => {
                                    setType('commercial');
                                    setLoading(true);
                                }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'commercial' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'
                                    }`}
                            >
                                For Commercial
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <div className="col-span-3 flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                plans.map((plan) => (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className={`relative h-full flex flex-col ${plan.isPopular ? 'border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]' : ''}`}>
                                            {plan.isPopular && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase text-white shadow-lg"
                                                    style={{ background: theme.colors.primary }}>
                                                    Recommended
                                                </div>
                                            )}

                                            <div className="mb-6 text-center">
                                                <h3 className="text-xl font-bold uppercase text-text-secondary">{plan.name}</h3>
                                                <div className="mt-4 text-4xl font-bold text-text-primary shadow-glow" style={{ textShadow: `0 0 10px ${theme.colors.card}` }}>
                                                    {plan.currency === 'INR' ? '₹' : plan.currency} {plan.price.toLocaleString()}
                                                </div>
                                                {plan.originalPrice && (
                                                    <div className="text-sm text-text-secondary line-through mt-1">
                                                        {plan.currency === 'INR' ? '₹' : plan.currency} {plan.originalPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            <ul className="mb-8 flex-1 space-y-4">
                                                {plan.features.map((feature: Feature) => (
                                                    <li key={feature.id} className="flex items-start text-sm text-text-secondary">
                                                        <Check className="mr-3 h-5 w-5 flex-shrink-0" style={{ color: theme.colors.accent }} />
                                                        {feature.text}
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link href="/get-started" className='w-full'>
                                                <Button variant={plan.isPopular ? 'primary' : 'secondary'} className="w-full">
                                                    Select Plan
                                                </Button>
                                            </Link>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}
