import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[#2e2e2e] text-white',
    secondary: 'bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 bg-transparent text-gray-700',
    destructive: 'bg-red-500 text-white',
  };
  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
