
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Alex Stark",
        role: "CSE Student, IIT Delhi",
        text: "Dev Craftsman helped me finish my final year project in record time. The code quality was insane, literally superhero level!",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        id: 2,
        name: "Sarah Banner",
        role: "CTO, TechStart",
        text: "We needed an MVP for our AI startup. They delivered a scalable solution that helped us secure seed funding. Highly recommended.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: 3,
        name: "Peter P.",
        role: "Freelance Developer",
        text: "I was stuck on a complex React Native bug for weeks. Their consultation cleared it up in hours. These guys know their stuff.",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    }
];

export default function Testimonials() {
    // const { theme } = useTheme();

    return (
        <section className="py-20 bg-black/40">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-heading mb-4 text-text-primary">
                            Alliance Feedback
                        </h2>
                        <div className="h-1 w-24 mx-auto rounded-full bg-primary mb-6 shadow-[0_0_15px_var(--primary)]" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full relative p-8 border-t-4 border-t-accent">
                                <Quote className="absolute top-4 right-4 text-accent opacity-20 w-12 h-12" />

                                <p className="text-text-secondary mb-6 italic relative z-10">
                                    &quot;{t.text}&quot;
                                </p>

                                <div className="flex items-center mt-auto">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary relative">
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary font-heading tracking-wide">{t.name}</h4>
                                        <p className="text-xs text-primary uppercase font-bold">{t.role}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
