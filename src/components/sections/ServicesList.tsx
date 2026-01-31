'use client';

import { useTheme } from '@/themes/ThemeProvider';
import Card from '../ui/Card';
import { Brain, Code, Smartphone, Cpu, ShieldCheck } from 'lucide-react';

const services = [
    {
        id: 'ai',
        title: 'AI & Machine Learning',
        icon: Brain,
        description: 'Custom ML models, Deep Learning, and Predictive Analytics.',
    },
    {
        id: 'web',
        title: 'Web Development',
        icon: Code,
        description: 'Full-stack applications using React, Next.js, and Node.js.',
    },
    {
        id: 'app',
        title: 'Mobile App Dev',
        icon: Smartphone,
        description: 'Native and Cross-platform apps for Android and iOS.',
    },
    {
        id: 'iot',
        title: 'IoT Solutions',
        icon: Cpu,
        description: 'Smart hardware integration with Arduino and Raspberry Pi.',
    },
    {
        id: 'consulting',
        title: 'Tech Consulting',
        icon: ShieldCheck,
        description: 'Expert guidance on architecture and technology stack.',
    },
];

export default function ServicesList() {
    const { theme } = useTheme();

    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold font-heading uppercase text-text-primary sm:text-4xl" style={{ color: theme.colors.primary }}>
                        Our Mission Capabilities
                    </h2>
                    <p className="mx-auto max-w-2xl text-text-secondary">
                        Equipping you with the technology to build the future.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Card key={service.id} className="relative group overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150"
                                    style={{ background: theme.colors.primary }} />

                                <div className="relative z-10">
                                    <div className="mb-4 inline-flex items-center justify-center rounded-lg p-3"
                                        style={{ background: 'rgba(255,255,255,0.05)', color: theme.colors.accent }}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-text-secondary">
                                        {service.description}
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
