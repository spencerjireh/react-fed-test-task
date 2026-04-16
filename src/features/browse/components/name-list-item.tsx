import type { Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (id: string) => void;
  ref?: Ref<HTMLButtonElement>;
}

export function NameListItem({
  ref,
  name,
  isSelected,
  onSelect,
}: NameListItemProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isSelected}
      data-name-id={name.id}
      onClick={() => onSelect(name.id)}
      className={cn(
        'block w-full text-left font-heading transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        isSelected
          ? 'text-[28px] font-normal leading-tight text-red-main md:text-[45px]'
          : 'text-[20px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[35px]',
      )}
    >
      {name.title}
    </button>
  );
}
