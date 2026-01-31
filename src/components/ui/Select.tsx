import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            'flex h-11 w-full appearance-none rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                            error && 'border-red-500 focus-visible:ring-red-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        <option value="" disabled selected>Select an option</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-black text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-text-secondary pointer-events-none" />
                </div>
                {error && (
                    <p className="text-xs text-red-500 animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
