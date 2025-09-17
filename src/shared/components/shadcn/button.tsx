import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100 hover:from-purple-100/70 hover:to-violet-100/70 dark:hover:from-purple-900/50 dark:hover:to-violet-900/50',
        'gradient-gray': 'text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-100/70 hover:to-slate-100/70 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50',
        'gradient-red': 'text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:from-red-100/70 hover:to-pink-100/70 dark:hover:from-red-900/50 dark:hover:to-pink-900/50',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';
