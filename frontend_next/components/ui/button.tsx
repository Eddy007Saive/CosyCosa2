'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 transition-colors disabled:pointer-events-none disabled:opacity-50 text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-[#2e2e2e] text-white hover:bg-black rounded-full uppercase tracking-widest text-xs',
        secondary: 'bg-transparent border border-[#2e2e2e] text-[#2e2e2e] hover:bg-[#2e2e2e] hover:text-white rounded-full uppercase tracking-widest text-xs',
        ghost: 'hover:bg-gray-100 text-[#2e2e2e]',
        outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-[#2e2e2e]',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        link: 'text-[#2e2e2e] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-8 py-4',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-10',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
