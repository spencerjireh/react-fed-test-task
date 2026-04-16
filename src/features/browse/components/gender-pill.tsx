import { cva, type VariantProps } from 'class-variance-authority';
import type { Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Gender } from '../types';

export type GenderValue = Gender | 'Both';

const pill = cva(
  [
    'rounded-[4px] px-4 py-[10px] font-heading text-[16px] font-medium leading-[24px]',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light',
  ].join(' '),
  {
    variants: {
      selected: {
        true: 'bg-red-main text-white',
        false:
          'border border-red-main bg-transparent text-red-main hover:bg-red-main/10',
      },
    },
  },
);

interface GenderPillProps extends VariantProps<typeof pill> {
  value: GenderValue;
  label: string;
  isSelected: boolean;
  onSelect: (value: GenderValue) => void;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

export function GenderPill({
  ref,
  value,
  label,
  isSelected,
  onSelect,
  className,
}: GenderPillProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      onClick={() => onSelect(value)}
      className={cn(pill({ selected: isSelected }), className)}
    >
      {label}
    </button>
  );
}
