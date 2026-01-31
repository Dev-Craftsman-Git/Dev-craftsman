'use client';

import { useTheme } from '@/themes/ThemeProvider';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/effects/ScrollReveal';

export default function GetStartedSection() {
    const { theme } = useTheme();

    return (
        <section className="py-20 bg-card border-t border-border">
            <ScrollReveal>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-6xl font-heading font-bold mb-6 uppercase text-text-primary">
                            Start Your <span style={{ color: theme.colors.primary }}>Mission</span>
                        </h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                            Select your category to proceed with the secure communication channel.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Student Card */}
                        <Link href="/get-started?type=student">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-background border border-border rounded-2xl p-10 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col items-center text-center relative z-10">
                                    <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-6 border border-border group-hover:border-primary transition-colors">
                                        <GraduationCap className="w-12 h-12 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2 uppercase">For Students</h3>
                                    <p className="text-text-secondary mb-8 text-sm">
                                        Academic Projects, Final Year Submissions, and Learning Modules.
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-bold tracking-widest uppercase">
                                        Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Commercial Card */}
                        <Link href="/get-started?type=commercial">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-background border border-border rounded-2xl p-10 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col items-center text-center relative z-10">
                                    <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-6 border border-border group-hover:border-primary transition-colors">
                                        <Building2 className="w-12 h-12 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2 uppercase">For Commercial</h3>
                                    <p className="text-text-secondary mb-8 text-sm">
                                        Business Solutions, MVP Development, and Enterprise Software.
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-bold tracking-widest uppercase">
                                        Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}
