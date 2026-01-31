'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import Card from '@/components/ui/Card';
import { GraduationCap, Building2 } from 'lucide-react';

interface ContactSelectorProps {
    onSelect: (type: 'student' | 'commercial') => void;
}

export default function ContactSelector({ onSelect }: ContactSelectorProps) {
    const { theme } = useTheme();

    return (
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('student')}
                className="cursor-pointer"
            >
                <Card className="h-full flex flex-col items-center justify-center p-12 text-center hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all">
                    <div className="mb-6 rounded-full p-6 text-white" style={{ background: theme.colors.primary }}>
                        <GraduationCap size={48} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold font-heading text-white">FOR STUDENTS</h3>
                    <p className="text-text-secondary">
                        Academic Projects, Final Year Submissions, and Learning Modules.
                    </p>
                    <div className="mt-6 text-sm font-bold uppercase tracking-widest" style={{ color: theme.colors.accent }}>
                        Select Option &rarr;
                    </div>
                </Card>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('commercial')}
                className="cursor-pointer"
            >
                <Card className="h-full flex flex-col items-center justify-center p-12 text-center hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all">
                    <div className="mb-6 rounded-full p-6 text-white" style={{ background: theme.colors.secondary }}>
                        <Building2 size={48} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold font-heading text-white">FOR COMMERCIAL</h3>
                    <p className="text-text-secondary">
                        Business Solutions, MVP Development, and Enterprise Software.
                    </p>
                    <div className="mt-6 text-sm font-bold uppercase tracking-widest" style={{ color: theme.colors.accent }}>
                        Select Option &rarr;
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
