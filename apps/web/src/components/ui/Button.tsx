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
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
          {
            'bg-[#2A7C13] text-white hover:bg-[#2A7C13]/90': variant === 'primary',
            'bg-[#76C457] text-white hover:bg-[#76C457]/90': variant === 'secondary',
            'border border-[#2A7C13] dark:border-[#76C457] text-[#2A7C13] dark:text-[#76C457] hover:bg-[#FFF8CF] dark:hover:bg-[#2A7C13]/20': variant === 'outline',
            'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300': variant === 'ghost',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 py-2 px-4': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
