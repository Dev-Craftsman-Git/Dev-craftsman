'use client';

import { useTheme } from '@/themes/ThemeProvider';
import Card from '@/components/ui/Card';
import { Target, Zap, Users } from 'lucide-react';

import ScrollReveal from '@/components/effects/ScrollReveal';

export default function AboutSection() {
    const { theme } = useTheme();

    return (
        <section className="py-20 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-6xl font-heading font-bold mb-6 uppercase text-text-primary">
                            The <span style={{ color: theme.colors.primary }}>Origin Story</span>
                        </h2>
                        <p className="max-w-3xl mx-auto text-xl text-text-secondary">
                            Born from the idea that technology is the closest thing to real-world superpowers.
                            We are a collective of architects, engineers, and visionaries.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-8 text-center group hover:border-[var(--primary)] text-text-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Target size={32} style={{ color: theme.colors.primary }} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                            <p className="text-text-secondary">
                                To democratize access to high-end technology development for students and businesses alike.
                            </p>
                        </Card>
                        <Card className="p-8 text-center group hover:border-[var(--primary)] text-text-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Zap size={32} style={{ color: theme.colors.accent }} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                            <p className="text-text-secondary">
                                A world where every innovative idea has the technical foundation to become reality.
                            </p>
                        </Card>
                        <Card className="p-8 text-center group hover:border-[var(--primary)] text-text-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Users size={32} style={{ color: theme.colors.secondary }} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">The Team</h3>
                            <p className="text-text-secondary">
                                Led by industry experts with experience in top-tier tech firms and academic institutions.
                            </p>
                        </Card>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
