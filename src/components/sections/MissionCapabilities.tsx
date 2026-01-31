'use client';

import { useTheme } from '@/themes/ThemeProvider';
import { Brain, Code, Smartphone, Cpu, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';

const capabilities = [
    {
        icon: Brain,
        title: 'AI & Machine Learning',
        description: 'Custom ML models, Deep Learning, and Predictive Analytics.',
        id: 'ai'
    },
    {
        icon: Code,
        title: 'Web Development',
        description: 'Full-stack applications using React, Next.js, and Node.js.',
        id: 'web'
    },
    {
        icon: Smartphone,
        title: 'Mobile App Dev',
        description: 'Native and Cross-platform apps for Android and iOS.',
        id: 'mobile'
    },
    {
        icon: Cpu,
        title: 'IoT Solutions',
        description: 'Smart hardware integration with Arduino and Raspberry Pi.',
        id: 'iot'
    },
    {
        icon: ShieldCheck,
        title: 'Tech Consulting',
        description: 'Expert guidance on architecture and technology stack.',
        id: 'consulting'
    }
];

export default function MissionCapabilities() {
    const { theme } = useTheme();

    return (
        <section className="py-20 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2
                        className="text-3xl sm:text-5xl font-heading font-bold mb-4 uppercase tracking-wide"
                        style={{ color: theme.colors.primary }}
                    >
                        Our Mission Capabilities
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Equipping you with the technology to build the future.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center">
                    {capabilities.map((cap) => {
                        const Icon = cap.icon;
                        return (
                            <Card
                                key={cap.id}
                                className="group relative p-8 border border-border bg-card hover:border-primary transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <div
                                        className="w-24 h-24 rounded-full blur-2xl"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    ></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-3 rounded-lg border bg-opacity-10"
                                        style={{
                                            borderColor: `${theme.colors.secondary}40`, // 25% opacity
                                            backgroundColor: `${theme.colors.secondary}20`, // 12% opacity
                                            color: theme.colors.secondary
                                        }}>
                                        <Icon size={32} />
                                    </div>

                                    <h3
                                        className="text-xl font-bold mb-3 transition-colors group-hover:text-primary text-text-primary font-heading"
                                    >
                                        {cap.title}
                                    </h3>

                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {cap.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
