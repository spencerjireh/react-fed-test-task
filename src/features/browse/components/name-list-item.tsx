import type { Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (title: string) => void;
  ref?: Ref<HTMLButtonElement>;
  centerDistance?: number | null;
  variant?: 'detail' | 'results';
}

export function NameListItem({
  ref,
  name,
  isSelected,
  onSelect,
  centerDistance = null,
  variant = 'detail',
}: NameListItemProps) {
  const isCenter = centerDistance === 0;
  const renderAsFocal = isSelected || isCenter;

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isSelected}
      data-name-title={name.title}
      onClick={() => onSelect(name.title)}
      className={cn(
        'block w-full font-heading transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        variant === 'results' ? 'text-center' : 'text-left',
        renderAsFocal
          ? variant === 'results'
            ? 'text-[36px] font-normal leading-tight text-red-main md:text-[64px]'
            : 'text-[28px] font-normal leading-tight text-red-main md:text-[45px]'
          : variant === 'results'
            ? 'text-[26px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[48px]'
            : 'text-[20px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[35px]',
      )}
    >
      {name.title}
    </button>
  );
}
