import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function NameListItem({
  name,
  isSelected,
  onSelect,
}: NameListItemProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(name.id)}
      className={cn(
        'block w-full text-left font-heading transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        isSelected
          ? 'text-[45px] font-normal leading-tight text-red-main'
          : 'text-[35px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark',
      )}
    >
      {name.title}
    </button>
  );
}
