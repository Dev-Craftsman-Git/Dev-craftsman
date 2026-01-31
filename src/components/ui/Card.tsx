import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={hoverEffect ? { opacity: 0, y: 20 } : undefined}
                whileInView={hoverEffect ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
                className={cn(
                    'rounded-xl border border-border bg-card backdrop-blur-md p-6 shadow-xl',
                    className
                )}
                {...props as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
