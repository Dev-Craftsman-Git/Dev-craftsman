'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Card from '@/components/ui/Card';
import { Brain, Code, Smartphone, Cpu, MessageSquare } from 'lucide-react';
import Footer from '@/components/sections/Footer';

const services = [
    {
        id: 'ai',
        title: 'AI & Machine Learning',
        icon: Brain,
        items: [
            'Machine Learning (Regression, Classification)',
            'Deep Learning (CNN, RNN, LSTM, Transformers)',
            'Natural Language Processing',
            'Computer Vision',
            'Recommendation Systems',
            'Predictive Analytics'
        ]
    },
    {
        id: 'llm',
        title: 'LLM Development',
        icon: MessageSquare,
        items: [
            'Custom AI Chatbots',
            'Fine-tuning (GPT, LLaMA, Mistral)',
            'RAG Applications',
            'AI Agents (LangChain, AutoGen)',
            'Prompt Engineering',
            'Vector Database Integration'
        ]
    },
    {
        id: 'web',
        title: 'Web Development',
        icon: Code,
        items: [
            'Frontend (React, Next.js, Angular)',
            'Backend (Node.js, Django, FastAPI)',
            'Full Stack (MERN, MEAN, LAMP)',
            'E-commerce Solutions',
            'Admin Dashboards',
            'API Development'
        ]
    },
    {
        id: 'mobile',
        title: 'Mobile App Development',
        icon: Smartphone,
        items: [
            'Android Native (Java, Kotlin)',
            'iOS Native (Swift)',
            'Cross-Platform (Flutter, React Native)',
            'App Backend (Firebase, Supabase)',
            'Play Store / App Store Deployment'
        ]
    },
    {
        id: 'iot',
        title: 'IoT Projects',
        icon: Cpu,
        items: [
            'Arduino & Raspberry Pi Projects',
            'ESP32/ESP8266 Projects',
            'Sensor Integration',
            'Home Automation',
            'Industrial IoT'
        ]
    }
];

export default function ServicesPage() {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-12 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-4 uppercase text-white"
                            style={{ textShadow: `0 0 20px ${theme.colors.primary}` }}>
                            Our Capabilities
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Comprehensive technology solutions for every dimension.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    id={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-8 md:p-10">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="flex-shrink-0">
                                                <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg"
                                                    style={{ background: theme.colors.primary }}>
                                                    <Icon size={40} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-white border-b pb-2"
                                                    style={{ borderColor: theme.colors.border }}>
                                                    {service.title}
                                                </h2>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {service.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                                                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.colors.accent }} />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
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
