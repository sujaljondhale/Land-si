import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary hover:bg-[#1f5c0e] text-white shadow-lg shadow-primary/20 border-transparent': variant === 'primary',
            'bg-[#76C457] hover:bg-[#5da341] text-white shadow-lg shadow-[#76C457]/20 border-transparent': variant === 'secondary',
            'border-2 border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 bg-white dark:bg-neutral-900': variant === 'outline',
            'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 bg-transparent': variant === 'ghost',
            'h-9 px-4 text-sm rounded-lg': size === 'sm',
            'h-11 px-6 text-[15px] rounded-xl': size === 'md',
            'h-14 px-8 text-[16px] rounded-2xl': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
