'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';


export default function Hero() {
    const { theme } = useTheme();

    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
            {/* Background Glow */}
            <div
                className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]"
                style={{ background: theme.colors.primary }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="z-10 max-w-4xl"
            >
                {/* Daily Theme Badge Removed */}

                <h1 className="mb-6 font-heading font-bold uppercase tracking-tighter shadow-xl transition-colors duration-500"
                    style={{
                        fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                        lineHeight: 1.1,
                        textShadow: `0 0 20px ${theme.colors.primary}`,
                        WebkitTextStroke: '2px rgba(255,255,255,0.1)'
                    }}>
                    Unleash Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary">
                        Project Superpowers
                    </span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-text-secondary"
                    style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>
                    From AI Agents to Full-Stack Architectures. We build technical marvels that define the future.
                    Expert custom development for Students & Commercial Enterprises.
                </p>

                {/* Buttons removed as per request */}
                {/* <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                    <Link href="/services">
                        <Button size="lg" className="group">
                            Explore Services
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="secondary" size="lg" className="group">
                            Get A Quote
                            <ArrowRight className="ml-2 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </Button>
                    </Link>
                </div> */}
            </motion.div>

            {/* Scroll Indicator */}
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-text-secondary"
            >
                <span className="text-xs uppercase tracking-widest">Scroll to Reveal</span>
            </motion.div> */}
        </section>
    );
}
