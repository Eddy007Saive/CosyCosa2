'use client';

import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '@/lib/utils';
import 'react-day-picker/style.css';

export type CalendarProps = DayPickerProps;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      {...props}
    />
  );
}
