'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Footer from '@/components/sections/Footer';
import Card from '@/components/ui/Card';
import { Users, Target, Zap } from 'lucide-react';

export default function AboutPage() {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-12 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-6 uppercase text-white">
                            The <span style={{ color: 'white', textShadow: `0 0 20px ${theme.colors.primary}` }}>Origin Story</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-text-secondary">
                            Born from the idea that technology is the closest thing to real-world superpowers.
                            We are a collective of architects, engineers, and visionaries dedicated to building the future.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <Card className="p-8 text-center group hover:border-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Target size={32} style={{ color: theme.colors.primary }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                            <p className="text-text-secondary">
                                To democratize access to high-end technology development for students and businesses alike.
                            </p>
                        </Card>
                        <Card className="p-8 text-center group hover:border-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Zap size={32} style={{ color: theme.colors.accent }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-text-secondary">
                                A world where every innovative idea has the technical foundation to become reality.
                            </p>
                        </Card>
                        <Card className="p-8 text-center group hover:border-primary">
                            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-background border border-border group-hover:scale-110 transition-transform">
                                <Users size={32} style={{ color: theme.colors.secondary }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">The Team</h3>
                            <p className="text-text-secondary">
                                Led by industry experts with experience in top-tier tech firms and academic institutions.
                            </p>
                        </Card>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-heading font-bold text-center mb-12 text-white">Why Dev Craftsman?</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {['Industry Standard Code', '24/7 Expert Support', 'Futuristic UI/UX', 'On-Time Delivery'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-lg border border-border bg-card text-center font-bold text-white"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
}
