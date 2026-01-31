import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        // Base styles
        const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';

        // Variants handled via CSS variables set by theme
        // We expect the parent/theme to provide classes, but here we can defaults
        // Actually, we use the theme classes provided in our config files?
        // The requirement says "buttonStyles" in theme config.
        // However, for clean component usage, we might want to just use standard classes that map to variables.
        // Let's use the variables we set up: var(--primary), etc.

        const variants = {
            primary: 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/30',
            secondary: 'bg-secondary text-white hover:brightness-110 shadow-lg shadow-secondary/30',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
            ghost: 'hover:bg-primary/10 text-primary',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            >
                {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
export default Button;
