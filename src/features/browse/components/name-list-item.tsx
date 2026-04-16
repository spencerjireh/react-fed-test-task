import type { Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (title: string) => void;
  ref?: Ref<HTMLButtonElement>;
  isCentered?: boolean;
  variant?: 'detail' | 'results';
}

export function NameListItem({
  ref,
  name,
  isSelected,
  onSelect,
  isCentered = false,
  variant = 'detail',
}: NameListItemProps) {
  const renderAsFocal = isSelected || isCentered;

  return (
    <button
      ref={ref}
      type="button"
      data-name-title={name.title}
      onClick={() => onSelect(name.title)}
      className={cn(
        'block w-full font-heading transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        variant === 'results' ? 'text-center' : 'text-left',
        renderAsFocal
          ? variant === 'results'
            ? 'text-[30px] font-normal leading-tight text-red-main md:text-[52px]'
            : 'text-[28px] font-normal leading-tight text-red-main md:text-[45px]'
          : variant === 'results'
            ? 'text-[22px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[40px]'
            : 'text-[20px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[35px]',
      )}
    >
      {name.title}
    </button>
  );
}
